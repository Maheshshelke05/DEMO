// Turns the photos in photos/ into the site's pictures, one for every spot on the pages (see slots.mjs).
//
//   npm run photos      also runs by itself before `npm run dev` and `npm run build`
//
// Photos fill the spots in file-name order and repeat when there are fewer photos than spots.
// A file named after a spot (cover.jpg, finale.jpg, camera-03.png ...) goes exactly there instead.
// Each one is cropped to its spot's shape around the most interesting part, given that page's film look
// (colour only: faces are never reshaped), stripped of all metadata including GPS, and saved in three
// widths plus a tiny blur preview. With no photos at all, labelled placeholders show where they will go.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { SLOTS } from './slots.mjs'
import { GRADES, grade, grain } from './grades.mjs'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(ROOT, 'photos')
const OUT = path.join(ROOT, 'public', 'photos')
const DATA = path.join(ROOT, 'src', 'data', 'photos.generated.json')
// Which source made which output. Kept out of the site, so file names never reach the page.
const CACHE = path.join(ROOT, 'node_modules', '.cache', 'bday-wishes-photos.json')
const WIDTHS = [480, 720, 1080]
const QUALITY = { 480: 70, 720: 72, 1080: 76 }
const READABLE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif'])
const VERSION = 1

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------- which photo goes where
function plan() {
  const names = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => !f.startsWith('.') && f !== 'README.md') : []
  const usable = names
    .filter((f) => READABLE.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  for (const f of names.filter((f) => !READABLE.has(path.extname(f).toLowerCase()))) {
    const heic = /\.hei[cf]$/i.test(f)
    console.warn(`  skipped ${f}: ${heic ? 'iPhone HEIC photos cannot be read here, save it as a JPG first' : 'not a photo'}`)
  }
  const keyOf = (f) => path.basename(f, path.extname(f)).toLowerCase()
  const keys = new Set(SLOTS.map((s) => s.key))
  const pinned = new Map(usable.filter((f) => keys.has(keyOf(f))).map((f) => [keyOf(f), f]))
  let pool = usable.filter((f) => !keys.has(keyOf(f)))
  if (!pool.length) pool = usable
  let next = 0
  const files = SLOTS.map((slot) => pinned.get(slot.key) ?? (pool.length ? pool[next++ % pool.length] : null))
  return { files, usable, pinned, pool }
}

// ---------------------------------------------------------------- placeholders
const PALETTES = [
  ['#FFE0EA', '#F28BAE', '#57131F'],
  ['#FFF1D8', '#FFB6D5', '#57131F'],
  ['#FFB6D5', '#FFF1D8', '#A71930'],
  ['#F28BAE', '#FFE0EA', '#57131F'],
]

function placeholder(slot, i) {
  const w = 1080
  const h = Math.round(w / slot.ratio)
  const [from, to, ink] = PALETTES[i % PALETTES.length]
  const s = w * 0.34
  const cy = h * 0.42
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <path transform="translate(${w / 2 - s / 2} ${cy - s / 2}) scale(${s / 100})" fill="#FFFDF8" opacity=".72"
    d="M50 90 C 22 68, 4 52, 6 32 C 8 14, 32 8, 50 28 C 68 8, 92 14, 94 32 C 96 52, 78 68, 50 90Z"/>
  <text x="50%" y="${cy + s * 0.66}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${w * 0.074}" fill="${ink}">your photo here</text>
  <text x="50%" y="${cy + s * 0.66 + w * 0.08}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="${w * 0.05}" fill="${ink}" opacity=".7">${slot.key}</text>
</svg>`)
}

// ---------------------------------------------------------------- one spot
const raw = (im) => ({ raw: { width: im.width, height: im.height, channels: 3 } })
const asImage = ({ data, info }) => ({ data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), width: info.width, height: info.height })
const toBuffer = (d) => Buffer.from(d.buffer, d.byteOffset, d.length)

async function cropTo(input, ratio) {
  const meta = await sharp(input, { failOn: 'none' }).metadata()
  const [w, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height]
  const width = Math.max(1, Math.min(WIDTHS.at(-1), Math.floor(Math.min(w, h * ratio))))
  const out = await sharp(input, { failOn: 'none' })
    .rotate()
    .flatten({ background: '#FFFDF8' })
    .resize(width, Math.max(1, Math.round(width / ratio)), { fit: 'cover', position: sharp.strategy.attention })
    .toColourspace('srgb')
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return asImage(out)
}

async function build(slot, i, file) {
  const isPlaceholder = !file
  const im = await cropTo(isPlaceholder ? placeholder(slot, i) : path.join(SRC, file), slot.ratio)
  const graded = isPlaceholder ? im : await grade(im, slot.grade)
  const noise = isPlaceholder ? 0 : GRADES[slot.grade]?.[1] ?? 6
  const tiny = await sharp(toBuffer(graded.data), raw(graded))
    .resize(10, Math.max(1, Math.round((10 * graded.height) / graded.width)))
    .webp({ quality: 30 })
    .toBuffer()
  const entry = { w: graded.width, h: graded.height, blur: `data:image/webp;base64,${tiny.toString('base64')}`, tiers: [] }
  for (const width of WIDTHS) {
    const w = Math.min(width, graded.width)
    if (entry.tiers.some(([, actual]) => actual === w)) continue
    const tier =
      w === graded.width
        ? { ...graded, data: graded.data.slice() }
        : asImage(await sharp(toBuffer(graded.data), raw(graded)).resize(w, Math.round((graded.height * w) / graded.width), { kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true }))
    grain(tier, noise * (0.72 + (0.28 * w) / WIDTHS.at(-1)), i * 7919 + width)
    await sharp(toBuffer(tier.data), raw(tier)).webp({ quality: QUALITY[width], effort: 6 }).toFile(path.join(OUT, `${slot.key}-${width}.webp`))
    entry.tiers.push([width, w])
  }
  return entry
}

// ---------------------------------------------------------------- all of them
async function main() {
  const started = Date.now()
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(path.dirname(CACHE), { recursive: true })
  const { files, usable, pinned, pool } = plan()
  const before = readJson(DATA)
  const cache = readJson(CACHE)
  const manifest = {}
  const stamps = {}
  let made = 0

  const jobs = SLOTS.map((slot, i) => async () => {
    const file = files[i]
    const st = file && fs.statSync(path.join(SRC, file))
    const stamp = [file ? `${file}|${st.size}|${Math.round(st.mtimeMs)}` : 'placeholder', slot.ratio, slot.grade, VERSION].join('|')
    const prev = before[slot.key]
    const fresh = prev && cache[slot.key] === stamp && prev.tiers.every(([w]) => fs.existsSync(path.join(OUT, `${slot.key}-${w}.webp`)))
    try {
      manifest[slot.key] = fresh ? prev : await build(slot, i, file)
    } catch (err) {
      console.warn(`  could not read ${file} (${err.message.split('\n')[0]}), using a placeholder for ${slot.key}`)
      manifest[slot.key] = await build(slot, i, null)
    }
    stamps[slot.key] = stamp
    if (!fresh) {
      made++
      if (made % 10 === 0) console.log(`  ${made} pictures made…`)
    }
  })
  // A few at a time: sharp works in the background while the looks run here.
  const running = new Set()
  for (const job of jobs) {
    const p = job().finally(() => running.delete(p))
    running.add(p)
    if (running.size >= 3) await Promise.race(running)
  }
  await Promise.all(running)

  const ordered = Object.fromEntries(SLOTS.map((s) => [s.key, manifest[s.key]]))
  fs.writeFileSync(DATA, JSON.stringify(ordered, null, 0))
  fs.writeFileSync(CACHE, JSON.stringify(stamps))
  const keep = new Set(SLOTS.flatMap((s) => manifest[s.key].tiers.map(([w]) => `${s.key}-${w}.webp`)))
  for (const f of fs.readdirSync(OUT)) if (!keep.has(f)) fs.rmSync(path.join(OUT, f))

  const secs = ((Date.now() - started) / 1000).toFixed(1)
  if (!usable.length) {
    console.log(`photos: no photos in photos/ yet, so all ${SLOTS.length} spots show placeholders (${secs}s). Add yours and run this again.`)
  } else {
    const repeats = pool.length && pool.length < SLOTS.length - pinned.size ? `, some shown more than once (add more for fewer repeats)` : ''
    console.log(`photos: ${SLOTS.length} spots filled from ${usable.length} photos${pinned.size ? `, ${pinned.size} placed by name` : ''}${repeats}. ${made} made in ${secs}s.`)
  }
}

await main()
