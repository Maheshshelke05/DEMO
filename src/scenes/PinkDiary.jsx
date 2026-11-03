import { useEffect, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { diary as copy } from '../data/content'
import { art, photo } from '../lib/assets'
import { subscribe, toggleMusic } from '../lib/sound'
import { Photo, PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { useRange } from '../components/Pinned'
import { Sticker, Tape } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'

const SCRAPS = [
  { cls: 'bg-cream', color: '#a71930', font: 'var(--font-display)' },
  { bg: '#a71930', color: '#fff1d8', font: 'var(--font-type)' },
  { cls: 'bg-gingham-red', color: '#57131f', font: 'var(--font-display)', stroke: true },
  { bg: '#fffdf8', color: '#57131f', font: 'var(--font-type)' },
  { bg: '#ffb6d5', color: '#6e0d20', font: 'var(--font-display)' },
  { bg: '#57131f', color: '#ffb6d5', font: 'var(--font-display)' },
  { cls: 'bg-kraft', color: '#3a1a1f', font: 'var(--font-type)' },
]
const CUTS = [
  'polygon(3% 5%, 97% 0, 100% 94%, 0 100%)',
  'polygon(0 0, 100% 6%, 96% 100%, 5% 95%)',
  'polygon(5% 2%, 100% 0, 95% 96%, 0 100%)',
  'polygon(0 6%, 95% 0, 100% 100%, 3% 94%)',
]

// Birthday, cut out of old paper one letter at a time, like a ransom note for her heart.
function RansomWord({ word, size, startAt = 0 }) {
  return (
    <div className="flex justify-center" style={{ gap: '0.32rem', perspective: '50rem' }} aria-label={word}>
      {word.split('').map((ch, i) => {
        const scrap = SCRAPS[(i * 3 + startAt) % SCRAPS.length]
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className={`relative grid place-items-center ${scrap.cls ?? ''}`}
            style={{
              width: `${size}rem`,
              height: `${size * 1.28}rem`,
              background: scrap.bg,
              color: scrap.color,
              fontFamily: scrap.font,
              fontWeight: 700,
              fontSize: `${size * 0.86}rem`,
              lineHeight: 1,
              clipPath: CUTS[(i + startAt) % CUTS.length],
              textShadow: scrap.stroke ? '0 0 0.6rem #fff, 0 0 0.3rem #fff, 0 0 0.2rem #fff' : undefined,
            }}
            initial={{ rotateX: -110, y: -24, opacity: 0, rotate: 0 }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1, rotate: ((i * 37 + startAt * 11) % 15) - 7 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.08 + (i + startAt) * 0.055 }}
          >
            {ch}
          </motion.span>
        )
      })}
    </div>
  )
}

function StripFrame({ k, p, from, to }) {
  const rotateX = useTransform(p, [from, to], [-96, 0])
  const opacity = useTransform(p, [from, from + 0.04], [0, 1])
  const shade = useTransform(p, [from, to], [0.65, 0])
  const pic = photo(k)
  return (
    <motion.div className="relative" style={{ rotateX, opacity, transformOrigin: '50% 0', transformStyle: 'preserve-3d', padding: '0.55rem 0.7rem 0', background: 'linear-gradient(180deg,#fffefb,#f8f0e0)', boxShadow: '0 0.5rem 1rem rgb(100 20 50 / 0.26)' }}>
      <div className="photo-window" style={{ aspectRatio: 0.82, backgroundImage: `url(${pic.blur})` }}>
        <Photo k={k} sizes="38vw" />
        <div className="gloss" />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} />
      </div>
    </motion.div>
  )
}

// A photobooth strip that unfolds in 3D, one frame at a time, as she scrolls
function PhotoStrip({ keys }) {
  const [ref, p] = useRange(0.86, 0.1)
  const footer = useTransform(p, [0.84, 0.96], [0, 1])
  return (
    <div ref={ref} className="absolute" style={{ left: '1.8rem', top: '53rem', width: '15.4rem', perspective: '55rem', zIndex: 5 }}>
      <div className="relative" style={{ transform: 'rotate(-1.6deg)', transformStyle: 'preserve-3d' }}>
        {keys.map((k, i) => (
          <StripFrame key={k} k={k} p={p} from={0.03 + i * 0.27} to={0.31 + i * 0.27} />
        ))}
        <motion.p className="text-center font-type" style={{ opacity: footer, padding: '0.7rem 0', fontSize: '1.05rem', color: '#a71930', letterSpacing: '0.06em', background: '#f8f0e0' }}>photo booth · 3 for 1 kiss</motion.p>
      </div>
      <Tape kind="pink" w={8} x={4} y={-1.2} r={3} />
    </div>
  )
}

function VoiceNote() {
  const [playing, setPlaying] = useState(false)
  useEffect(() => subscribe((s) => setPlaying(s.musicOn)), [])
  const bars = [4, 7, 5, 9, 12, 8, 14, 10, 16, 12, 18, 13, 16, 10, 13, 8, 11, 6, 9, 5, 7, 4]
  return (
    <button
      onClick={toggleMusic}
      className="absolute flex items-center"
      style={{ left: '18.2rem', top: '91rem', width: '19.4rem', height: '6.2rem', gap: '1rem', padding: '0 1.4rem', borderRadius: '1.6rem', background: 'linear-gradient(180deg,#e88fb0,#cf6e94)', boxShadow: '0 0.6rem 1.4rem rgb(120 30 70 / 0.35), inset 0 0.12rem 0 rgb(255 255 255 / 0.5)', color: '#fff', zIndex: 6 }}
      aria-label={playing ? 'Pause the music box' : 'Play the music box'}
      aria-pressed={playing}
    >
      {playing ? <Pause size="2.3rem" fill="#fff" /> : <Play size="2.3rem" fill="#fff" />}
      <span className="flex items-center" style={{ gap: '0.22rem', height: '2.2rem' }}>
        {bars.map((h, i) => (
          <span
            key={i}
            style={{
              width: '0.28rem',
              height: `${h * 0.12}rem`,
              borderRadius: '0.2rem',
              background: '#fff',
              transformOrigin: 'center',
              animation: playing ? `pulseBar 0.9s ease-in-out ${i * 0.05}s infinite` : 'none',
            }}
          />
        ))}
      </span>
    </button>
  )
}

export function PinkDiary() {
  return (
    <ScrapbookSection bg="bg-gingham-pink" edge="b" z={3} height={136} label="Her birthday diary page">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(255 255 255 / 0.2), rgb(255 182 213 / 0.14))' }} />

      <div className="absolute inset-x-0" style={{ top: '4.4rem' }}>
        <RansomWord word={copy.word[0]} size={5.7} />
        <div style={{ height: '1rem' }} />
        <RansomWord word={copy.word[1]} size={4.2} startAt={2} />
      </div>
      <Butterfly tone="pink" w={8.5} right={1.2} y={0.8} r={14} />
      <Sticker name="thumb-heart" w={7} x={1} y={1.4} r={-14} />

      <PolaroidCard photo={copy.hero.photo} caption={copy.hero.caption} w={24} x={1.7} y={21} tilt={{ rx: 18, rz: -3, z: 60 }} r={-3} tape="pink" sizes="72vw" />
      <Sticker name="kitten" w={15.6} right={0.2} y={22.6} r={7} z={4} />
      <Sticker name="bow-pink" w={10.4} x={26} y={42} r={12} z={6} />
      <Sticker f="cherry_blossom" w={4.4} x={28.6} y={50} r={8} z={3} />

      <PhotoStrip keys={copy.strip} />

      {/* A note on handmade paper */}
      <div className="absolute" style={{ left: '17.2rem', top: '55rem', width: '21rem', minHeight: '31rem', zIndex: 4, transform: 'rotate(2deg)' }}>
        <img src={art('card-tall')} alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
        <div className="relative" style={{ padding: '2.8rem 2.5rem' }}>
          <p className="font-pen" style={{ fontSize: '1.42rem', lineHeight: 1.9, color: '#a71930' }}>{copy.note.title}</p>
          <p className="font-hand font-bold" style={{ fontSize: '2.22rem', lineHeight: 1.16, color: '#57131f', marginTop: '0.9rem' }}>{copy.note.body}</p>
        </div>
        <Tape kind="red" w={7.5} x={6.4} y={0.4} r={-3} />
      </div>
      <Sticker f="birthday_cake" w={6.6} x={31.4} y={82} r={8} z={5} />

      <VoiceNote />

      <PolaroidCard photo={copy.mono.photo} caption={copy.mono.caption} w={20} x={17.2} y={99} tilt={{ rx: 14, ry: -14, rz: 4, z: 40 }} r={3} tape="cream" sizes="60vw" />
      <Sticker name="tulips-rose" w={15} x={-1.4} bottom={2} r={-8} z={3} />
      <Sticker f="hamster" w={7.4} x={10.6} bottom={2.4} r={4} z={4} />
      <Butterfly tone="cherry" w={6.5} x={2.5} y={109} r={-22} z={5} />
      <p className="absolute font-type" style={{ right: '1.6rem', bottom: '1rem', fontSize: '1.15rem', color: '#a71930' }}>pg. 3</p>
    </ScrapbookSection>
  )
}
