import { motion, useTransform } from 'framer-motion'
import { ring as copy } from '../data/content'
import { Pinned, WhenNear } from '../components/Pinned'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker } from '../components/Sticker'

const s = (n) => `calc(var(--s) * ${n})`
const RADIUS = 29
const CARD = 17

function RingCard({ item, i, count, spin }) {
  const a = (360 / count) * i
  const visibility = useTransform(spin, (v) => {
    const at = (((a + v) % 360) + 360) % 360
    return at < 74 || at > 286 ? 'visible' : 'hidden'
  })
  return (
    <div className="absolute" style={{ left: s(-CARD / 2), top: s(-13), width: s(CARD), transform: `rotateY(${a}deg) translateZ(${s(RADIUS)})`, transformStyle: 'preserve-3d' }}>
      <motion.div style={{ visibility, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <PolaroidCard photo={item.photo} caption={item.caption} w={CARD} unit="s" ratio={0.8} sizes="48vw" eager develop={false} />
      </motion.div>
    </div>
  )
}

function Stage({ p }) {
  const spin = useTransform(p, [0, 1], [18, -432])
  const tilt = useTransform(p, [0, 0.5, 1], [-11, -5, -11])
  const roll = useTransform(p, [0, 1], [-4, 4])
  const lift = useTransform(p, [0, 0.12], [1.05, 1])
  const titleY = useTransform(p, [0, 1], [0, -18])
  const heartSpin = useTransform(p, [0, 1], [-14, 14])
  const list = copy.photos
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 44% at 50% 56%, #fff 0%, rgb(255 224 234 / 0.4) 56%, rgb(242 139 174 / 0.42) 100%)' }} />
      <FloatingDecor hearts={6} sparkles={8} seed={17} />
      <Sticker name="bow-cherry" w={11} x={-1.2} y={1} r={-16} unit="s" />
      <Sticker name="rose-pink" w={10.5} right={-2} y={1.4} r={16} unit="s" />
      <Sticker name="tulips-pink" w={12} x={-1.4} bottom={-0.8} r={-9} unit="s" />
      <Sticker name="lily-pink" w={13} right={-2.8} bottom={-1.4} r={18} unit="s" />

      <motion.div className="absolute inset-x-0 text-center" style={{ top: `calc(50% - ${s(25.4)})`, y: titleY, zIndex: 3 }}>
        <h2 className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: s(5.2), lineHeight: 1, color: '#a71930', textShadow: '0 0.1rem 0 #fff' }}>{copy.title}</h2>
        <p className="font-hand font-bold" style={{ fontSize: s(2.1), color: '#6e0d20', marginTop: s(0.6) }}>{copy.sub}</p>
      </motion.div>

      <div className="absolute inset-0" style={{ perspective: s(92), perspectiveOrigin: '50% 42%' }}>
        <motion.div className="absolute" style={{ left: '50%', top: '54%', width: 0, height: 0, transformStyle: 'preserve-3d', rotateX: tilt, rotateZ: roll, scale: lift }}>
          <motion.div className="absolute" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', rotateY: spin }}>
            {list.map((item, i) => (
              <RingCard key={item.photo} item={item} i={i} count={list.length} spin={spin} />
            ))}
          </motion.div>
          <motion.img src={`${import.meta.env.BASE_URL}art/gloss-red.webp`} alt="" className="absolute max-w-none" style={{ width: s(11), left: s(-5.5), top: s(-6), rotate: heartSpin }} />
        </motion.div>
      </div>
    </div>
  )
}

export function PinkRing() {
  return (
    <ScrapbookSection bg="bg-blush" edge="a" z={4} label="A spinning ring of her pictures in pink">
      <Pinned vh={360}>
        {(p) => (
          <WhenNear>
            <Stage p={p} />
          </WhenNear>
        )}
      </Pinned>
    </ScrapbookSection>
  )
}
