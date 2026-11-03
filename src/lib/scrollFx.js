// One animation loop for every scroll-linked effect on the page.
// Elements only cost anything while they are near the screen: an IntersectionObserver
// keeps the active set small, and all DOM writes are transforms, so the browser never re-lays out.
import { clamp, prefersReducedMotion } from './assets'

const items = new Map()
const active = new Set()
let running = false
let lastTime = 0
let viewH = typeof window !== 'undefined' ? window.innerHeight : 800
const reduced = prefersReducedMotion()

const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const item = items.get(e.target)
            if (!item) continue
            if (e.isIntersecting) {
              active.add(item)
              item.onEnter?.()
              start()
            } else {
              active.delete(item)
              item.onLeave?.()
            }
          }
        },
        { rootMargin: '35% 0px 35% 0px' },
      )
    : null

function start() {
  if (running) return
  running = true
  lastTime = performance.now()
  requestAnimationFrame(tick)
}

function tick(now) {
  if (!active.size) {
    running = false
    return
  }
  const dt = Math.min(50, now - lastTime)
  lastTime = now
  const k = 1 - Math.exp(-dt / 85) // frame-rate independent easing
  for (const item of active) item.update(k)
  requestAnimationFrame(tick)
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    viewH = window.innerHeight
  })
}

function add(el, item) {
  items.set(el, item)
  observer?.observe(el)
  return () => {
    observer?.unobserve(el)
    items.delete(el)
    active.delete(item)
  }
}

// A photo or sticker that turns in 3D as it travels through the screen, flat at the centre.
export function registerTilt(outer, inner, opts) {
  const { rx = 16, ry = 0, rz = 0, y = 0, z = 0, base = 0, perspective = 700, swing = 0 } = opts
  const apply = (c) => {
    const eased = c * Math.abs(c) * 0.6 + c * 0.4
    inner.style.transform = `perspective(${perspective}px) translate3d(0,${(eased * y).toFixed(2)}px,${(-Math.abs(eased) * z).toFixed(2)}px) rotateX(${(-eased * rx).toFixed(3)}deg) rotateY(${(eased * ry).toFixed(3)}deg) rotateZ(${(base + eased * rz + (swing ? Math.sin(c * 7) * swing : 0)).toFixed(3)}deg)`
  }
  const item = {
    cur: null,
    onEnter() {
      inner.style.willChange = 'transform'
    },
    onLeave() {
      inner.style.willChange = 'auto'
    },
    update(k) {
      const r = outer.getBoundingClientRect()
      const half = (viewH + r.height) / 2
      const t = clamp((r.top + r.height / 2 - viewH / 2) / half, -1, 1)
      item.cur = item.cur === null ? t : item.cur + (t - item.cur) * k
      apply(reduced ? 0 : item.cur)
    },
  }
  apply(reduced ? 0 : 0.9)
  return add(outer, item)
}

// A whole page that bends back into the distance while the next page slides over it.
export function registerSheet(sheet, inner, dim) {
  const setOff = (off) => {
    if (item.off === off) return
    item.off = off
    inner.classList.toggle('sheet-off', off)
  }
  const item = {
    last: -1,
    off: null,
    onEnter() {
      inner.style.visibility = 'visible'
      setOff(false)
    },
    onLeave() {
      setOff(true)
    },
    update() {
      const next = sheet.nextElementSibling
      if (!next) return
      const p = clamp(1 - next.getBoundingClientRect().top / viewH)
      setOff(p >= 1)
      const e = reduced ? 0 : p * p * (3 - 2 * p)
      if (Math.abs(e - item.last) < 0.0005) return
      item.last = e
      if (e <= 0) {
        inner.style.transform = 'none'
        inner.style.visibility = 'visible'
        inner.style.willChange = 'auto'
        dim.style.opacity = 0
        return
      }
      if (p >= 1) {
        inner.style.visibility = 'hidden'
        return
      }
      inner.style.visibility = 'visible'
      inner.style.willChange = 'transform'
      inner.style.transform = `perspective(1300px) rotateX(${(e * 11).toFixed(3)}deg) scale(${(1 - e * 0.13).toFixed(4)})`
      dim.style.opacity = (e * 0.62).toFixed(3)
    },
  }
  return add(sheet, item)
}

// Progress through a pinned scene: 0 when the pin engages, 1 when it lets go.
export function registerPin(track, pin, motionValue) {
  const item = {
    cur: null,
    onEnter() {
      item.cur = null
    },
    update(k) {
      const r = track.getBoundingClientRect()
      const t = clamp(-r.top / Math.max(1, r.height - pin.offsetHeight))
      item.cur = item.cur === null ? t : item.cur + (t - item.cur) * k
      if (Math.abs(t - item.cur) < 0.0002) item.cur = t
      motionValue.set(item.cur)
    },
  }
  return add(track, item)
}

// Progress of an element between two heights on the screen, as fractions from the top.
export function registerRange(el, from, to, motionValue) {
  const item = {
    cur: null,
    update(k) {
      const r = el.getBoundingClientRect()
      const t = clamp((from * viewH - r.top) / ((from - to) * viewH))
      item.cur = item.cur === null ? t : item.cur + (t - item.cur) * k
      if (Math.abs(t - item.cur) < 0.0005) item.cur = t
      motionValue.set(item.cur)
    },
  }
  return add(el, item)
}
