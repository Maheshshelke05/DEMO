import { useEffect, useRef } from 'react'
import { art } from '../lib/assets'
import { bindBurst, bindFlash } from '../lib/flash'

const PALETTE = ['#ffb6d5', '#f28bae', '#a71930', '#ffe0ea', '#fff1d8', '#d73a52']

// Shared canvas for heart bursts, plus the camera flash overlay. It idles at zero cost when nothing is flying.
export function FxLayer() {
  const canvas = useRef(null)
  const whiteEl = useRef(null)

  useEffect(() => {
    bindFlash(whiteEl.current)
    const c = canvas.current
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = () => {
      c.width = innerWidth * dpr
      c.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    addEventListener('resize', size)

    const sprites = ['gloss-pink', 'gloss-red'].map((n) => {
      const i = new Image()
      i.src = art(n)
      return i
    })
    const list = []
    let raf = 0
    let last = 0

    const loop = (now) => {
      const dt = Math.min(0.12, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.age += dt
        if (p.age > p.life) {
          list.splice(i, 1)
          continue
        }
        p.vy += p.g * dt
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        const fade = Math.min(1, (p.life - p.age) / (p.life * 0.4))
        const grow = Math.min(1, p.age / 0.14)
        ctx.globalAlpha = fade
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (p.sprite && p.sprite.complete && p.sprite.naturalWidth) {
          const s = p.size * grow
          ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s)
        } else {
          ctx.fillStyle = p.color
          const s = p.size * 0.42 * grow
          ctx.fillRect(-s / 2, -s, s, s * 2)
        }
        ctx.restore()
      }
      ctx.globalAlpha = 1
      if (list.length) raf = requestAnimationFrame(loop)
      else {
        raf = 0
        ctx.clearRect(0, 0, innerWidth, innerHeight)
      }
    }

    bindBurst((x, y, count = 24, { power = 1, gravity = 240, spread = Math.PI * 2, direction = -Math.PI / 2, big = 1 } = {}) => {
      for (let n = 0; n < count; n++) {
        const a = direction + (Math.random() - 0.5) * spread
        const v = (140 + Math.random() * 420) * power
        const heart = Math.random() < 0.66
        list.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          g: gravity,
          age: 0,
          life: 1.1 + Math.random() * 1.1,
          rot: Math.random() * 6,
          spin: (Math.random() - 0.5) * 5,
          size: (heart ? 18 + Math.random() * 22 : 12 + Math.random() * 10) * big,
          sprite: heart ? sprites[Math.random() > 0.5 ? 1 : 0] : null,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        })
      }
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })

    return () => {
      removeEventListener('resize', size)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 90 }} aria-hidden="true" />
      <div ref={whiteEl} className="pointer-events-none fixed inset-0" style={{ background: '#fff', opacity: 0, zIndex: 95 }} aria-hidden="true" />
    </>
  )
}
