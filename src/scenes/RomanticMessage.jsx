import { motion, useTransform } from 'framer-motion'
import { messages } from '../data/content'
import { Pinned } from '../components/Pinned'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'

const s = (n) => `calc(var(--s) * ${n})`

// Words appear as she scrolls, as if someone were writing them while she watches.
function Word({ p, from, to, children }) {
  const opacity = useTransform(p, [from, to], [0.12, 1])
  const y = useTransform(p, [from, to], [14, 0])
  const rotateX = useTransform(p, [from, to], [-46, 0])
  return (
    <motion.span className="inline-block" style={{ opacity, y, rotateX, marginRight: '0.28em', transformOrigin: '50% 100%' }}>
      {children}
    </motion.span>
  )
}

export function RomanticMessage({ text = messages.third, bg = 'bg-leather', edge = 'a', z = 11, signed = 'still, always, you' }) {
  const words = text.split(' ')
  return (
    <ScrapbookSection bg={bg} edge={edge} z={z} label="A love note">
      <Pinned vh={190}>
        {(p) => (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ perspective: s(70), padding: `0 ${s(2.6)}` }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 46%, rgb(255 150 185 / 0.42), transparent 66%)' }} />
            <FloatingDecor hearts={8} sparkles={9} seed={41} />
            <Sticker name="pearls" w={48} x={-5} y={-3.6} r={-3} unit="s" />
            <Sticker name="rose-red" w={12} x={-2.4} bottom={-1} r={-16} unit="s" />
            <Sticker name="lily-pink" w={13} right={-3} bottom={3} r={18} unit="s" />
            <Butterfly tone="pink" w={8.5} right={2} y={9} r={18} unit="s" />
            <p className="relative text-center font-hand font-bold" style={{ fontSize: s(5.1), lineHeight: 1.08, color: '#fff1d8', textShadow: '0 0.3rem 1.2rem rgb(40 2 10 / 0.7)' }}>
              {words.map((w, i) => (
                <Word key={i} p={p} from={0.05 + (i / words.length) * 0.62} to={0.11 + (i / words.length) * 0.62}>
                  {w}
                </Word>
              ))}
            </p>
            <motion.p className="relative font-pen" style={{ fontSize: s(1.6), color: '#ffe0ea', marginTop: s(2.6), opacity: useTransform(p, [0.72, 0.84], [0, 1]) }}>
              {signed}
            </motion.p>
          </div>
        )}
      </Pinned>
    </ScrapbookSection>
  )
}
