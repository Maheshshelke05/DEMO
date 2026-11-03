import { easeInOut, motion, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cover as copy, messages } from '../data/content'
import { Pinned } from '../components/Pinned'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker, Tape } from '../components/Sticker'

const s = (n) => `calc(var(--s) * ${n})`
const FOIL = 'linear-gradient(100deg, #ffe0ea 0%, #fff1d8 26%, #ffb6d5 52%, #fff6e8 76%, #ffc4dc 100%)'

function CoverFront({ visibility }) {
  return (
    <motion.div className="bg-wine absolute inset-0" style={{ visibility, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: `${s(0.5)} ${s(1.3)} ${s(1.3)} ${s(0.5)}`, boxShadow: `inset ${s(1.5)} 0 ${s(1.2)} rgb(20 2 6 / 0.55), inset 0 0 ${s(3)} rgb(20 2 6 / 0.5)` }}>
      {/* Stitching around the leather */}
      <div className="absolute" style={{ inset: s(1.2), left: s(2.4), border: `${s(0.2)} dashed rgb(255 224 234 / 0.72)`, borderRadius: s(0.8) }} />
      <div className="absolute inset-x-0 text-center" style={{ top: s(3.1), paddingLeft: s(1) }}>
        <p className="font-type" style={{ fontSize: s(1.34), letterSpacing: '0.2em', color: '#ffb6d5' }}>{copy.kicker.toUpperCase()}</p>
        <h1 className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, lineHeight: 1.04, marginTop: s(0.75) }}>
          {copy.title.map((line, i) => (
            <span
              key={line}
              className="block"
              style={{
                fontSize: s(i === 0 ? 3.4 : 4.7),
                background: FOIL,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0.1rem 0 rgb(30 2 8 / 0.7))',
              }}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>
      <PolaroidCard photo={copy.photo} caption={copy.photoCaption} w={21} x={6.6} y={16.6} r={-2.5} unit="s" eager develop={false} sizes="60vw" />
      <Tape kind="pink" w={9.4} x={12.4} y={15.7} r={-4} unit="s" />
      <Sticker name="bow-pink" w={10.6} x={22.6} y={14.6} r={13} unit="s" eager />
      <Sticker name="rose-red" w={9.6} x={2.2} y={41.4} r={-12} unit="s" eager />
      <Sticker f="sparkling_heart" w={4.8} x={26} y={43.4} r={10} unit="s" eager />
      <p className="absolute inset-x-0 text-center font-pen" style={{ bottom: s(2), fontSize: s(1.2), color: '#ffe0ea', paddingLeft: s(1) }}>
        {copy.sub}
      </p>
    </motion.div>
  )
}

function CoverInside({ visibility }) {
  return (
    <motion.div
      className="bg-gingham-pink absolute inset-0"
      style={{ visibility, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', rotateY: 180, borderRadius: `${s(1.3)} ${s(0.5)} ${s(0.5)} ${s(1.3)}` }}
    >
      <div className="bg-cream absolute text-center" style={{ left: s(6), right: s(6), top: s(19), padding: s(2), boxShadow: '0 0.4rem 1rem rgb(60 10 26 / 0.3)', transform: 'rotate(1.5deg)' }}>
        <p className="font-type" style={{ fontSize: s(1.3), color: '#a71930' }}>{copy.inside}</p>
        <p className="font-pen" style={{ fontSize: s(2), color: '#57131f', marginTop: s(1) }}>{copy.insideName}</p>
      </div>
    </motion.div>
  )
}

function Stage({ p }) {
  const turn = useTransform(p, [0.01, 0.68], [0, -172], { ease: easeInOut })
  const frontOn = useTransform(turn, (a) => (a > -90 ? 'visible' : 'hidden'))
  const insideOn = useTransform(turn, (a) => (a > -90 ? 'hidden' : 'visible'))
  const push = useTransform(p, [0.1, 0.92], [1, 1.17])
  const hint = useTransform(p, [0, 0.05], [1, 0])
  const shade = useTransform(p, [0.01, 0.34, 0.68], [0, 0.52, 0.1])
  const castOpacity = useTransform(p, [0.01, 0.26, 0.5], [0, 1, 0])
  const msgOpacity = useTransform(p, [0.38, 0.66], [0, 1])
  const msgY = useTransform(p, [0.38, 0.72], [26, 0])
  const msgScale = useTransform(p, [0.38, 1], [0.96, 1.02])

  return (
    <div className="absolute inset-0" style={{ perspective: s(135), perspectiveOrigin: '30% 50%' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 46%, transparent 44%, rgb(70 6 20 / 0.5) 100%)' }} />
      <FloatingDecor hearts={5} sparkles={6} seed={5} />
      <Sticker name="pearls" w={50} x={-6} y={-5.4} r={3} unit="s" eager />

      <motion.div
        className="absolute"
        style={{ left: s(3), top: `calc(50% - ${s(29.4)})`, width: s(33), height: s(57), scale: push, transformStyle: 'preserve-3d', transformOrigin: '52% 50%' }}
      >
        {/* The soft shadow on the table */}
        <div className="absolute" style={{ inset: s(-0.6), top: s(0.9), left: s(0.5), borderRadius: s(1.4), background: 'rgb(40 4 12 / 0.46)', filter: `blur(${s(1)})` }} />

        {/* The first page, waiting underneath */}
        <div className="bg-cream absolute inset-0 overflow-hidden" style={{ borderRadius: `${s(0.3)} ${s(1.1)} ${s(1.1)} ${s(0.3)}`, boxShadow: `${s(0.2)} ${s(0.16)} 0 #efe0c4, ${s(0.42)} ${s(0.32)} 0 #e0cda8, ${s(0.62)} ${s(0.5)} 0 #efe0c4` }}>
          <motion.div className="absolute inset-0" style={{ opacity: castOpacity, background: 'linear-gradient(90deg, rgb(40 6 14 / 0.62), rgb(40 6 14 / 0.1) 80%)' }} />
          <motion.div className="absolute inset-x-0 flex flex-col items-center text-center" style={{ top: s(12), padding: `0 ${s(3)}`, opacity: msgOpacity, y: msgY, scale: msgScale }}>
            <Sticker name="rose-red" w={9} right={-0.5} y={-9.6} r={14} unit="s" eager />
            <p className="font-pen" style={{ fontSize: s(2.45), lineHeight: 1.85, color: '#57131f' }}>{messages.first}</p>
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: msgOpacity }}>
            <Sticker name="thumb-heart" w={9} x={2.6} y={38} r={-10} unit="s" />
            <PolaroidCard photo={copy.insidePhoto} caption={copy.insideCaption} w={14.6} x={15.4} y={33.8} r={5} unit="s" eager develop={false} sizes="40vw" />
            <Tape kind="red" w={6.4} x={19.6} y={33.2} r={3} unit="s" />
          </motion.div>
          <p className="absolute font-type" style={{ right: s(1.8), bottom: s(1.4), fontSize: s(1.15), color: '#a71930' }}>pg. 1</p>
        </div>

        {/* The cover swings open on its hinge */}
        <motion.div className="absolute inset-0" style={{ rotateY: turn, transformOrigin: '0% 50%', transformStyle: 'preserve-3d' }}>
          <CoverFront visibility={frontOn} />
          <CoverInside visibility={insideOn} />
          <motion.div className="pointer-events-none absolute inset-0" style={{ visibility: frontOn, opacity: shade, background: 'linear-gradient(90deg, rgb(20 2 6 / 0.72), rgb(20 2 6 / 0.3))', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: s(1) }} />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + var(--s) * 0.5)', opacity: hint, color: '#57131f' }}
      >
        <span className="font-hand font-bold" style={{ fontSize: s(2.1), lineHeight: 1, padding: `${s(0.3)} ${s(1.1)}`, background: 'rgb(255 253 248 / 0.92)', borderRadius: s(1) }}>
          {copy.scrollHint}
        </span>
        <span style={{ animation: 'nudge 1.5s ease-in-out infinite' }}>
          <ChevronDown size="2.6rem" strokeWidth={3} />
        </span>
      </motion.div>
    </div>
  )
}

export function CoverBook() {
  return (
    <ScrapbookSection bg="bg-gingham-red" edge={null} z={1} label="The cover of the scrapbook">
      <Pinned vh={235}>{(p) => <Stage p={p} />}</Pinned>
    </ScrapbookSection>
  )
}
