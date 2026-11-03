import { useEffect, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { blue as copy } from '../data/content'
import { art, photo } from '../lib/assets'
import { useRange } from '../components/Pinned'
import { Photo, PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { Sticker } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'
import { TiltSticker } from '../components/TiltSticker'
import { registerTilt } from '../lib/scrollFx'

// A photo mounted on thick handmade paper, the look of the denim page
function PaperCard({ item, w, x, y, r, tilt, wide }) {
  const outer = useRef(null)
  const inner = useRef(null)
  const pic = photo(item.photo)
  useEffect(() => registerTilt(outer.current, inner.current, { base: r, ...tilt }), [r, tilt])
  const h = w * (wide ? 0.745 : 1.342)
  return (
    <div ref={outer} className="absolute" style={{ left: `${x}rem`, top: `${y}rem`, width: `${w}rem`, height: `${h}rem` }}>
      <div ref={inner} className="absolute inset-0">
        <img src={art(wide ? 'card-wide' : 'card-tall')} alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
        <div className="photo-window" style={{ position: 'absolute', left: '9.4%', right: '9.4%', top: '7.4%', bottom: '17%', backgroundImage: `url(${pic.blur})` }}>
          <Photo k={item.photo} sizes={`${Math.round(w * 2.4)}vw`} alt={item.caption} />
          <div className="gloss" />
        </div>
        <p className="absolute inset-x-0 text-center font-hand font-bold" style={{ bottom: '6%', fontSize: '2.1rem', color: '#2c4a80' }}>{item.caption}</p>
      </div>
    </div>
  )
}

// A butterfly that crosses the page as she scrolls
function FlyingButterfly({ tone, w, path, r }) {
  const [ref, p] = useRange(1, -0.1)
  const x = useTransform(p, (v) => `${path[0] + (path[2] - path[0]) * v + Math.sin(v * 7) * 2.4}rem`)
  const y = useTransform(p, (v) => `${path[1] + (path[3] - path[1]) * v + Math.cos(v * 9) * 3}rem`)
  const rotate = useTransform(p, (v) => r + Math.sin(v * 9) * 16)
  return (
    <div ref={ref} className="absolute inset-x-0" style={{ top: `${path[1]}rem`, height: `${path[3] - path[1]}rem`, pointerEvents: 'none', zIndex: 9 }}>
      <motion.div className="absolute left-0" style={{ top: `-${path[1]}rem`, x, y, rotate }}>
        <Butterfly tone={tone} w={w} />
      </motion.div>
    </div>
  )
}

export function BluePage() {
  const p = copy.photos
  return (
    <ScrapbookSection bg="bg-denim" edge="a" z={9} height={176} label="The blue butterfly memory page">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 26%, rgb(160 195 235 / 0.22), transparent 62%), linear-gradient(180deg, transparent 70%, rgb(10 20 50 / 0.3))' }} />
      <Sticker name="torn-denim-a" w={30} x={-1} y={-1} />
      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        {[[3, 3], [10, 8], [18, 2.6], [5, 13], [13, 16], [24, 7], [3, 22]].map(([x, y], i) => (
          <span key={i} className="absolute" style={{ left: `${x}rem`, top: `${y}rem`, color: '#dfe9f6', fontSize: `${1.4 + (i % 3) * 0.3}rem`, opacity: 0.65 }}>★</span>
        ))}
      </div>

      {/* The long cream label */}
      <div className="absolute" style={{ left: '2rem', top: '3.2rem', width: '30rem', height: '10rem', zIndex: 5, transform: 'rotate(-2deg)' }}>
        <img src={art('card-long')} alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
        <p className="absolute inset-0 grid place-items-center font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '2.35rem', lineHeight: 1.05, color: '#2c4a80', textAlign: 'center', padding: '0 2.4rem', textWrap: 'balance' }}>{copy.label}</p>
      </div>
      <Sticker name="sprig-blue" w={10.4} right={-1.4} y={0.4} r={14} z={6} />
      <Butterfly tone="blue" w={9} x={0.2} y={-3.4} r={-14} z={7} />

      <PaperCard item={p.card1} w={21} x={1.4} y={16} r={-3} tilt={{ rx: 16, ry: 10, rz: -4, z: 50 }} />
      <Sticker name="daisy-blue" w={10} x={18.6} y={14} r={10} z={6} />
      <PaperCard item={p.card2} w={20.4} x={18} y={29} r={3} tilt={{ rx: 16, ry: -10, rz: 4, z: 50 }} />
      <Sticker name="bow-blue" w={15} x={1.8} y={43} r={-10} z={7} />

      <PaperCard item={p.card3} w={22} x={1} y={55} r={-2} tilt={{ rx: 16, ry: 10, rz: -3, z: 50 }} />
      <TiltSticker name="daisy-white" w={8} x={21} y={57} r={14} z={6} />
      <PaperCard item={p.card4} w={20} x={18.4} y={68} r={4} tilt={{ rx: 16, ry: -10, rz: 4, z: 50 }} />

      {/* Lace label with a line of love */}
      <div className="absolute" style={{ left: '1.4rem', top: '90rem', width: '20rem', height: '12.8rem', zIndex: 8, transform: 'rotate(-5deg)' }}>
        <img src={art('lace-blue')} alt="" className="absolute inset-0 h-full w-full" loading="lazy" />
        <p className="absolute grid place-items-center text-center font-hand font-bold" style={{ inset: '2.6rem 3rem', fontSize: '1.62rem', lineHeight: 1.04, color: '#fff1d8' }}>{copy.note}</p>
      </div>

      <PolaroidCard {...p.small1} w={16} x={2} y={106} r={-5} tilt={{ rx: 16, ry: 12, rz: -5, z: 40 }} tape="blue" sizes="46vw" />
      <PolaroidCard {...p.small2} w={16} x={21} y={96} r={5} tilt={{ rx: 16, ry: -12, rz: 5, z: 40 }} tape="cream" sizes="46vw" />
      <PolaroidCard {...p.small3} w={17} x={20.6} y={123} r={-3} tilt={{ rx: 16, ry: -10, rz: 4, z: 40 }} tape="blue" sizes="50vw" />
      <PolaroidCard {...p.small4} w={16.4} x={2.4} y={136} r={4} tilt={{ rx: 16, ry: 12, rz: 4, z: 40 }} tape="kraft" sizes="48vw" />
      <Sticker name="lace-white" w={17} right={-5} bottom={-3} r={-8} style={{ opacity: 0.82 }} />
      <Butterfly tone="blue" w={7.5} x={18.4} y={148} r={18} z={7} />
      <FlyingButterfly tone="blue" w={8} path={[32, 28, -2, 96]} r={-30} />
      <p className="absolute font-type" style={{ left: '1.6rem', bottom: '1rem', fontSize: '1.15rem', color: '#dfe9f6' }}>pg. 8</p>
    </ScrapbookSection>
  )
}
