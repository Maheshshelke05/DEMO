import { useEffect, useRef, useState } from 'react'
import { easeIn, motion, useAnimationFrame, useMotionValueEvent, useTransform } from 'framer-motion'
import { finale as copy } from '../data/content'
import { art, preload } from '../lib/assets'
import { Pinned, WhenNear } from '../components/Pinned'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker, Tape } from '../components/Sticker'

const s = (n) => `calc(var(--s) * ${n})`
const FRAMES = 40
const frameUrl = (i) => `${import.meta.env.BASE_URL}art/heart/${String(i).padStart(2, '0')}.webp`

// The real 3D heart: 40 pre-rendered frames of a glossy heart turning. Scroll scrubs them,
// and it keeps turning very slowly even when she stops, so it always feels alive.
function HeartSequence({ p }) {
  const canvas = useRef(null)
  const images = useRef([])
  const last = useRef(-1)
  const visible = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
    })
    io.observe(canvas.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const c = canvas.current
    c.width = c.height = 560
    preload(Array.from({ length: FRAMES }, (_, i) => frameUrl(i))).then((list) => {
      images.current = list
      last.current = -1
    })
  }, [])

  useAnimationFrame((t) => {
    const list = images.current
    if (!list.length || !canvas.current) return
    if (!visible.current || p.get() > 0.76) return
    const raw = FRAMES / 2 + p.get() * FRAMES * 3.5 + (t / 1000) * 3.2
    const key = Math.round(raw * 24)
    if (key === last.current) return
    last.current = key
    const i = ((Math.floor(raw) % FRAMES) + FRAMES) % FRAMES
    const next = (i + 1) % FRAMES
    const ctx = canvas.current.getContext('2d')
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, 560, 560)
    ctx.drawImage(list[i], 0, 0, 560, 560)
    ctx.globalAlpha = raw - Math.floor(raw)
    ctx.drawImage(list[next], 0, 0, 560, 560)
  })

  return <canvas ref={canvas} role="img" aria-label="A glossy red heart, slowly turning" className="h-full w-full" />
}

function Stage({ p }) {
  const heartScale = useTransform(p, [0, 0.3, 0.42, 0.74], [0.62, 1.02, 1.1, 11], { ease: (v) => v })
  const heartOpacity = useTransform(p, [0.62, 0.74], [1, 0])
  const flood = useTransform(p, [0.58, 0.72, 0.84], [0, 1, 0], { ease: easeIn })
  const glow = useTransform(p, [0, 0.42], [0.35, 1])
  const lineOpacity = useTransform(p, [0.02, 0.1, 0.34, 0.44], [0, 1, 1, 0])
  const lineY = useTransform(p, [0, 0.44], [18, -26])
  const picOpacity = useTransform(p, [0.7, 0.84], [0, 1])
  const picScale = useTransform(p, [0.7, 1], [1.5, 1])
  const picRotate = useTransform(p, [0.7, 1], [6, -2])
  const headOpacity = useTransform(p, [0.86, 0.96], [0, 1])
  const headY = useTransform(p, [0.86, 0.98], [22, 0])
  const petals = useTransform(p, [0.38, 0.56], [0, 1])
  const [showPetals, setShowPetals] = useState(false)
  useMotionValueEvent(p, 'change', (v) => setShowPetals(v > 0.34))

  return (
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 46%, #7f1021 0%, #57131f 54%, #3a0c16 100%)' }}>
      <motion.div className="absolute inset-0" style={{ opacity: glow, background: 'radial-gradient(circle at 50% 46%, rgb(255 150 190 / 0.72) 0%, rgb(242 139 174 / 0.34) 26%, transparent 60%)' }} />
      <FloatingDecor hearts={4} sparkles={8} seed={51} />
      <motion.div className="absolute inset-0" style={{ opacity: petals }}>
        {showPetals && <FloatingDecor hearts={0} petals={13} sparkles={0} seed={55} />}
      </motion.div>

      <motion.p className="absolute inset-x-0 text-center font-display" style={{ top: `calc(50% - ${s(25.6)})`, fontStyle: 'italic', fontWeight: 700, fontSize: s(3.5), color: '#ffe0ea', opacity: lineOpacity, y: lineY, textShadow: '0 0.3rem 1.2rem rgb(20 2 8 / 0.8)' }}>
        {copy.heartLine}
      </motion.p>

      <motion.div className="absolute" style={{ left: `calc(50% - ${s(17)})`, top: `calc(46% - ${s(17)})`, width: s(34), height: s(34), scale: heartScale, opacity: heartOpacity, willChange: 'transform' }}>
        <HeartSequence p={p} />
      </motion.div>

      <motion.p className="absolute inset-x-0 text-center font-hand font-bold" style={{ top: `calc(50% + ${s(16)})`, fontSize: s(2.5), color: '#ffe0ea', opacity: lineOpacity }}>
        {copy.heartHint} ↓
      </motion.p>

      {/* Passing through the heart: everything turns warm red for a moment, and then she is there */}
      <motion.div className="absolute inset-0" style={{ opacity: flood, background: 'radial-gradient(circle at 50% 46%, #ff5c84, #c8133a 62%, #8d0c26)' }} />

      <motion.div className="absolute inset-x-0" style={{ top: `calc(50% - ${s(28.5)})`, opacity: picOpacity, scale: picScale, rotate: picRotate, display: 'flex', justifyContent: 'center' }}>
        <div className="relative">
          <PolaroidCard photo={copy.photo} caption={copy.photoCaption} w={30} unit="s" sizes="90vw" eager develop={false} />
          <Tape kind="pink" w={12} x={9} y={-1} r={-3} unit="s" />
        </div>
      </motion.div>

      <motion.h2 className="absolute inset-x-0 text-center font-display" style={{ top: `calc(50% + ${s(17.8)})`, fontStyle: 'italic', fontWeight: 700, fontSize: s(4.2), lineHeight: 1.06, color: '#ffe0ea', textShadow: '0 0.3rem 1.4rem rgb(20 2 8 / 0.9)', opacity: headOpacity, y: headY, padding: `0 ${s(2)}` }}>
        {copy.heading}
      </motion.h2>
    </div>
  )
}

function Signature() {
  return (
    <div className="relative flex flex-col items-center text-center" style={{ padding: '4rem 1.6rem calc(env(safe-area-inset-bottom) + 3.4rem)' }}>
      <motion.p
        className="font-pen"
        style={{ fontSize: '1.86rem', lineHeight: 2.05, color: '#ffc4dc', textShadow: '0 0 1rem rgb(255 150 190 / 0.45)', textWrap: 'balance' }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
      >
        {copy.signature}{' '}
        <span className="inline-block" style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}>{copy.signatureHeart}</span>
      </motion.p>
    </div>
  )
}

export function FinalSurprise() {
  return (
    <ScrapbookSection bg="bg-wine" edge="b" z={12} label="The last page">
      <Pinned vh={420} backdrop="#3a0c16">
        {(p) => (
          <WhenNear margin="120%">
            <Stage p={p} />
          </WhenNear>
        )}
      </Pinned>

      <div className="relative" style={{ background: 'linear-gradient(180deg, #3a0c16 0%, #57131f 14%, #7f1021 42%, #57131f 72%, #2a0810 100%)', overflow: 'clip' }}>
        <FloatingDecor hearts={4} petals={9} sparkles={7} seed={61} />

        <div className="relative" style={{ margin: '0 auto', paddingTop: '3rem', width: '36.5rem' }}>
          <Sticker name="rose-red" w={11.5} x={-2.6} y={0.6} r={-18} z={3} />
          <Sticker name="bow-pink" w={12} right={-1} y={0} r={14} z={3} />
          {/* The letter */}
          <motion.div
            className="relative"
            style={{ width: '100%', perspective: '90rem' }}
            initial={{ opacity: 0, y: 50, rotateX: 26 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 60, damping: 16 }}
          >
            <img src={art('card-letter')} alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
            <div className="relative" style={{ padding: '6.2rem 4.2rem 4.4rem' }}>
              {copy.letter.map((para, i) => (
                <p key={i} className="font-hand font-bold" style={{ fontSize: i === 0 ? '2.7rem' : '2.42rem', lineHeight: 1.14, color: i === 0 ? '#a71930' : '#57131f', marginBottom: '1.2rem' }}>
                  {para}
                </p>
              ))}
              <p className="font-pen" style={{ fontSize: '1.56rem', color: '#a71930', marginTop: '1.6rem' }}>{copy.closing}</p>
              <Sticker name="kiss" w={8.4} right={3.4} bottom={2.6} r={-12} />
            </div>
          </motion.div>
        </div>

        <div className="relative" style={{ height: '33rem', marginTop: '1rem' }}>
          <PolaroidCard photo={copy.side} caption={copy.sideCaption} w={20} x={9.5} y={0.5} r={-3} tilt={{ rx: 16, rz: -4, z: 40 }} tape="cream" sizes="60vw" />
          <Sticker f="heart_with_ribbon" w={8} x={1} y={4} r={-12} z={5} />
          <Sticker name="tulips-pink" w={11.4} right={-0.6} y={14} r={10} z={5} />
          <Sticker name="gloss-red" w={6} x={2.6} y={21} r={-8} className="bob" />
        </div>

        <Signature />
      </div>
    </ScrapbookSection>
  )
}
