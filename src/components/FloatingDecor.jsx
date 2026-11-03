import { useEffect, useMemo, useRef, useState } from 'react'
import { art } from '../lib/assets'

const seeded = (s) => () => {
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}

// Tiny hearts, petals and sparkles drifting through a scene. CSS only, so it never competes with scrolling.
export function FloatingDecor({ hearts = 7, petals = 0, sparkles = 7, seed = 7, className = '', z }) {
  const root = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting))
    io.observe(root.current)
    return () => io.disconnect()
  }, [])
  const items = useMemo(() => {
    const R = seeded(seed * 991 + 13)
    const list = []
    for (let i = 0; i < hearts; i++) {
      list.push({
        kind: 'heart',
        left: R() * 96,
        size: 1.1 + R() * 1.9,
        duration: 11 + R() * 10,
        delay: -R() * 20,
        img: R() > 0.5 ? art('gloss-pink') : art('gloss-red'),
        dx: `${-5 + R() * 10}rem`,
        r0: `${-20 + R() * 40}deg`,
        r1: `${-30 + R() * 60}deg`,
        op: 0.65 + R() * 0.35,
      })
    }
    for (let i = 0; i < petals; i++) {
      list.push({
        kind: 'petal',
        left: R() * 100,
        size: 1.5 + R() * 1.7,
        duration: 9 + R() * 8,
        delay: -R() * 16,
        dx: `${-7 + R() * 14}rem`,
        r0: `${R() * 360}deg`,
        r1: `${R() * 720}deg`,
        rx: `${360 + R() * 540}deg`,
        ry: `${180 + R() * 540}deg`,
        op: 0.78 + R() * 0.22,
        tone: ['#a71930', '#c92a45', '#7f1021', '#f28bae'][Math.floor(R() * 4)],
      })
    }
    for (let i = 0; i < sparkles; i++) {
      list.push({ kind: 'sparkle', left: R() * 96, top: R() * 94, size: 1 + R() * 1.5, duration: 2.6 + R() * 3.4, delay: -R() * 5 })
    }
    return list
  }, [hearts, petals, sparkles, seed])

  return (
    <div ref={root} className={`ambient pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: z, perspective: '60rem' }} aria-hidden="true">
      {on && items.map((it, i) => {
        if (it.kind === 'sparkle') {
          return (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                width: `${it.size}rem`,
                height: `${it.size}rem`,
                background: 'radial-gradient(circle, #fff 0 18%, #ffe0ea 32%, transparent 68%)',
                clipPath: 'polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%)',
                animation: `twinkle ${it.duration}s ease-in-out ${it.delay}s infinite`,
              }}
            />
          )
        }
        if (it.kind === 'petal') {
          return (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${it.left}%`,
                top: 0,
                width: `${it.size}rem`,
                height: `${it.size * 1.25}rem`,
                borderRadius: '70% 12% 70% 30%',
                background: `linear-gradient(145deg, ${it.tone}, #57131f 130%)`,
                '--dx': it.dx,
                '--r0': it.r0,
                '--r1': it.r1,
                '--rx': it.rx,
                '--ry': it.ry,
                '--op': it.op,
                opacity: 0,
                animation: `fall3d ${it.duration}s linear ${it.delay}s infinite`,
                willChange: 'transform',
              }}
            />
          )
        }
        return (
          <img
            key={i}
            src={it.img}
            alt=""
            className="absolute"
            style={{
              left: `${it.left}%`,
              bottom: 0,
              width: `${it.size}rem`,
              '--dx': it.dx,
              '--r0': it.r0,
              '--r1': it.r1,
              '--sc': 1,
              '--op': it.op,
              opacity: 0,
              animation: `rise ${it.duration}s linear ${it.delay}s infinite`,
              willChange: 'transform',
            }}
          />
        )
      })}
    </div>
  )
}
