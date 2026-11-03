import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { art } from '../lib/assets'
import { burst } from '../lib/flash'
import { pop, unlock } from '../lib/sound'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker, Tape } from '../components/Sticker'
import { Butterfly } from '../components/Butterfly'

const s = (n) => `calc(var(--s) * ${n})`

const LOOKS = [
  {
    bg: 'bg-gingham-pink',
    wash: 'radial-gradient(ellipse at 50% 45%, rgb(255 255 255 / 0.55), rgb(242 139 174 / 0.28) 80%)',
    butterfly: 'pink',
    decor: (
      <>
        <Sticker name="bow-pink" w={15} x={-2.4} y={1.8} r={-14} unit="s" eager />
        <Sticker name="thumb-heart" w={11} right={1.6} y={3.2} r={10} unit="s" eager />
        <Sticker name="tulips-rose" w={14} right={-1.4} bottom={-1} r={8} unit="s" eager />
        <Sticker f="cherries" w={8} x={1.8} bottom={3} r={-10} unit="s" eager />
      </>
    ),
  },
  {
    bg: 'bg-gingham-red',
    wash: 'radial-gradient(ellipse at 50% 46%, rgb(87 19 31 / 0.04), rgb(87 19 31 / 0.34) 100%)',
    butterfly: 'cherry',
    decor: (
      <>
        <Sticker name="rose-wine" w={15} x={-3} y={0.8} r={-8} unit="s" eager />
        <Sticker name="lily-red" w={15} right={-3.4} y={4} r={18} unit="s" eager />
        <Sticker name="minicam" w={13} x={1} bottom={3} r={-9} unit="s" eager />
        <Sticker name="bow-cherry" w={12} right={0.6} bottom={2.4} r={11} unit="s" eager />
      </>
    ),
  },
]

// One animated question. NO never blocks anything: it only makes YES more tempting.
export function QuestionScene({ index, question, onYes }) {
  const look = LOOKS[index % LOOKS.length]
  const [reply, setReply] = useState(null)
  const [noCount, setNoCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [shake, setShake] = useState(0)
  const yesRef = useRef(null)

  const pressNo = () => {
    unlock()
    pop(0.72)
    setReply(question.noReplies[noCount % question.noReplies.length])
    setNoCount((n) => n + 1)
    setShake((n) => n + 1)
  }

  const pressYes = () => {
    if (leaving) return
    unlock()
    pop(1.25)
    const r = yesRef.current.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top + r.height / 2, 34, { power: 1.15 })
    setReply(question.yesReply)
    setLeaving(true)
    setTimeout(onYes, 720)
  }

  const yesScale = 1 + Math.min(noCount, 4) * 0.09
  const noScale = Math.max(0.74, 1 - Math.min(noCount, 4) * 0.07)
  const noX = noCount === 0 ? 0 : ((noCount * 37) % 11) - 5
  const noY = noCount === 0 ? 0 : ((noCount * 53) % 3) - 0.6

  return (
    <div className={`${look.bg} absolute inset-0 overflow-hidden`} style={{ perspective: '110rem' }}>
      <div className="absolute inset-0" style={{ background: look.wash }} />
      <FloatingDecor hearts={6} sparkles={5} seed={11 + index} />
      {look.decor}
      <Butterfly tone={look.butterfly} w={8.5} x={15.4} y={5} r={18} unit="s" />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: `0 ${s(2)}` }}>
        <motion.div
          className="relative"
          style={{ width: s(35), height: s(33.4), transformStyle: 'preserve-3d' }}
          initial={{ rotateY: index % 2 ? 75 : -75, rotateX: 8, z: -240, opacity: 0 }}
          animate={
            leaving
              ? { rotateY: index % 2 ? -80 : 80, z: -260, opacity: 0, transition: { duration: 0.5, delay: 0.26, ease: [0.5, 0, 0.8, 0.4] } }
              : { rotateY: 0, rotateX: 0, z: 0, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 88, damping: 15 }}
        >
          <img src={art('card-wide')} alt="" className="absolute inset-0 h-full w-full" />
          <Tape kind={index ? 'red' : 'pink'} w={11} x={12} y={-0.7} r={2} unit="s" />
          <Sticker f={index ? 'love_letter' : 'heart_with_ribbon'} w={6.6} x={14.2} y={1.6} unit="s" className="wiggle" eager />
          <motion.h2
            key={shake}
            className="absolute flex items-center justify-center text-center font-hand font-bold"
            style={{ left: s(3), right: s(3), top: s(8.2), height: s(14.6), fontSize: s(4.4), lineHeight: 1.02, color: '#57131f' }}
            animate={shake ? { x: [0, -10, 9, -6, 4, 0] } : {}}
            transition={{ duration: 0.45 }}
          >
            {question.text}
          </motion.h2>
          <div className="absolute flex items-center justify-center" style={{ left: 0, right: 0, top: s(22.8), height: s(8), gap: s(2.2) }}>
            <motion.button
              ref={yesRef}
              className="pill"
              style={{ fontSize: s(3), minHeight: s(5.3), padding: `0 ${s(2.8)}` }}
              animate={{ scale: yesScale }}
              whileTap={{ scale: yesScale * 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={pressYes}
            >
              {question.yes}
            </motion.button>
            <motion.button
              className="pill pill-quiet"
              style={{ fontSize: s(3), minHeight: s(5.3), padding: `0 ${s(2.8)}` }}
              animate={{ scale: noScale, x: s(noX), y: s(noY), rotate: noCount ? noX * 1.2 : 0 }}
              whileTap={{ scale: noScale * 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 13 }}
              onClick={pressNo}
            >
              {question.no}
            </motion.button>
          </div>
        </motion.div>

        <div className="relative flex items-start justify-center" style={{ height: s(9), width: '100%', marginTop: s(1.2) }}>
          <AnimatePresence mode="wait">
            {reply && (
              <motion.p
                key={reply}
                className="text-center font-hand font-bold"
                style={{
                  fontSize: s(2.6),
                  lineHeight: 1.1,
                  color: index ? '#fff1d8' : '#6e0d20',
                  padding: `${s(0.8)} ${s(1.6)}`,
                  borderRadius: s(1.4),
                  background: index ? 'rgb(87 19 31 / 0.88)' : 'rgb(255 253 248 / 0.92)',
                  boxShadow: `0 ${s(0.4)} ${s(1)} rgb(40 6 16 / 0.28)`,
                  maxWidth: s(33),
                }}
                initial={{ opacity: 0, y: 14, scale: 0.84, rotate: -3 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
                exit={{ opacity: 0, y: -8, scale: 0.92, transition: { duration: 0.11 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {reply}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
