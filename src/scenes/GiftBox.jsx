import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useAnimationFrame } from 'framer-motion'
import { gift as copy } from '../data/content'
import { art } from '../lib/assets'
import { burst, flash, whiteout } from '../lib/flash'
import { pop, startMusic, unlock } from '../lib/sound'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker } from '../components/Sticker'

const s = (n) => `calc(var(--s) * ${n})`
const B = 19 // box width
const H = 13.5 // box height
const L = 20.6 // lid width
const LH = 4.2 // lid height
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const CHERRY = 'linear-gradient(168deg, #d9334d 0%, #bc1e39 34%, #a71930 60%, #84101f 100%)'
const LID = 'linear-gradient(172deg, #e4405a 0%, #c4223d 50%, #96142a 100%)'
const SATIN = 'linear-gradient(90deg, #e879a4 0%, #ffc4dc 22%, #fff0f6 40%, #ffb6d5 62%, #f28bae 86%, #d9628f 100%)'
const SATIN_H = 'linear-gradient(180deg, #e879a4 0%, #ffc4dc 22%, #fff0f6 40%, #ffb6d5 62%, #f28bae 86%, #d9628f 100%)'

// A flat face of the box with its own moving light. Lighting is recomputed from the spin angle.
function Face({ id, width, height, transform, bg, faces, angle, ribbon = 'v', children }) {
  return (
    <div
      ref={(el) => {
        if (el) faces.current.set(`${id}-root`, { el, angle, type: 'root' })
      }}
      className="absolute overflow-hidden"
      style={{ width: s(width), height: s(height), left: `calc(50% - ${s(width / 2)})`, top: `calc(50% - ${s(height / 2)})`, transform, background: bg, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
    >
      {ribbon === 'v' && <div className="absolute inset-y-0" style={{ left: '38%', width: '24%', background: SATIN, boxShadow: '0 0 0.6rem rgb(60 0 16 / 0.45)' }} />}
      {children}
      <div
        ref={(el) => {
          if (el) faces.current.set(`${id}-dark`, { el, angle, type: 'dark' })
        }}
        className="absolute inset-0"
        style={{ background: '#2a0208', opacity: 0 }}
      />
      <div
        ref={(el) => {
          if (el) faces.current.set(`${id}-gloss`, { el, angle, type: 'gloss' })
        }}
        className="absolute"
        style={{ top: '-12%', bottom: '-12%', width: '42%', left: '29%', background: 'linear-gradient(100deg, transparent, rgb(255 255 255 / 0.62) 48%, transparent)', opacity: 0, filter: 'blur(0.2rem)' }}
      />
    </div>
  )
}

export function GiftBox({ onOpened, onWarm }) {
  const [stage, setStage] = useState(0) // 0 ask, 1-3 confirmations, 4 opening
  const [reply, setReply] = useState(null)
  const [noCount, setNoCount] = useState(0)
  const [dragged, setDragged] = useState(false)
  const faces = useRef(new Map())
  const spinner = useRef(null)
  const billboard = useRef(null)
  const boxArea = useRef(null)
  const physics = useRef({ angle: -32, vel: 16, dragging: false, lastX: 0, boost: 0, tilt: -20, tiltTo: -20 })
  const body = useAnimationControls()
  const lid = useAnimationControls()
  const glow = useAnimationControls()
  const rays = useAnimationControls()
  const scene = useAnimationControls()

  useEffect(() => {
    onWarm?.()
  }, [onWarm])

  // Spin, lighting and the bow that always faces her
  useAnimationFrame((_, delta) => {
    const p = physics.current
    const dt = Math.min(0.05, delta / 1000)
    if (!p.dragging) {
      const rest = 15 + p.boost
      p.vel += (rest - p.vel) * (1 - Math.exp(-dt * 2.4))
      p.angle += p.vel * dt
    }
    p.boost *= Math.exp(-dt * 1.2)
    p.tilt += (p.tiltTo - p.tilt) * (1 - Math.exp(-dt * 3.2))
    if (!spinner.current) return
    spinner.current.style.transform = `rotateX(${p.tilt.toFixed(2)}deg) rotateY(${p.angle.toFixed(2)}deg)`
    if (billboard.current) billboard.current.style.transform = `rotateY(${(-p.angle).toFixed(2)}deg) rotateX(${(-p.tilt).toFixed(2)}deg)`
    for (const f of faces.current.values()) {
      const rad = ((f.angle + p.angle) * Math.PI) / 180
      const facing = Math.cos(rad) // 1 means facing her
      const light = Math.max(0, Math.cos(rad + 0.55))
      if (f.type === 'root') {
        const on = facing > 0.12
        if (f.on !== on) {
          f.on = on
          f.el.style.visibility = on ? 'visible' : 'hidden'
        }
      } else if (f.type === 'dark') {
        f.el.style.opacity = (0.52 * (1 - light)).toFixed(3)
      } else {
        const offset = Math.sin(rad + 0.3) * 120
        f.el.style.opacity = (Math.max(0, facing) * 0.8).toFixed(3)
        f.el.style.transform = `translate3d(${offset.toFixed(1)}%,0,0) skewX(-16deg)`
      }
    }
  })

  const onDown = (e) => {
    const p = physics.current
    p.dragging = true
    p.lastX = e.clientX
    p.vel = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    const p = physics.current
    if (!p.dragging) return
    const dx = e.clientX - p.lastX
    p.lastX = e.clientX
    p.angle += dx * 0.75
    p.vel = dx * 26
    if (Math.abs(dx) > 1) setDragged(true)
  }
  const onUp = () => {
    physics.current.dragging = false
  }

  const center = () => {
    const r = boxArea.current.getBoundingClientRect()
    return [r.left + r.width / 2, r.top + r.height * 0.42]
  }

  const yes = async () => {
    unlock()
    setReply(null)
    const [cx, cy] = center()
    if (stage === 0) {
      pop(1)
      setStage(1)
      burst(cx, cy, 14, { power: 0.7 })
      body.start({ rotateZ: [0, -7, 7, -6, 6, -3, 3, 0], transition: { duration: 0.62, ease: 'easeInOut' } })
      lid.start({ y: ['0%', '-10%', '0%', '-6%', '0%'], transition: { duration: 0.6 } })
    } else if (stage === 1) {
      pop(1.2)
      setStage(2)
      physics.current.boost = 420
      burst(cx, cy, 22, { power: 0.95 })
      await body.start({ scaleY: 0.82, scaleX: 1.12, y: 0, transition: { duration: 0.14, ease: 'easeOut' } })
      await body.start({ scaleY: 1.14, scaleX: 0.92, y: '-34%', transition: { duration: 0.26, ease: 'easeOut' } })
      lid.start({ y: ['0%', '-46%', '-46%', '0%'], rotateX: [0, 8, -6, 0], transition: { duration: 0.7, ease: 'easeInOut' } })
      glow.start({ opacity: [0, 0.8, 0], transition: { duration: 0.7 } })
      await body.start({ scaleY: 1, scaleX: 1, y: '0%', transition: { type: 'spring', stiffness: 260, damping: 11 } })
    } else if (stage === 2) {
      pop(1.4)
      setStage(3)
      burst(cx, cy, 30, { power: 1.1 })
      rays.start({ opacity: 0.85, scale: 1, transition: { duration: 0.8 } })
      glow.start({ opacity: 0.5, transition: { duration: 0.5 } })
      body.start({ x: [0, -2.5, 2.5, -2, 2, 0], scale: 1.04, transition: { x: { duration: 0.22, repeat: Infinity }, scale: { duration: 0.4 } } })
    } else if (stage === 3) {
      setStage(4)
      physics.current.boost = 300
      physics.current.tiltTo = -68
      startMusic()
      pop(1.6)
      flash({ peak: 0.6, duration: 380 })
      body.start({ x: 0, scale: 1.06, transition: { duration: 0.2 } })
      glow.start({ opacity: 1, transition: { duration: 0.25 } })
      rays.start({ opacity: 1, scale: 1.5, transition: { duration: 1.1 } })
      lid.start({ y: '-420%', x: '36%', rotateX: 72, rotateZ: 32, z: 200, opacity: 0, transition: { duration: 1.05, ease: [0.2, 0.7, 0.3, 1] } })
      for (let i = 0; i < 4; i++) {
        burst(cx, cy, 26, { power: 1.3 + i * 0.1, gravity: 170, spread: Math.PI * 1.1, big: 1.1 })
        await wait(170)
      }
      scene.start({ scale: 3.1, y: '26%', transition: { duration: 0.95, ease: [0.5, 0, 0.9, 0.5] } })
      await wait(420)
      burst(cx, cy, 18, { power: 1.6, gravity: 90, big: 1.2 })
      await whiteout(1, 440)
      onOpened()
    }
  }

  const no = () => {
    unlock()
    pop(0.7)
    setReply(copy.noReplies[noCount % copy.noReplies.length])
    setNoCount((n) => n + 1)
    body.start({ rotateZ: [0, -3, 3, 0], transition: { duration: 0.34 } })
  }

  const current = stage === 0 ? { text: copy.ask, yes: copy.yes, no: copy.no } : copy.stages[Math.min(stage - 1, 2)]
  const entrances = [
    { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } },
    { initial: { opacity: 0, scale: 0.4, rotate: -9 }, animate: { opacity: 1, scale: 1, rotate: 0 } },
    { initial: { opacity: 0, x: 90, rotate: 7 }, animate: { opacity: 1, x: 0, rotate: 0 } },
    { initial: { opacity: 0, scale: 1.8 }, animate: { opacity: 1, scale: 1 } },
  ]

  return (
    <div className="bg-burgundy absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 54% at 50% 56%, rgb(255 130 170 / 0.5), rgb(167 25 48 / 0.32) 48%, transparent 76%)' }} />
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '56%',
          width: s(90),
          height: s(90),
          marginLeft: s(-45),
          marginTop: s(-45),
          borderRadius: '50%',
          background: 'repeating-conic-gradient(rgb(255 224 234 / 0.34) 0 9deg, transparent 9deg 24deg)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)',
          maskImage: 'radial-gradient(closest-side, #000, transparent)',
          animation: 'spinSlow 22s linear infinite',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={rays}
      />
      <FloatingDecor hearts={9} sparkles={10} seed={23} />
      <Sticker name="rose-red" w={12} x={-4.6} y={-4.4} r={-22} unit="s" eager />
      <Sticker name="lily-red" w={14} right={-5.6} y={-4.6} r={24} unit="s" eager />
      <Sticker name="gloss-pink" w={5.6} x={2.4} y={25} unit="s" bob eager r={-14} />
      <Sticker name="gloss-red" w={6.4} right={2.2} y={30} unit="s" bob t={6} delay={-2} eager r={12} />

      <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + var(--s) * 4)' }}>
        <div className="relative flex shrink-0 items-center justify-center" style={{ width: '100%', minHeight: s(13), padding: `0 ${s(2.4)}`, zIndex: 5 }}>
          <AnimatePresence mode="wait">
            <motion.h2
              key={stage}
              className="text-center font-hand font-bold"
              style={{ fontSize: s(4.5), lineHeight: 1.04, color: '#fff1d8', textShadow: '0 0.25rem 1.2rem rgb(30 2 10 / 0.7)' }}
              initial={entrances[Math.min(stage, 3)].initial}
              animate={entrances[Math.min(stage, 3)].animate}
              exit={{ opacity: 0, y: -14, transition: { duration: 0.14 } }}
              transition={{ type: 'spring', stiffness: 240, damping: 15 }}
            >
              {current.text}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* The box itself. Drag to spin it. */}
        <motion.div
          ref={boxArea}
          className="relative flex-1"
          animate={scene}
          style={{ width: '100%', minHeight: s(26), perspective: s(80), touchAction: 'none', cursor: 'grab' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="img"
          aria-label="A glossy red gift box with a pink satin bow. Drag to spin it."
        >
          <div className="absolute" style={{ left: '50%', top: '84%', width: s(30), height: s(6), marginLeft: s(-15), borderRadius: '50%', background: 'radial-gradient(closest-side, rgb(25 2 8 / 0.62), transparent)' }} />
          <motion.div className="absolute" style={{ left: '50%', top: '58%', width: 0, height: 0, transformStyle: 'preserve-3d' }} animate={body}>
            <div ref={spinner} className="absolute" style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}>
              {/* base */}
              {[0, 90, 180, 270].map((a) => (
                <Face key={a} id={`base${a}`} width={B} height={H} angle={a} faces={faces} transform={`rotateY(${a}deg) translateZ(${s(B / 2)})`} bg={CHERRY} />
              ))}
              <div className="absolute" style={{ width: s(B), height: s(B), left: s(-B / 2), top: s(-B / 2), background: '#2a0208', transform: `rotateX(90deg) translateZ(${s(-H / 2)})` }} />
              {/* The light inside */}
              <motion.div
                className="absolute"
                initial={{ opacity: 0 }}
                animate={glow}
                style={{ width: s(B), height: s(B), left: s(-B / 2), top: s(-B / 2), background: 'radial-gradient(circle, #fff 0%, #ffe0ea 40%, #ff8fb4 100%)', transform: `rotateX(90deg) translateZ(${s(H / 2 - 0.2)})`, boxShadow: `0 0 ${s(7)} ${s(3)} rgb(255 214 232 / 0.9)` }}
              />
              {/* lid */}
              <motion.div className="absolute" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', top: s(-H / 2 - LH / 2 + 0.7) }} animate={lid}>
                {[0, 90, 180, 270].map((a) => (
                  <Face key={a} id={`lid${a}`} width={L} height={LH} angle={a} faces={faces} transform={`rotateY(${a}deg) translateZ(${s(L / 2)})`} bg={LID} />
                ))}
                <div className="absolute overflow-hidden" style={{ width: s(L), height: s(L), left: s(-L / 2), top: s(-L / 2), background: LID, transform: `rotateX(90deg) translateZ(${s(LH / 2)})` }}>
                  <div className="absolute inset-y-0" style={{ left: '38.9%', width: '22.2%', background: SATIN }} />
                  <div className="absolute inset-x-0" style={{ top: '38.9%', height: '22.2%', background: SATIN_H }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(130deg, rgb(255 255 255 / 0.3), transparent 42%)' }} />
                </div>
                {/* The bow always turns to face her */}
                <div ref={billboard} className="absolute" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', top: s(-LH / 2 + 0.3) }}>
                  <img src={art('bow-pink')} alt="" draggable={false} className="absolute max-w-none" style={{ width: s(21), left: s(-10.5), top: s(-13.5), transformOrigin: '50% 60%' }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
          <AnimatePresence>
            {!dragged && stage < 3 && (
              <motion.span
                className="pointer-events-none absolute w-full text-center font-pen"
                style={{ bottom: s(0.2), fontSize: s(1.25), color: '#ffe0ea' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
              >
                {copy.dragHint}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="relative flex shrink-0 flex-col items-center" style={{ minHeight: s(16.5), width: '100%', paddingBottom: 'calc(env(safe-area-inset-bottom) + var(--s) * 1.5)', zIndex: 5 }}>
          <div className="flex items-center justify-center" style={{ height: s(5), width: '100%', padding: `0 ${s(2)}` }}>
            <AnimatePresence mode="wait">
              {reply && (
                <motion.p
                  key={reply}
                  className="text-center font-hand font-bold"
                  style={{ fontSize: s(2.3), lineHeight: 1.05, color: '#ffe0ea' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {reply}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {stage < 4 && (
              <motion.div
                key={stage}
                className="flex items-center justify-center"
                style={{ gap: s(1.4) }}
                initial={{ opacity: 0, y: 26, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                <button className="pill" style={{ fontSize: s(stage === 3 ? 3.6 : 2.7), minHeight: s(stage === 3 ? 6.4 : 5.3), padding: `0 ${s(stage === 3 ? 4 : 2.1)}` }} onClick={yes}>
                  {current.yes}
                </button>
                {current.no && (
                  <button className="pill pill-quiet" style={{ fontSize: s(2.45), minHeight: s(5.3), padding: `0 ${s(1.7)}` }} onClick={no}>
                    {current.no}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
