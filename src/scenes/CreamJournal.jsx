import { memo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { journal as copy } from '../data/content'
import { clamp, photo } from '../lib/assets'
import { Pinned, WhenNear } from '../components/Pinned'
import { Photo, PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { Sticker, Tape } from '../components/Sticker'
import { TiltSticker } from '../components/TiltSticker'

const s = (n) => `calc(var(--s) * ${n})`
const W = 35.4
const H = 60
const STRIPS = 6

const LeafFront = memo(function LeafFront({ page, n, total }) {
  const pic = photo(page.photo)
  const frameW = pic.ratio > 0.85 ? 28 : 25
  return (
    <div className="bg-cream absolute inset-0" style={{ width: s(W), height: s(H) }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0, transparent calc(var(--s) * 3.14), rgb(167 25 48 / 0.13) calc(var(--s) * 3.14), rgb(167 25 48 / 0.13) calc(var(--s) * 3.2))' }} />
      <div className="absolute" style={{ left: s(2.9), top: 0, bottom: 0, width: s(0.14), background: 'rgb(242 139 174 / 0.75)' }} />
      <p className="absolute font-pen" style={{ left: s(4.6), top: s(2.2), fontSize: s(1.5), color: '#a71930' }}>{copy.label}</p>
      <div className="absolute" style={{ left: s((W - frameW) / 2 + 1), top: s(6.6), width: s(frameW), padding: s(0.8), background: '#fffdf8', boxShadow: `0 ${s(0.5)} ${s(1.3)} rgb(60 20 20 / 0.35)`, transform: `rotate(${n % 2 ? 1.6 : -1.6}deg)` }}>
        <div className="photo-window" style={{ aspectRatio: Math.max(pic.ratio, 0.8), backgroundImage: `url(${pic.blur})` }}>
          <Photo k={page.photo} sizes="74vw" eager />
          <div className="gloss" />
        </div>
      </div>
      <Tape kind={n % 2 ? 'kraft' : 'pink'} w={9} unit="s" x={13} y={5.4} r={n % 2 ? 3 : -4} />
      <p className="absolute font-hand font-bold text-center" style={{ left: s(5), right: s(2.4), bottom: s(4.6), fontSize: s(3.05), lineHeight: 1.1, color: '#57131f' }}>{page.text}</p>
      <p className="absolute font-type" style={{ right: s(1.6), bottom: s(1.4), fontSize: s(1.15), color: '#a71930' }}>{n + 1} / {total}</p>
    </div>
  )
})

const LeafBack = memo(function LeafBack() {
  return (
    <div className="bg-blush absolute inset-0" style={{ width: s(W), height: s(H) }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0, transparent calc(var(--s) * 3.14), rgb(167 25 48 / 0.1) calc(var(--s) * 3.14), rgb(167 25 48 / 0.1) calc(var(--s) * 3.2))' }} />
    </div>
  )
})

function Strip({ i, turn, bend, shade, front, back }) {
  const sw = W / STRIPS
  const rotateY = i === 0 ? turn : bend
  const angle = useTransform([turn, bend], ([t, b]) => t + i * b)
  const frontOn = useTransform(angle, (a) => (a > -90 ? 'visible' : 'hidden'))
  const backOn = useTransform(angle, (a) => (a > -90 ? 'hidden' : 'visible'))
  return (
    <motion.div
      className="absolute"
      style={{ left: i === 0 ? 0 : s(sw - 0.01), top: 0, width: s(sw), height: s(H), rotateY, transformOrigin: '0 50%', transformStyle: 'preserve-3d' }}
    >
      <motion.div className="absolute inset-0 overflow-hidden" style={{ visibility: frontOn, width: `calc(${s(sw)} + 1px)`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className="absolute top-0" style={{ left: s(-sw * i), width: s(W), height: s(H) }}>{front}</div>
        <motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgb(50 10 16 / ${(i * 0.055).toFixed(3)}), rgb(50 10 16 / ${((i + 1) * 0.055).toFixed(3)}))`, opacity: shade }} />
      </motion.div>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ visibility: backOn, width: `calc(${s(sw)} + 1px)`, rotateY: 180, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className="absolute top-0" style={{ left: s(-sw * (STRIPS - 1 - i)), width: s(W), height: s(H) }}>{back}</div>
        <motion.div className="absolute inset-0" style={{ background: 'rgb(50 10 16 / 0.22)', opacity: shade }} />
      </motion.div>
      {i < STRIPS - 1 && <Strip i={i + 1} turn={turn} bend={bend} shade={shade} front={front} back={back} />}
    </motion.div>
  )
}

// A page that actually bends as it turns: six hinged strips, each leaning a little further than the last.
function CurlLeaf({ p, from, to, front, back, order }) {
  const local = useTransform(p, (v) => clamp((v - from) / (to - from)))
  const eased = (v) => v * v * (3 - 2 * v)
  const turn = useTransform(local, (v) => -176 * eased(v) + Math.sin(Math.PI * v) * 30)
  const bend = useTransform(local, (v) => (Math.sin(Math.PI * v) * -62) / (STRIPS - 1))
  const shade = useTransform(local, (v) => Math.sin(Math.PI * v))
  const visibility = useTransform(local, (v) => (v >= 1 ? 'hidden' : 'visible'))
  return (
    <motion.div className="absolute inset-0" style={{ visibility, transformStyle: 'preserve-3d', transform: `translateZ(${order * 0.4}px)` }}>
      <Strip i={0} turn={turn} bend={bend} shade={shade} front={front} back={back} />
    </motion.div>
  )
}

function Rings() {
  return (
    <div className="pointer-events-none absolute" style={{ left: s(-0.9), top: s(1), bottom: s(1), width: s(2.5), zIndex: 30, transform: 'translateZ(40px)' }}>
      {Array.from({ length: 13 }, (_, i) => (
        <div key={i} className="absolute" style={{ top: `${(i / 12) * 96 + 1}%`, left: 0, width: s(2.6), height: s(0.82), borderRadius: s(0.5), background: 'linear-gradient(180deg,#f7f7f8,#8f9196 62%,#d7d8db)', boxShadow: `0 ${s(0.15)} ${s(0.25)} rgb(20 4 6 / 0.55)` }} />
      ))}
    </div>
  )
}

function Stage({ p }) {
  const pages = copy.pages
  const n = pages.length
  const span = 0.92 / n
  const hint = useTransform(p, [0, 0.04], [1, 0])
  const castOpacity = useTransform(p, (v) => {
    const at = (v - 0.03) / span
    if (at <= 0 || at >= n) return 0
    return Math.sin(Math.PI * (at % 1)) * 0.62
  })
  return (
    <div className="absolute inset-0" style={{ perspective: s(115), perspectiveOrigin: '20% 50%' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 50%, transparent 40%, rgb(20 2 8 / 0.6) 100%)' }} />
      <Sticker name="rose-wine" w={13} right={-4} y={-2} r={22} unit="s" />
      <div className="absolute" style={{ left: s(2.1), top: `calc(50% - ${s(H / 2)})`, width: s(W), height: s(H), transformStyle: 'preserve-3d' }}>
        {/* Last page of the diary, under everything */}
        <div className="bg-cream absolute inset-0 flex flex-col items-center justify-center text-center" style={{ boxShadow: `0 ${s(0.6)} ${s(2)} rgb(10 2 4 / 0.6), ${s(0.22)} ${s(0.16)} 0 #efe0c4, ${s(0.44)} ${s(0.32)} 0 #dfcba6`, padding: `0 ${s(4)}` }}>
          <img src={`${import.meta.env.BASE_URL}art/thumb-heart.webp`} alt="" style={{ width: s(12) }} />
          <p className="font-pen" style={{ fontSize: s(1.9), lineHeight: 1.9, color: '#57131f', marginTop: s(2) }}>that is all the pages I had. I have more words, though. Keep going.</p>
        </div>
        <motion.div className="absolute inset-0" style={{ opacity: castOpacity, background: 'linear-gradient(90deg, rgb(40 6 14 / 0.9), rgb(40 6 14 / 0.12) 85%)' }} />
        {pages.map((page, i) => (
          <CurlLeaf
            key={page.photo}
            p={p}
            from={0.03 + i * span}
            to={0.03 + (i + 1) * span}
            order={n - i}
            front={<LeafFront page={page} n={i} total={n} />}
            back={<LeafBack />}
          />
        ))}
        <Rings />
      </div>
      <motion.p className="absolute inset-x-0 text-center font-hand font-bold" style={{ bottom: `calc(env(safe-area-inset-bottom) + var(--s) * 0.5)`, fontSize: s(1.9), color: '#ffe0ea', opacity: hint, zIndex: 40 }}>
        {copy.turnHint} ↓
      </motion.p>
    </div>
  )
}

export function CreamJournal() {
  const [first, second, third] = copy.loose
  return (
    <>
      <ScrapbookSection bg="bg-wine" edge="b" z={7} label="A cream vintage journal">
        <Pinned vh={460}>
          {(p) => (
            <WhenNear>
              <Stage p={p} />
            </WhenNear>
          )}
        </Pinned>
      </ScrapbookSection>

      {/* A loose sheet that fell out of the diary */}
      <ScrapbookSection bg="bg-cream" edge="a" z={8} height={92} label="Loose pages from the journal">
        <PolaroidCard {...first} w={24} x={2} y={3.4} r={-3} tilt={{ rx: 18, rz: -3, z: 50 }} tape="pink" sizes="72vw" />
        <TiltSticker name="sprig-pink" w={13} right={-0.6} y={2} r={14} />
        <TiltSticker f="teddy_bear" w={9.6} right={1.4} y={22} r={8} rz={12} />
        <PolaroidCard {...second} w={19} x={18.6} y={45} r={4} tilt={{ rx: 16, ry: -12, rz: 4, z: 40 }} tape="kraft" sizes="56vw" />
        <PolaroidCard {...third} w={15.5} x={1.6} y={52} r={-5} tilt={{ rx: 16, ry: 12, rz: -5, z: 40 }} tape="cream" sizes="46vw" />
        <Sticker name="daisy-pink" w={6.6} x={2.4} y={43.4} r={10} z={5} />
        <Sticker name="postmark" w={9.5} x={24} y={76} r={-12} style={{ opacity: 0.75 }} />
        <Sticker name="stamp" w={8.2} x={30.4} y={74} r={7} />
        <Sticker f="love_letter" w={7} x={17.4} y={76} r={-8} />
      </ScrapbookSection>
    </>
  )
}
