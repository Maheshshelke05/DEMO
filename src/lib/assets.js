import manifest from '../data/photos.generated.json'

const BASE = import.meta.env.BASE_URL

export const art = (name) => `${BASE}art/${name}.webp`
export const sticker = (name) => `${BASE}art/f/${name}.webp`

export function photo(key) {
  const m = manifest[key]
  if (!m) throw new Error(`Unknown photo spot "${key}". The spots are listed in scripts/slots.mjs.`)
  return {
    key,
    ratio: m.w / m.h,
    blur: m.blur,
    src: `${BASE}photos/${key}-${m.tiers[m.tiers.length - 1][0]}.webp`,
    srcSet: m.tiers.map(([name, actual]) => `${BASE}photos/${key}-${name}.webp ${actual}w`).join(', '),
  }
}

// Fetches and decodes images ahead of time, so a scene never pops in half painted.
export function preload(urls, onEach) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image()
          const done = () => {
            onEach?.()
            resolve(img)
          }
          img.onload = () => (img.decode ? img.decode().then(done, done) : done())
          img.onerror = done
          img.src = url
        }),
    ),
  )
}

export function preloadPhotos(keys, width = 720) {
  return preload(
    keys.map((key) => {
      const m = manifest[key]
      const tier = m.tiers.find(([, actual]) => actual >= width) ?? m.tiers[m.tiers.length - 1]
      return `${BASE}photos/${key}-${tier[0]}.webp`
    }),
  )
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
