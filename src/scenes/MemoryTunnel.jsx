import { useEffect, useMemo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { messages, tunnel as copy } from '../data/content'
import { art, preloadPhotos } from '../lib/assets'
import { Pinned, WhenNear } from '../components/Pinned'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'

const s = (n) => `calc(var(--s) * ${n})`
const GAP = 42 // distance between prints along the path
const EYE = 92 // the camera's perspective distance
const CARD = 18

// Each thing in the tunnel fades in from the distance and is gone just before it reaches her eyes.
function Depth({ p, z, total, x = 0, y = 0, r = 0, enter = 3.1, exit = 28, keepAtStart, keepAtEnd, children }) {
  const at = (worldZ) => (worldZ - z) / total
  const a = at(-enter * GAP)
  const b = at(-(enter - 1) * GAP)
  const c = at(exit)
  const d = at(exit + 20)
  const stops = keepAtStart ? [0, c, d] : keepAtEnd ? [a, b, 1] : [a, b, c, d]
  const values = keepAtStart ? [1, 1, 0] : keepAtEnd ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useTransform(p, stops, values)
  return (
    <motion.div className="absolute" style={{ left: 0, top: 0, width: 0, height: 0, opacity, transform: `translate3d(${s(x)}, ${s(y)}, ${s(z)}) rotate(${r}deg)`, transformStyle: 'preserve-3d' }}>
      {children}
    </motion.div>
  )
}

function Stage({ p }) {
  const list = copy.photos
  const half = Math.floor(list.length / 2)

  // Lay everything out along the path: intro, half the prints, the message with room to breathe, the rest, the goodbye.
  const { placed, messageZ, outroZ, total } = useMemo(() => {
    let z = -40
    const items = list.map((key, i) => {
      z -= i === 0 ? GAP * 2.6 : i === half ? GAP * 3 : GAP
      const a = i * 2.4 + 0.5
      return { key, z, x: Math.cos(a) * 8.6, y: Math.sin(a) * 14.5 - 1, r: Math.sin(i * 1.7) * 8 }
    })
    const middle = items[half].z + GAP * 1.5
    const last = z - GAP * 2.3
    return { placed: items, messageZ: middle, outroZ: last, total: -last - 24 }
  }, [list, half])

  const world = useTransform(p, (v) => `translate3d(0,0,calc(var(--s) * ${(v * total).toFixed(2)}))`)
  const glowScale = useTransform(p, [0, 1], [0.85, 1.6])
  const warm = useTransform(p, [0, 0.5, 1], [0, 0.45, 1])

  useEffect(() => {
    preloadPhotos(list.slice(0, 7), 720)
  }, [list])

  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute"
        style={{ left: '50%', top: '50%', width: s(62), height: s(62), marginLeft: s(-31), marginTop: s(-31), borderRadius: '50%', background: 'radial-gradient(closest-side, rgb(255 182 213 / 0.55), rgb(242 139 174 / 0.18) 52%, transparent)', scale: glowScale }}
      />
      <motion.div className="absolute inset-0" style={{ opacity: warm, background: 'radial-gradient(ellipse at 50% 50%, rgb(255 140 180 / 0.28), transparent 70%)' }} />
      <FloatingDecor hearts={8} sparkles={12} seed={31} />

      <div className="absolute inset-0" style={{ perspective: s(EYE) }}>
        <div className="absolute" style={{ left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d' }}>
          <motion.div className="absolute" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', transform: world }}>
            <Depth p={p} z={-40} total={total} keepAtStart exit={-6}>
              <div className="absolute text-center" style={{ width: s(46), left: s(-23), top: s(-11) }}>
                <p className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: s(6), lineHeight: 1.08, color: '#ffe0ea', textShadow: '0 0.3rem 1.4rem rgb(20 2 8 / 0.75)' }}>{copy.intro}</p>
              </div>
            </Depth>
            {placed.map((it) => (
              <Depth key={it.key} p={p} z={it.z} total={total} x={it.x} y={it.y} r={it.r}>
                <div className="absolute" style={{ width: s(CARD), left: s(-CARD / 2), top: s(-12) }}>
                  <PolaroidCard photo={it.key} w={CARD} unit="s" sizes="62vw" eager develop={false} />
                </div>
              </Depth>
            ))}
            <Depth p={p} z={messageZ} total={total} enter={1.5} exit={8}>
              <div className="absolute text-center" style={{ width: s(35), left: s(-17.5), top: s(-10) }}>
                <div className="absolute" style={{ inset: s(-6), background: 'radial-gradient(closest-side, rgb(50 6 16 / 0.8), rgb(50 6 16 / 0.45) 60%, transparent)' }} />
                <p className="relative font-pen" style={{ fontSize: s(2.55), lineHeight: 1.95, color: '#fff1d8', textShadow: '0 0.2rem 1rem rgb(20 2 8 / 0.95)' }}>{messages.second}</p>
              </div>
            </Depth>
            <Depth p={p} z={outroZ} total={total} keepAtEnd enter={1.6}>
              <img src={art('gloss-pink')} alt="" className="absolute max-w-none" style={{ width: s(9), left: s(-4.5), top: s(-11) }} />
              <div className="absolute text-center" style={{ width: s(30), left: s(-15), top: s(-1) }}>
                <p className="font-hand font-bold" style={{ fontSize: s(3.4), lineHeight: 1.05, color: '#ffe0ea', textShadow: '0 0.2rem 1rem rgb(20 2 8 / 0.7)' }}>{copy.outro}</p>
              </div>
            </Depth>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const BACKDROP = 'radial-gradient(ellipse at 50% 46%, #a71930 0%, #57131f 58%, #2a0810 100%)'

export function MemoryTunnel() {
  return (
    <ScrapbookSection bg="bg-wine" edge="b" z={5} label="Walking through a tunnel of her pictures">
      <Pinned vh={560} backdrop={BACKDROP}>
        {(p) => (
          <WhenNear>
            <Stage p={p} />
          </WhenNear>
        )}
      </Pinned>
    </ScrapbookSection>
  )
}
