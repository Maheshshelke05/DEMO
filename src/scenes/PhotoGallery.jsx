import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { LightboxContext } from '../components/PolaroidCard'
import { Lightbox } from '../components/Lightbox'
import { SoundToggle } from '../components/SoundToggle'
import { pop } from '../lib/sound'
import { CoverBook } from './CoverBook'
import { CameraScene } from './CameraScene'
import { PinkDiary } from './PinkDiary'
import { PinkRing } from './PinkRing'
import { MemoryTunnel } from './MemoryTunnel'
import { CherryPage } from './CherryPage'
import { CreamJournal } from './CreamJournal'
import { BluePage } from './BluePage'
import { SunshinePage } from './SunshinePage'
import { RomanticMessage } from './RomanticMessage'
import { FinalSurprise } from './FinalSurprise'

function ScrollHeart() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - innerHeight
      const p = h > 0 ? Math.min(1, scrollY / h) : 0
      if (ref.current) ref.current.style.transform = `translate3d(0, ${(p * 100).toFixed(2)}%, 0)`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <div className="pointer-events-none fixed" style={{ top: '6rem', bottom: '3rem', right: 'calc(50% - var(--col) / 2 + 0.34rem)', width: '0.26rem', zIndex: 65, background: 'rgb(255 224 234 / 0.28)', borderRadius: '1rem' }} aria-hidden="true">
      <div ref={ref} className="absolute inset-x-0 top-0" style={{ height: '100%' }}>
        <span className="absolute grid place-items-center" style={{ left: '50%', top: 0, width: '1.8rem', height: '1.8rem', marginLeft: '-0.9rem', marginTop: '-0.9rem', fontSize: '1.4rem', lineHeight: 1, filter: 'drop-shadow(0 0.1rem 0.2rem rgb(40 4 12 / 0.7))' }}>💗</span>
      </div>
    </div>
  )
}

// The whole scrapbook, in reading order. Each page keeps its own look; the colours alternate on purpose.
export default function PhotoGallery() {
  const [box, setBox] = useState(null)
  const lenis = useRef(null)

  useEffect(() => {
    const l = new Lenis({ smoothWheel: true, lerp: 0.085, wheelMultiplier: 0.9 })
    lenis.current = l
    let id
    const raf = (t) => {
      l.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      l.destroy()
    }
  }, [])

  const open = useCallback((key, caption) => {
    pop(1.1)
    lenis.current?.stop()
    document.documentElement.style.overflow = 'hidden'
    setBox({ key, caption })
  }, [])

  const close = useCallback(() => {
    lenis.current?.start()
    document.documentElement.style.overflow = ''
    setBox(null)
  }, [])

  return (
    <LightboxContext.Provider value={open}>
      <main className="col">
        <CoverBook />
        <CameraScene />
        <PinkDiary />
        <PinkRing />
        <MemoryTunnel />
        <CherryPage />
        <CreamJournal />
        <BluePage />
        <SunshinePage />
        <RomanticMessage />
        <FinalSurprise />
      </main>
      <ScrollHeart />
      <SoundToggle />
      <Lightbox item={box} onClose={close} />
    </LightboxContext.Provider>
  )
}
