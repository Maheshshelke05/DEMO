import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { opening as copy } from '../data/content'
import { art } from '../lib/assets'
import { pop, unlock } from '../lib/sound'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker, Tape } from '../components/Sticker'
import { DancingCharacter } from './DancingCharacter'

const s = (n) => `calc(var(--s) * ${n})`
const spring = { type: 'spring', stiffness: 170, damping: 15 }

function MusicNotes() {
  const notes = [
    { x: 12, y: 8, d: 0, n: '♪', c: '#ffb6d5' },
    { x: 70, y: 2, d: 0.8, n: '♫', c: '#ffe0ea' },
    { x: 84, y: 22, d: 1.5, n: '♪', c: '#f28bae' },
    { x: 2, y: 28, d: 2.2, n: '♥', c: '#ffb6d5' },
  ]
  return notes.map((m) => (
    <motion.span
      key={m.x}
      className="pointer-events-none absolute font-display"
      style={{ left: `${m.x}%`, top: `${m.y}%`, fontSize: s(3.4), color: m.c }}
      animate={{ y: [s(1.5), s(-3)], opacity: [0, 1, 0], rotate: [-10, 12] }}
      transition={{ duration: 1.9, repeat: Infinity, delay: m.d, ease: 'easeOut' }}
    >
      {m.n}
    </motion.span>
  ))
}

export function OpeningScene({ onContinue, returning, onSkip }) {
  const [danced, setDanced] = useState(false)
  const [tapped, setTapped] = useState(false)

  // A five second dance, then she gets asked
  useEffect(() => {
    const t = setTimeout(() => setDanced(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const go = () => {
    unlock()
    pop()
    onContinue()
  }

  return (
    <div className="bg-burgundy absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 42%, rgb(255 110 150 / 0.3), transparent 62%)' }} />
      <FloatingDecor hearts={8} sparkles={9} seed={3} />

      {/* Corner garnish */}
      <Sticker name="pearls" w={46} x={-4} y={-4.4} r={-3} unit="s" eager />
      <Sticker name="rose-red" w={13} right={-3.2} y={2.4} r={14} unit="s" eager />
      <Sticker name="gloss-red" w={7} x={2} y={21} unit="s" bob eager style={{ '--bob': '-1rem' }} />
      <Sticker name="gloss-pink" w={6} right={2.4} y={25} unit="s" bob t={6} delay={-2} eager r={12} />
      <Sticker name="gloss-pink" w={3.2} x={7.4} y={32} unit="s" bob t={4.4} delay={-1} eager r={-16} />

      {/* The floor: a torn sheet of pink gingham */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: s(21), isolation: 'isolate' }}>
        <div className="edge" aria-hidden="true" style={{ height: s(5.85) }}>
          <div className="edge-shadow" style={{ backgroundImage: `url(${art('edge-a-shadow')})` }} />
          <div className="edge-rim" style={{ WebkitMaskImage: `url(${art('edge-a-rim')})`, maskImage: `url(${art('edge-a-rim')})` }} />
          <div className="edge-body bg-gingham-pink" style={{ WebkitMaskImage: `url(${art('edge-a-body')})`, maskImage: `url(${art('edge-a-body')})` }} />
        </div>
        <div className="bg-gingham-pink absolute inset-0" />
        <Sticker name="tulips-pink" w={12.5} right={-1.6} bottom={0} r={7} unit="s" eager />
        <Sticker name="bow-cherry" w={10} x={-1.8} bottom={1.8} r={-14} unit="s" eager />
      </div>

      <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + var(--s) * 3.2)' }}>
        {/* The small invitation */}
        <motion.div
          className="relative shrink-0"
          style={{ width: s(31) }}
          initial={{ opacity: 0, y: -30, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ ...spring, delay: 0.35 }}
        >
          <img src={art('card-long')} alt="" className="w-full" />
          <p className="absolute inset-0 flex items-center justify-center text-center font-pen" style={{ fontSize: s(1.55), lineHeight: 1.7, color: '#57131f', padding: `0 ${s(3)}` }}>
            {copy.invite}
          </p>
          <Tape kind="pink" w={9} x={11} y={-1.1} r={-3} unit="s" />
        </motion.div>

        {/* The prompt, once the dance is over */}
        <div className="relative flex w-full flex-1 flex-col items-center justify-center" style={{ minHeight: 0 }}>
          <AnimatePresence>
            {danced && (
              <motion.div
                className="flex flex-col items-center"
                style={{ zIndex: 5 }}
                initial={{ scale: 0.3, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={spring}
              >
                <div
                  className="relative text-center font-hand font-bold"
                  style={{
                    width: s(32),
                    padding: `${s(1.5)} ${s(2)}`,
                    fontSize: s(3.15),
                    lineHeight: 1.08,
                    color: '#57131f',
                    borderRadius: s(2.4),
                    background: 'linear-gradient(170deg,#fffdf8,#ffe0ea)',
                    boxShadow: `0 ${s(0.7)} ${s(1.8)} rgb(30 4 12 / 0.45), 0 0 0 ${s(0.28)} #fffdf8`,
                  }}
                >
                  {copy.prompt}
                  <span
                    className="absolute"
                    style={{ left: '50%', bottom: s(-1.1), width: s(2.4), height: s(2.4), marginLeft: s(-1.2), background: '#ffe0ea', transform: 'rotate(45deg)', borderRadius: s(0.3) }}
                  />
                </div>
                <motion.button
                  className="pill"
                  style={{ marginTop: s(2.3), fontSize: s(2.9), minHeight: s(5.2), padding: `0 ${s(3)}` }}
                  onClick={go}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.28 }}
                >
                  {copy.button}
                </motion.button>
                {!tapped && (
                  <motion.span
                    className="font-hand font-bold"
                    style={{ marginTop: s(1.5), fontSize: s(1.9), color: '#ffe0ea' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 1 }}
                  >
                    {copy.hint}
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The dancer */}
        <motion.div
          className="relative shrink-0"
          style={{ marginBottom: s(1.4), zIndex: 4 }}
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          {!danced && <MusicNotes />}
          <DancingCharacter
            size={danced ? 'min(23rem, calc(var(--vh) * 0.27))' : 'min(33rem, calc(var(--vh) * 0.4))'}
            dancing={!danced}
            interactive
            onTap={() => {
              setTapped(true)
              if (danced) go()
            }}
          />
        </motion.div>
      </div>

      {returning && (
        <button
          onClick={onSkip}
          className="absolute font-type underline"
          style={{ right: s(1.4), bottom: 'calc(env(safe-area-inset-bottom) + var(--s) * 0.9)', fontSize: s(1.25), color: '#6e0d20', zIndex: 10, padding: s(0.8) }}
        >
          {copy.skip}
        </button>
      )}
    </div>
  )
}
