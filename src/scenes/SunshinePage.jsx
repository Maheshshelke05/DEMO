import { sunshine as copy } from '../data/content'
import { art } from '../lib/assets'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { Sticker } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'
import { TiltSticker } from '../components/TiltSticker'

const SCRIPT = [
  'My darling girl, I have tried a hundred times',
  'to write down what you do to my ordinary days.',
  'You walk in and the whole afternoon turns gold.',
  'You laugh and I forget what I was worried about.',
  'I would like to keep you, if that is all right.',
  'Yours, entirely, and without any complaints,',
]

// Faded handwriting on the torn kraft paper, like an old letter
function KraftScript({ top, left, width, rotate, lines = SCRIPT }) {
  return (
    <div className="absolute" style={{ top: `${top}rem`, left: `${left}rem`, width: `${width}rem`, transform: `rotate(${rotate}deg)`, zIndex: 2 }} aria-hidden="true">
      {lines.map((l) => (
        <p key={l} className="font-pen" style={{ fontSize: '1.05rem', lineHeight: 2.1, color: 'rgb(66 34 14 / 0.72)', whiteSpace: 'nowrap', overflow: 'hidden' }}>{l}</p>
      ))}
    </div>
  )
}

// Prints clipped to a piece of string, swinging as she scrolls past them
function Clothesline({ top, items, sag = 2 }) {
  return (
    <div className="absolute inset-x-0" style={{ top: `${top}rem`, height: '30rem' }}>
      <svg className="absolute inset-x-0 top-0" viewBox="0 0 390 60" preserveAspectRatio="none" style={{ width: '100%', height: '6rem', zIndex: 1 }} aria-hidden="true">
        <path d={`M-4 ${8} Q195 ${8 + sag * 20} 394 ${8}`} fill="none" stroke="#7a5a2c" strokeWidth="2.4" />
        <path d={`M-4 ${8} Q195 ${8 + sag * 20} 394 ${8}`} fill="none" stroke="#c9a664" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
      {items.map((it, i) => {
        const x = i === 0 ? 2 : 20.4
        const y = i === 0 ? 1.8 : 1.6
        return (
          <PolaroidCard
            key={it.photo}
            {...it}
            w={16.8}
            x={x}
            y={y}
            r={i === 0 ? -3 : 3}
            origin="50% 0"
            tilt={{ rx: 7, ry: i ? -9 : 9, rz: i ? 7 : -7, swing: 4 }}
            sizes="50vw"
          >
            <img src={art('clothespin')} alt="" className="absolute" style={{ width: '2.1rem', left: '7.3rem', top: '-2.4rem' }} loading="lazy" />
          </PolaroidCard>
        )
      })}
    </div>
  )
}

export function SunshinePage() {
  return (
    <ScrapbookSection bg="bg-gingham-yellow" edge="b" z={10} height={160} label="The yellow sunshine page">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 30% at 76% 10%, rgb(255 244 180 / 0.82), transparent 72%), radial-gradient(ellipse 60% 26% at 16% 62%, rgb(255 236 150 / 0.6), transparent 72%)' }} />
      <Sticker name="torn-kraft-a" w={32} x={-1} y={-1} />
      <KraftScript top={1.4} left={1.4} width={22} rotate={-4} lines={SCRIPT.slice(0, 5)} />
      <Sticker name="bow-gold" w={14} right={1} y={-0.8} r={10} z={5} />

      <div className="absolute" style={{ left: '2.2rem', top: '13.4rem', zIndex: 4 }}>
        <h2 className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '4.5rem', lineHeight: 1, color: '#a71930', textShadow: '0 0.14rem 0 #fff', width: '26rem' }}>{copy.label}</h2>
        <p className="font-hand font-bold" style={{ fontSize: '2.2rem', color: '#6e3a00', marginTop: '0.5rem', width: '34rem', lineHeight: 1.08 }}>{copy.note}</p>
      </div>

      <PolaroidCard {...copy.hero} w={33} x={3} y={30.4} r={-1.5} tilt={{ rx: 18, rz: -3, z: 60 }} tape="yellow" z={3} sizes="96vw" />
      <TiltSticker name="sunflower" w={12.5} x={-3.6} y={29} r={-14} z={5} rz={16} />
      <TiltSticker name="tulips-yellow" w={11.5} right={-2} y={43} r={10} z={5} />

      <Clothesline top={67.5} items={copy.lines[0]} />
      <Clothesline top={92} items={copy.lines[1]} sag={1.4} />

      <Sticker name="sprig-yellow" w={7.4} x={16.2} y={87} r={-10} z={6} />
      <Sticker f="sunflower" w={5} right={0.6} y={86} r={8} z={6} />

      <Sticker name="torn-kraft-b" w={36} right={-1} bottom={-1} />
      <KraftScript top={143} left={17} width={21} rotate={-5} lines={SCRIPT.slice(0, 4)} />
      <PolaroidCard {...copy.sunset} w={21} x={2.4} y={122} r={-3} tilt={{ rx: 16, ry: 10, rz: -4, z: 50 }} tape="kraft" z={5} sizes="62vw" />
      <Sticker name="news-weather" w={15.6} x={22.6} y={121} r={4} z={6} />
      <TiltSticker name="sunflower-stem" w={12.5} right={-1.4} y={137.4} r={6} z={6} rz={8} />
      <Butterfly tone="gold" w={7} x={20} y={117} r={18} z={7} />
      <p className="absolute font-type" style={{ left: '1.6rem', bottom: '1rem', fontSize: '1.15rem', color: '#6e3a00', zIndex: 3 }}>pg. 9</p>
    </ScrapbookSection>
  )
}
