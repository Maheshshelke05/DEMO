import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, easeInOut, motion, useMotionValueEvent, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from 'lucide-react'
import { camera as copy } from '../data/content'
import { clamp, photo, preloadPhotos } from '../lib/assets'
import { burst, flash } from '../lib/flash'
import { pop, shutter as shutterSound } from '../lib/sound'
import { Pinned } from '../components/Pinned'
import { PolaroidCard } from '../components/PolaroidCard'
import { ScrapbookSection } from '../components/ScrapbookSection'
import { FloatingDecor } from '../components/FloatingDecor'
import { Sticker, Tape } from '../components/Sticker'
import './camera.css'

const s = (n) => `calc(var(--s) * ${n})`
const unit = () => Math.min(parseFloat(getComputedStyle(document.documentElement).fontSize), innerHeight / 66)

function LensRing({ size, z, bg, shadow, children }) {
  return (
    <div
      className="cam-ring"
      style={{ width: `${size}em`, height: `${size}em`, marginLeft: `${-size / 2}em`, marginTop: `${-size / 2}em`, transform: `translateZ(${z}em)`, background: bg, boxShadow: shadow, transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

const METAL = 'conic-gradient(from 30deg, #fbfbfb, #a9abb0 14%, #f1f2f3 28%, #84878c 44%, #f5f5f6 58%, #9ea0a5 74%, #e9eaec 88%, #fbfbfb)'

function Lens() {
  return (
    <div className="absolute" style={{ left: '20.4em', top: '11.6em', width: 0, height: 0, transformStyle: 'preserve-3d' }}>
      <LensRing size={16.4} z={2.25} bg={METAL} shadow="0 0.3em 0.7em rgb(30 2 8 / 0.6)" />
      <LensRing size={14} z={3} bg="linear-gradient(160deg,#3a3a42,#101014)" />
      <LensRing size={13} z={3.8} bg={METAL} />
      <LensRing size={11.4} z={4.6} bg="linear-gradient(180deg,#22222a,#050507)">
        <svg viewBox="0 0 100 100" className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
          <defs><path id="lensText" d="M50 50 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
          <text fill="#f4f0e6" fontFamily="var(--font-type)" fontSize="6.6" letterSpacing="1.1"><textPath href="#lensText">LOVE LENS · 5.8-14.4mm · 1:∞ · ONLY FOR YOU · </textPath></text>
        </svg>
      </LensRing>
      <LensRing size={8.6} z={4.65} bg="radial-gradient(circle at 38% 32%, #6d7a9d 0%, #2b3250 22%, #0d0f1d 54%, #020207 100%)" shadow="inset 0 0 0.8em #000">
        <div className="absolute" style={{ left: '20%', top: '16%', width: '26%', height: '18%', borderRadius: '50%', background: 'rgb(255 255 255 / 0.74)', filter: 'blur(0.28em)', transform: 'rotate(-30deg)' }} />
        <div className="absolute" style={{ right: '22%', bottom: '20%', width: '12%', height: '12%', borderRadius: '50%', background: 'rgb(255 170 210 / 0.55)' }} />
        <div className="absolute" style={{ left: '36%', top: '36%', width: '28%', height: '28%', borderRadius: '50%', background: 'radial-gradient(circle, #0b0d1b, #000)' }} />
      </LensRing>
    </div>
  )
}

function CameraBody({ frame, index, total, zoom, iris, onShutter, onPrev, onNext, onZoom, onHeart, onMenu, armed, frontOn, backOn }) {
  const slabs = Array.from({ length: 17 }, (_, i) => -2 + i * 0.25)
  return (
    <>
      {slabs.map((z) => (
        <div key={z} className="cam-slab" style={{ transform: `translateZ(${z}em)` }} />
      ))}
      {/* Solid side walls, so it stays a real object when seen edge-on */}
      <div className="cam-wall" style={{ left: '-2.2em', top: '3em', width: '4.4em', height: '15em', transform: 'rotateY(90deg)' }} />
      <div className="cam-wall" style={{ left: '30.8em', top: '3em', width: '4.4em', height: '15em', transform: 'rotateY(90deg)' }} />
      <div className="cam-wall" style={{ left: '3em', top: '-2.2em', width: '27em', height: '4.4em', transform: 'rotateX(90deg)' }} />
      <div className="cam-wall" style={{ left: '3em', top: '18.8em', width: '27em', height: '4.4em', transform: 'rotateX(90deg)' }} />

      {/* Lens side, seen first */}
      <motion.div className="cam-face cam-front" style={{ visibility: frontOn }}>
        <div className="cam-flash" />
        <div className="cam-vf" />
        <div className="cam-lamp" />
        <p className="cam-word font-display" style={{ left: '2.2em', top: '8.2em', fontStyle: 'italic', fontWeight: 700, fontSize: '1.7em', lineHeight: 1 }}>{copy.brand}</p>
        <p className="cam-word font-type" style={{ left: '2.3em', top: '11.8em', fontSize: '0.96em', letterSpacing: '0.1em', lineHeight: 1.3, width: '8em' }}>{copy.tagline}</p>
      </motion.div>
      <motion.div style={{ visibility: frontOn, transformStyle: 'preserve-3d' }}>
        <Lens />
      </motion.div>

      {/* Screen side */}
      <motion.div className="cam-face cam-back" style={{ visibility: backOn, rotateY: 180, z: '-2.2em' }}>
        <button className="cam-lcd" onClick={onShutter} aria-label="Take the picture">
          <div className="cam-screen">
            <AnimatePresence initial={false}>
              <motion.img
                key={frame.photo}
                src={photo(frame.photo).src}
                srcSet={photo(frame.photo).srcSet}
                sizes="70vw"
                alt={frame.caption}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ scale: zoom }}
              />
            </AnimatePresence>
            <span className="cam-focus" style={{ left: '38%', top: '30%', borderRight: 0, borderBottom: 0 }} />
            <span className="cam-focus" style={{ right: '38%', top: '30%', borderLeft: 0, borderBottom: 0 }} />
            <span className="cam-focus" style={{ left: '38%', bottom: '30%', borderRight: 0, borderTop: 0 }} />
            <span className="cam-focus" style={{ right: '38%', bottom: '30%', borderLeft: 0, borderTop: 0 }} />
            <span className="cam-osd" style={{ left: '0.45em', top: '0.3em' }}>♥ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
            <span className="cam-osd" style={{ right: '0.45em', top: '0.3em' }}>▮▮▮ ⚡</span>
            <span className="cam-osd" style={{ right: '0.45em', bottom: '0.3em', color: '#ff9a3c', textShadow: '0 0 0.4em rgb(255 120 30 / 0.9)' }}>10/10 ♥</span>
            <span className="cam-osd" style={{ left: '0.45em', bottom: '0.3em', color: '#ffb6d5' }}>x{zoom.toFixed(1)}</span>
            <motion.div className="cam-iris" style={{ top: 0 }} animate={{ y: iris ? '0%' : '-102%' }} initial={false} transition={{ duration: iris ? 0.07 : 0.16, ease: 'easeOut' }} />
            <motion.div className="cam-iris" style={{ bottom: 0 }} animate={{ y: iris ? '0%' : '102%' }} initial={false} transition={{ duration: iris ? 0.07 : 0.16, ease: 'easeOut' }} />
            <div className="cam-glass" />
          </div>
        </button>

        <button className="cam-mini" style={{ left: '23.6em', top: '1.9em', width: '3.3em', height: '3.3em', borderRadius: '50%', color: '#a71930' }} onClick={onHeart} aria-label="Send hearts">
          <Heart size="1.7em" fill="#a71930" />
        </button>
        <button className="cam-mini" style={{ left: '27.3em', top: '1.9em', width: '2.1em', height: '3.3em', borderRadius: '1em 0.2em 0.2em 1em', fontSize: '1em' }} onClick={() => onZoom(-1)} aria-label="Zoom out">W</button>
        <button className="cam-mini" style={{ left: '29.5em', top: '1.9em', width: '2.1em', height: '3.3em', borderRadius: '0.2em 1em 1em 0.2em', fontSize: '1em' }} onClick={() => onZoom(1)} aria-label="Zoom in">T</button>
        <div className="cam-dial">
          <button style={{ left: 0, top: '2.6em', width: '2.6em', height: '3em' }} onClick={onPrev} aria-label="Previous picture"><ChevronLeft size="1.7em" strokeWidth={3} /></button>
          <button style={{ right: 0, top: '2.6em', width: '2.6em', height: '3em' }} onClick={onNext} aria-label="Next picture"><ChevronRight size="1.7em" strokeWidth={3} /></button>
          <button style={{ left: '2.6em', top: 0, width: '3em', height: '2.6em' }} onClick={() => onZoom(1)} aria-label="Zoom in"><Plus size="1.5em" strokeWidth={3} /></button>
          <button style={{ left: '2.6em', bottom: 0, width: '3em', height: '2.6em' }} onClick={() => onZoom(-1)} aria-label="Zoom out"><Minus size="1.5em" strokeWidth={3} /></button>
          <button className="cam-ok" onClick={onShutter} aria-label="Take the picture">OK</button>
        </div>
        <button className="cam-mini" style={{ left: '23.8em', top: '15.5em', width: '7.6em', height: '2.5em', borderRadius: '1.25em', fontSize: '1em' }} onClick={onMenu}>
          <span style={{ fontSize: '1.05em', letterSpacing: '0.12em' }}>MENU</span>
        </button>
        <p className="cam-word font-display" style={{ left: '1.5em', top: '12.72em', fontStyle: 'italic', fontWeight: 700, fontSize: '1.4em', lineHeight: 1 }}>{copy.brand}</p>

        <button className="cam-shutter" onClick={onShutter} aria-label="Shutter button: take the picture">
          {armed && <span className="cam-pulse" />}
        </button>
      </motion.div>
    </>
  )
}

function AroundPrint({ p, item, i, dx, dy, r, w, tape }) {
  const a = 0.4 + i * 0.022
  const b = a + 0.26
  const transform = useTransform(p, (v) => {
    const t0 = clamp((v - a) / (b - a))
    const t = 1 - Math.pow(1 - t0, 3)
    return `translate3d(calc(var(--s) * ${((1 - t) * -dx).toFixed(2)}), calc(var(--s) * ${((1 - t) * -dy).toFixed(2)}), calc(var(--s) * ${((1 - t) * -32).toFixed(2)})) rotate(${(r * t + (1 - t) * r * -1.6).toFixed(2)}deg) scale(${(0.5 + 0.5 * t).toFixed(3)})`
  })
  const opacity = useTransform(p, [a, a + 0.05], [0, 1])
  return (
    <motion.div className="absolute" style={{ left: s(dx - w / 2), top: s(dy), transform, opacity, width: s(w), zIndex: 2 }}>
      <PolaroidCard photo={item.photo} caption={item.caption} w={w} unit="s" tape={tape} date sizes="42vw" eager />
    </motion.div>
  )
}

const AROUND_POS = [
  { dx: -11.7, dy: -31.4, r: -8, w: 13.4, tape: 'kraft' },
  { dx: 0.4, dy: -32.6, r: 3, w: 13.4, tape: 'pink' },
  { dx: 12.2, dy: -30.6, r: 9, w: 13.4, tape: 'kraft' },
  { dx: -12, dy: 13.8, r: 7, w: 13.4, tape: 'cream' },
  { dx: 0.5, dy: 15.2, r: -4, w: 13.4, tape: 'red' },
  { dx: 12.3, dy: 13.2, r: -8, w: 13.4, tape: 'cream' },
]

function Stage({ p }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [iris, setIris] = useState(false)
  const [note, setNote] = useState(null)
  const [prints, setPrints] = useState([])
  const [shots, setShots] = useState(0)
  const [armed, setArmed] = useState(false)
  const noteTimer = useRef(null)
  const printId = useRef(0)
  const roll = copy.roll

  useEffect(() => {
    preloadPhotos(roll.slice(0, 6).map((r) => r.photo), 720)
  }, [roll])

  useMotionValueEvent(p, 'change', (v) => setArmed((was) => (v > 0.6 ? true : v < 0.5 ? false : was)))

  const rotateY = useTransform(p, [0, 0.56], [-28, 180], { ease: easeInOut })
  const frontOn = useTransform(rotateY, (a) => (a < 90 ? 'visible' : 'hidden'))
  const backOn = useTransform(rotateY, (a) => (a < 90 ? 'hidden' : 'visible'))
  const rotateX = useTransform(p, [0, 0.3, 0.56], [12, -7, 0])
  const rotateZ = useTransform(p, [0, 0.3, 0.56], [-5, 4, 0])
  const scale = useTransform(p, [0, 0.14, 0.56], [0.72, 1.02, 1])
  const lift = useTransform(p, [0, 0.14], ['6%', '0%'])
  const titleOpacity = useTransform(p, [0, 0.02, 0.26, 0.36], [1, 1, 1, 0])
  const titleY = useTransform(p, [0, 0.36], [0, -30])
  const decor = useTransform(p, [0.46, 0.72], [0, 1])

  const say = useCallback((text, ms = 2800) => {
    clearTimeout(noteTimer.current)
    setNote(text)
    noteTimer.current = setTimeout(() => setNote(null), ms)
  }, [])

  const click = useCallback(() => {
    const frame = roll[index]
    shutterSound()
    setIris(true)
    setTimeout(() => setIris(false), 130)
    flash({ peak: 0.9, duration: 420 })
    const px = unit()
    const id = ++printId.current
    setPrints((list) => {
      const slot = id % 3
      const next = [
        ...list,
        {
          id,
          photo: frame.photo,
          caption: frame.caption,
          x: (slot === 0 ? -12 : slot === 1 ? 0.6 : 11.8) + ((id * 37) % 7) - 3,
          y: 13.4 + ((id * 13) % 5),
          r: ((id * 47) % 25) - 12,
          px,
        },
      ]
      return next.slice(-6)
    })
    setShots((n) => n + 1)
    setZoom(1)
    const nextIndex = (index + 1) % roll.length
    setTimeout(() => setIndex(nextIndex), 180)
    preloadPhotos([roll[(nextIndex + 1) % roll.length].photo], 720)
    say(nextIndex === 0 ? copy.finished : frame.note, nextIndex === 0 ? 4200 : 2800)
  }, [index, roll, say])

  const browse = (d) => {
    pop(0.9)
    setZoom(1)
    setIndex((i) => (i + d + roll.length) % roll.length)
  }
  const zoomBy = (d) => {
    pop(d > 0 ? 1.1 : 0.85)
    setZoom((z) => clamp(+(z + d * 0.3).toFixed(1), 1, 2.2))
  }
  const hearts = (e) => {
    pop(1.3)
    burst(e.clientX, e.clientY, 22, { power: 0.9 })
    say(copy.heartReply, 1600)
  }
  const menu = () => {
    pop(1)
    say(copy.menuReply, 2400)
  }

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 40% at 50% 50%, rgb(255 110 150 / 0.3), transparent 72%)' }} />
      <FloatingDecor hearts={5} sparkles={7} seed={9} />

      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: decor }}>
        <Sticker f="teddy_bear" w={9} x={-0.8} y={0.6} r={-14} unit="s" z={4} />
        <Sticker name="rose-red" w={10} right={-1.8} y={-1} r={18} unit="s" z={4} />
        <Sticker name="tulips-pink" w={8} right={-2.6} bottom={-2.4} r={8} unit="s" z={1} />
        <Sticker f="kiss_mark" w={5.4} x={-0.8} bottom={-0.8} r={-12} unit="s" z={1} />
      </motion.div>

      <motion.div className="absolute inset-x-0 text-center" style={{ top: '11%', opacity: titleOpacity, y: titleY, zIndex: 5 }}>
        <h2 className="font-display" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: s(5.2), lineHeight: 1.04, color: '#ffe0ea', textShadow: '0 0.3rem 1.4rem rgb(20 2 8 / 0.7)' }}>{copy.title}</h2>
      </motion.div>

      <div className="absolute" style={{ left: '50%', top: '50%', width: 0, height: 0 }}>
        {copy.around.map((item, i) => (
          <AroundPrint key={item.photo} p={p} item={item} i={i} {...AROUND_POS[i]} />
        ))}
      </div>

      <div className="absolute inset-0" style={{ perspective: s(95), zIndex: 3 }}>
        <motion.div className="cam" style={{ rotateY, rotateX, rotateZ, scale, y: lift }}>
          <CameraBody
            frame={roll[index]}
            index={index}
            total={roll.length}
            zoom={zoom}
            iris={iris}
            armed={armed && shots === 0}
            onShutter={click}
            onPrev={() => browse(-1)}
            onNext={() => browse(1)}
            onZoom={zoomBy}
            onHeart={hearts}
            onMenu={menu}
            frontOn={frontOn}
            backOn={backOn}
          />
        </motion.div>
      </div>

      {/* Fresh prints fly out of the camera and land around it */}
      <div className="pointer-events-none absolute" style={{ left: '50%', top: '50%', width: 0, height: 0, zIndex: 6 }}>
        <AnimatePresence>
          {prints.map((pr) => (
            <motion.div
              key={pr.id}
              className="absolute"
              style={{ left: s(-6.7), top: 0, width: s(13.4) }}
              initial={{ x: 0, y: -pr.px * 5, scale: 0.4, rotate: 0, opacity: 0 }}
              animate={{ x: pr.x * pr.px, y: pr.y * pr.px, scale: 1, rotate: pr.r, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', stiffness: 88, damping: 14, delay: 0.18, opacity: { duration: 0.12, delay: 0.18 } }}
            >
              <PolaroidCard photo={pr.photo} caption={pr.caption} w={13.4} unit="s" date sizes="42vw" eager />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Her cute little reply */}
      <div className="pointer-events-none absolute inset-x-0 flex justify-center" style={{ top: `calc(50% - ${s(19.5)})`, zIndex: 8, padding: `0 ${s(2)}` }}>
        <AnimatePresence mode="wait">
          {note && (
            <motion.p
              key={note}
              className="relative text-center font-hand font-bold"
              style={{ fontSize: s(2.55), lineHeight: 1.08, color: '#57131f', background: '#fff1d8', padding: `${s(0.9)} ${s(1.8)}`, borderRadius: s(0.5), boxShadow: `0 ${s(0.5)} ${s(1.3)} rgb(20 2 8 / 0.5)` }}
              initial={{ opacity: 0, scale: 0.6, rotate: -7, y: 16 }}
              animate={{ opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.16 } }}
              transition={{ type: 'spring', stiffness: 310, damping: 17 }}
            >
              {note}
              <Tape kind="pink" w={6.5} x={1} y={-1} r={-5} unit="s" />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {armed && shots === 0 && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 flex justify-center"
            style={{ top: `calc(50% - ${s(16.9)})`, zIndex: 7 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.15 }}
          >
            <span className="font-hand font-bold" style={{ fontSize: s(2.35), color: '#6e0d20', background: '#ffb6d5', padding: `${s(0.45)} ${s(1.5)}`, borderRadius: s(2), boxShadow: `0 ${s(0.4)} ${s(1)} rgb(20 2 8 / 0.5)`, marginLeft: s(9) }}>{copy.hint} ↓</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CameraScene() {
  return (
    <ScrapbookSection bg="bg-burgundy" edge="a" z={2} label="A retro digital camera full of her pictures">
      <Pinned vh={330}>{(p) => <Stage p={p} />}</Pinned>
    </ScrapbookSection>
  )
}
