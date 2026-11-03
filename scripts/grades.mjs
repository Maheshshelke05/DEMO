// The film looks: tone curves, glows, light leaks and vignettes, worked on raw RGB pixels.
// Colour only: nothing here moves or reshapes a pixel, so faces stay exactly as they were.
// An image is { data: Uint8ClampedArray (RGB), width, height }; most steps change it in place.
import sharp from 'sharp'

// ---------------------------------------------------------------- building blocks
function lut(points) {
  const table = new Uint8ClampedArray(256)
  for (let v = 0; v < 256; v++) {
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i]
      const [x1, y1] = points[i + 1]
      if (x0 <= v && v <= x1) {
        let t = (v - x0) / Math.max(1, x1 - x0)
        t = t * t * (3 - 2 * t) * 0.35 + t * 0.65
        table[v] = y0 + (y1 - y0) * t
        break
      }
    }
  }
  return table
}

function curves(im, r, g = r, b = r) {
  const [lr, lg, lb] = [lut(r), lut(g), lut(b)]
  const d = im.data
  for (let i = 0; i < d.length; i += 3) {
    d[i] = lr[d[i]]
    d[i + 1] = lg[d[i + 1]]
    d[i + 2] = lb[d[i + 2]]
  }
  return im
}

const luma = (d, i) => (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000

function saturate(im, f) {
  const d = im.data
  for (let i = 0; i < d.length; i += 3) {
    const l = luma(d, i)
    d[i] = l + f * (d[i] - l)
    d[i + 1] = l + f * (d[i + 1] - l)
    d[i + 2] = l + f * (d[i + 2] - l)
  }
  return im
}

function grayscale(im) {
  const d = im.data
  for (let i = 0; i < d.length; i += 3) d[i] = d[i + 1] = d[i + 2] = luma(d, i)
  return im
}

const toBuffer = (d) => Buffer.from(d.buffer, d.byteOffset, d.length)

async function blurred(im, sigma) {
  const out = await sharp(toBuffer(im.data), { raw: { width: im.width, height: im.height, channels: 3 } })
    .blur(Math.max(0.3, sigma))
    .raw()
    .toBuffer()
  return out
}

const screen = (a, b) => 255 - ((255 - a) * (255 - b)) / 255
const softLight = (a, b) => ((255 - a) * a * b) / 65536 + (a * (255 - ((255 - a) * (255 - b)) / 255)) / 255

function blendWith(im, layer, amount, mode) {
  const d = im.data
  for (let i = 0; i < d.length; i++) d[i] = d[i] + amount * (mode(d[i], layer[i]) - d[i])
  return im
}

// 1 at the centre of the ellipse, falling to 0 at its edge (all sizes as shares of the image).
function radial(im, cx, cy, rx, ry, power = 1) {
  const { width: w, height: h } = im
  const mask = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const dy = (y + 0.5 - cy * h) / (ry * h)
    for (let x = 0; x < w; x++) {
      const dx = (x + 0.5 - cx * w) / (rx * w)
      const v = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy))
      mask[y * w + x] = power === 1 ? v : v ** power
    }
  }
  return mask
}

function vignette(im, amount, colour = [24, 6, 10]) {
  const mask = radial(im, 0.5, 0.5, 0.82, 0.82, 1.4)
  const d = im.data
  for (let p = 0, i = 0; p < mask.length; p++, i += 3) {
    const m = (1 - mask[p]) * amount
    d[i] += (colour[0] - d[i]) * m
    d[i + 1] += (colour[1] - d[i + 1]) * m
    d[i + 2] += (colour[2] - d[i + 2]) * m
  }
  return im
}

// Screens a colour into the image wherever the mask is lit.
function wash(im, colour, mask, amount) {
  const d = im.data
  for (let p = 0, i = 0; p < mask.length; p++, i += 3) {
    for (let c = 0; c < 3; c++) d[i + c] += amount * (screen(d[i + c], colour[c] * mask[p]) - d[i + c])
  }
  return im
}

const leak = (im, colour, cx, cy, rx, ry, amount) => wash(im, colour, radial(im, cx, cy, rx, ry, 1.6), amount)
const bloom = async (im, radius, amount) => blendWith(im, await blurred(im, (radius * im.width) / 1000), amount, screen)
const orton = async (im, radius, amount) => blendWith(im, await blurred(im, (radius * im.width) / 1000), amount, softLight)

// ---------------------------------------------------------------- the looks
const looks = {
  none: (im) => im,

  // Warm consumer film stock: lifted blacks, creamy highlights.
  film: (im) => {
    curves(im, [[0, 12], [64, 66], [128, 134], [200, 212], [255, 248]],
      [[0, 8], [64, 62], [128, 128], [200, 204], [255, 244]],
      [[0, 14], [64, 60], [128, 120], [200, 190], [255, 226]])
    return vignette(saturate(im, 1.04), 0.22)
  },

  // Disposable camera: punchy, slightly green shadows, dark corners.
  disposable: (im) => {
    curves(im, [[0, 6], [70, 62], [140, 150], [210, 228], [255, 252]],
      [[0, 10], [70, 66], [140, 150], [210, 224], [255, 248]],
      [[0, 12], [70, 62], [140, 140], [210, 208], [255, 232]])
    return vignette(saturate(im, 1.1), 0.42)
  },

  // Compact digicam with the flash on: bright centre, cool shadow, soft bloom.
  flash: async (im) => {
    curves(im, [[0, 8], [70, 74], [140, 156], [210, 226], [255, 255]],
      [[0, 8], [70, 72], [140, 152], [210, 222], [255, 252]],
      [[0, 14], [70, 76], [140, 150], [210, 218], [255, 248]])
    await bloom(im, 16, 0.14)
    wash(im, [255, 246, 238], radial(im, 0.5, 0.42, 0.7, 0.62, 2), 0.08)
    return vignette(im, 0.3)
  },

  // Golden hour: warm wash coming from one corner.
  golden: async (im) => {
    curves(im, [[0, 10], [70, 74], [140, 152], [210, 224], [255, 252]],
      [[0, 6], [70, 66], [140, 138], [210, 208], [255, 240]],
      [[0, 4], [70, 52], [140, 114], [210, 178], [255, 214]])
    leak(im, [255, 170, 80], 0.92, 0.1, 0.9, 0.8, 0.24)
    await orton(im, 12, 0.16)
    return vignette(saturate(im, 1.06), 0.18, [46, 18, 6])
  },

  // Pink romantic glow, kept out of the mid-tones so skin stays natural.
  blush: async (im) => {
    curves(im, [[0, 14], [70, 76], [140, 150], [210, 224], [255, 255]],
      [[0, 8], [70, 66], [140, 136], [210, 208], [255, 244]],
      [[0, 12], [70, 68], [140, 136], [210, 208], [255, 242]])
    await bloom(im, 22, 0.12)
    leak(im, [255, 150, 190], 0.08, 0.05, 0.9, 0.7, 0.2)
    return vignette(im, 0.14, [70, 12, 34])
  },

  // Soft focus: an Orton glow with the blacks gently lifted.
  dreamy: async (im) => {
    curves(im, [[0, 16], [70, 78], [140, 148], [210, 222], [255, 252]])
    await orton(im, 26, 0.24)
    await bloom(im, 34, 0.07)
    return vignette(im, 0.12, [70, 16, 34])
  },

  // Old print left in a drawer: matte blacks, muted colour.
  fade: (im) => {
    curves(im, [[0, 34], [70, 80], [140, 142], [210, 208], [255, 236]],
      [[0, 28], [70, 76], [140, 138], [210, 204], [255, 232]],
      [[0, 30], [70, 72], [140, 128], [210, 192], [255, 218]])
    return saturate(im, 0.86)
  },

  // Film with a red-orange light leak along one edge.
  leak: (im) => {
    looks.film(im)
    leak(im, [255, 96, 56], 1.02, 0.5, 0.52, 0.85, 0.46)
    return leak(im, [255, 176, 96], 0.98, 0.1, 0.3, 0.4, 0.26)
  },

  // Soft denim blues in the shadow, skin left warm.
  cool: async (im) => {
    curves(im, [[0, 10], [70, 68], [140, 146], [210, 220], [255, 250]],
      [[0, 12], [70, 72], [140, 146], [210, 218], [255, 248]],
      [[0, 20], [70, 82], [140, 150], [210, 216], [255, 244]])
    await orton(im, 16, 0.12)
    return vignette(im, 0.16, [10, 18, 44])
  },

  // Warm black and white.
  mono: (im) => {
    curves(grayscale(im), [[0, 14], [64, 58], [128, 130], [200, 212], [255, 248]],
      [[0, 12], [64, 56], [128, 128], [200, 208], [255, 244]],
      [[0, 12], [64, 54], [128, 122], [200, 198], [255, 230]])
    return vignette(im, 0.3, [10, 6, 6])
  },
}

// name: [look, film grain strength]
export const GRADES = {
  none: ['none', 0], fine: ['none', 4], film: ['film', 7], disposable: ['disposable', 8], flash: ['flash', 6],
  golden: ['golden', 6], blush: ['blush', 5], dreamy: ['dreamy', 4], fade: ['fade', 8], leak: ['leak', 8],
  cool: ['cool', 6], mono: ['mono', 9],
}

export async function grade(im, name) {
  const [look] = GRADES[name] ?? GRADES.film
  return (await looks[look](im)) ?? im
}

// Monochrome film grain, the same on all three channels. Seeded, so a rebuild gives the same file.
export function grain(im, strength, seed = 1) {
  if (strength <= 0) return im
  let s = seed >>> 0
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const d = im.data
  for (let i = 0; i < d.length; i += 6) {
    // Box-Muller gives two normal values per pair of pixels
    const r = Math.sqrt(-2 * Math.log(rand() || 1e-9)) * strength
    const a = 2 * Math.PI * rand()
    const n1 = r * Math.cos(a)
    const n2 = r * Math.sin(a)
    d[i] += n1
    d[i + 1] += n1
    d[i + 2] += n1
    if (i + 5 < d.length) {
      d[i + 3] += n2
      d[i + 4] += n2
      d[i + 5] += n2
    }
  }
  return im
}
