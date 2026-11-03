import { cherry as copy } from '../data/content'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { Sticker, Tape } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'
import { TiltSticker } from '../components/TiltSticker'

export function CherryPage() {
  const p = copy.photos
  return (
    <ScrapbookSection bg="bg-gingham-red" edge="a" z={6} height={238} label="The cherry-red page">
      {/* Burgundy leather torn away from the top-left corner */}
      <Sticker name="torn-leather-a" w={33} x={-1} y={-1} />
      <Sticker name="pearls" w={36} x={-6} y={3} r={-30} z={2} />
      <Sticker name="note-a" w={7} x={3} y={3.4} r={-10} z={3} />
      <Sticker name="note-b" w={6.6} x={12} y={1.4} r={8} z={3} />
      <Sticker name="note-c" w={6.2} x={2.4} y={14.6} r={6} z={3} />
      <Sticker name="minicam" w={15.5} right={0.4} y={2.2} r={8} z={4} />
      <Sticker name="bow-cherry" w={9.6} right={10.8} y={1} r={-14} z={5} />

      {/* Label */}
      <div className="bg-cream absolute" style={{ left: '8.5rem', top: '18.6rem', width: '29rem', padding: '1.1rem 1.4rem', transform: 'rotate(-2deg)', boxShadow: '0 0.5rem 1.2rem rgb(40 6 14 / 0.42)', zIndex: 6 }}>
        <p className="text-center font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '2.45rem', lineHeight: 1.1, color: '#a71930' }}>{copy.label}</p>
        <Tape kind="red" w={7} x={1.4} y={-1.1} r={-6} />
      </div>

      <PolaroidCard {...p.top} w={24} x={13} y={29} r={3} tilt={{ rx: 18, ry: -8, rz: 4, z: 50 }} tape="red" sizes="72vw" />
      <TiltSticker name="lily-red" w={19} x={-5} y={34} r={-20} z={5} rz={-14} />
      <TiltSticker name="rose-red" w={14} x={-1.6} y={49} r={10} z={6} rz={14} />
      <Sticker f="cherries" w={6} x={9.6} y={61} r={-8} z={7} />

      <Sticker name="news-heart" w={31} x={1} y={67} r={-3} z={3} />

      <PolaroidCard {...p.right} w={18} x={20} y={93} r={6} tilt={{ rx: 16, ry: -12, rz: 5, z: 40 }} tape="kraft" z={6} sizes="54vw" />
      <PolaroidCard {...p.left} w={18.5} x={1.2} y={97} r={-5} tilt={{ rx: 16, ry: 12, rz: -5, z: 40 }} tape="cream" z={5} sizes="55vw" />
      <Sticker name="lily-wine" w={13} right={-3} y={88} r={18} z={7} />

      <Sticker name="torn-news-a" w={30} right={-1} y={113} z={1} />
      <PolaroidCard {...p.middle} w={19.6} x={18} y={127} r={4} tilt={{ rx: 18, ry: -10, rz: 3, z: 50 }} tape="pink" z={5} sizes="62vw" />
      <Sticker name="news-wanted" w={19} x={0.4} y={128} r={-4} z={6} />
      <TiltSticker name="rose-wine" w={12} x={4} y={147} r={-6} z={6} rz={12} />

      <Sticker f="alarm_clock" w={7} x={1.2} y={160} r={-10} z={6} />
      <PolaroidCard {...p.big} w={26} x={6} y={165} r={-2.5} tilt={{ rx: 18, rz: -3, z: 60 }} tape="red" z={4} sizes="76vw" />
      <Butterfly tone="cherry" w={9} right={1.6} y={157} r={16} z={7} />

      <Sticker name="torn-leather-b" w={35} right={-1} bottom={-1} z={1} />
      <PolaroidCard {...p.bottomLeft} w={16} x={1.4} y={196} r={-6} tilt={{ rx: 16, ry: 12, rz: -5, z: 40 }} tape="kraft" z={5} sizes="48vw" />
      <PolaroidCard {...p.bottomRight} w={15.6} x={21.4} y={194} r={5} tilt={{ rx: 16, ry: -12, rz: 5, z: 40 }} tape="cream" z={5} sizes="46vw" />
      <Sticker name="ticket" w={18} x={18.6} bottom={2.4} r={-5} z={6} />
      <Sticker f="kiss_mark" w={6.4} x={1.2} bottom={1.6} r={-10} z={6} />
      <p className="absolute font-hand font-bold" style={{ left: '1.4rem', bottom: '8.2rem', width: '15.6rem', fontSize: '2.2rem', lineHeight: 1.08, color: '#fff1d8', textShadow: '0 0.15rem 0.5rem rgb(40 4 12 / 0.9)', zIndex: 6 }}>{copy.note}</p>
    </ScrapbookSection>
  )
}
