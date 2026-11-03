import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cover, questions } from './data/content'
import { art, clamp, preload, preloadPhotos, sticker } from './lib/assets'
import { clearWhiteout } from './lib/flash'
import { FxLayer } from './components/Particles'
import { bearImages } from './scenes/DancingCharacter'
import { OpeningScene } from './scenes/OpeningScene'
import { QuestionScene } from './scenes/QuestionScene'
import { GiftBox } from './scenes/GiftBox'

const storyChunk = () => import('./scenes/PhotoGallery')
const PhotoGallery = lazy(storyChunk)

const OPENED_KEY = 'little-surprise-opened'
const remember = {
  get() {
    try {
      return localStorage.getItem(OPENED_KEY) === '1'
    } catch {
      return false
    }
  },
  set() {
    try {
      localStorage.setItem(OPENED_KEY, '1')
    } catch {
      /* private window: she simply sees the intro again */
    }
  },
}

const FIRST_ASSETS = [
  ...bearImages,
  art('tex/burgundy'),
  art('tex/gingham-pink'),
  art('tex/gingham-red'),
  art('gloss-red'),
  art('gloss-pink'),
  art('card-long'),
  art('card-wide'),
  art('pearls'),
  art('rose-red'),
  art('bow-pink'),
  art('bow-cherry'),
  art('tulips-pink'),
  art('edge-a-body'),
  art('edge-a-rim'),
  art('edge-a-shadow'),
  art('lily-red'),
]

// Everything the first seconds of the scrapbook need, fetched while she is busy with the gift.
const STORY_ASSETS = [art('tex/wine-leather'), art('tex/cream'), art('tex/leather'), art('tex/burgundy'), art('tape-pink'), art('bow-pink'), sticker('sparkling_heart')]

function Loader({ progress }) {
  return (
    <motion.div
      className="bg-burgundy fixed-col flex flex-col items-center justify-center"
      style={{ zIndex: 60, gap: '2.4rem' }}
      exit={{ y: '-105%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div
        className="polaroid"
        style={{ width: '20rem', padding: '1.2rem 1.2rem 4.6rem' }}
        initial={{ rotate: -5, y: 16 }}
        animate={{ rotate: 2, y: -6 }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: 1, background: '#57131f' }}>
          <img src={art('gloss-pink')} alt="" className="absolute" style={{ inset: '16%', width: '68%' }} />
          <div className="absolute inset-0" style={{ background: '#e9e2cf', opacity: 1 - progress }} />
        </div>
        <span className="absolute inset-x-0 text-center font-lcd" style={{ bottom: '1.1rem', fontSize: '3rem', color: '#a71930' }}>
          {Math.round(progress * 100)}%
        </span>
      </motion.div>
      <p className="font-pen" style={{ fontSize: '1.7rem', color: '#ffe0ea' }}>developing your surprise…</p>
    </motion.div>
  )
}

export default function App() {
  const skip = new URLSearchParams(location.search).has('skip')
  const [phase, setPhase] = useState(skip ? 'story' : 'loading') // loading, opening, q0, q1, gift, story
  const [progress, setProgress] = useState(0)
  const [loaderDone, setLoaderDone] = useState(skip)
  const [storyMounted, setStoryMounted] = useState(skip)
  const warmed = useRef(false)
  const returning = useRef(remember.get())

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (skip) return
    let done = 0
    const started = performance.now()
    const fonts = document.fonts?.load ? Promise.all(["700 20px Caveat", "400 16px 'Homemade Apple'"].map((f) => document.fonts.load(f))) : Promise.resolve()
    const total = FIRST_ASSETS.length + 1
    const tick = () => {
      done += 1
      setProgress(clamp(done / total))
    }
    Promise.all([preload(FIRST_ASSETS, tick), fonts.then(tick, tick)]).then(() => {
      // Long enough to read as a little ritual, never long enough to annoy
      const rest = Math.max(0, 1500 - (performance.now() - started))
      setTimeout(() => {
        setLoaderDone(true)
        setPhase('opening')
      }, rest)
    })
    storyChunk()
  }, [skip])

  const warm = useCallback(() => {
    if (warmed.current) return
    warmed.current = true
    storyChunk()
    preload(STORY_ASSETS)
    preloadPhotos([cover.photo, cover.insidePhoto], 720)
  }, [])

  const openStory = useCallback(() => {
    remember.set()
    setStoryMounted(true)
    setPhase('story')
    window.scrollTo(0, 0)
    Promise.all([storyChunk(), preloadPhotos([cover.photo], 720)]).then(() => setTimeout(() => clearWhiteout(1100), 160))
  }, [])

  const skipIntro = useCallback(() => {
    setStoryMounted(true)
    setPhase('story')
  }, [])

  // Between scenes the page stays still; the scrapbook only starts scrolling once it is open
  useEffect(() => {
    document.documentElement.style.overflow = phase === 'story' ? '' : 'hidden'
    document.body.style.overflow = phase === 'story' ? '' : 'hidden'
  }, [phase])

  const flip = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.42 } },
  }

  return (
    <>
      <FxLayer />
      <AnimatePresence>{!loaderDone && <Loader key="loader" progress={progress} />}</AnimatePresence>

      {phase !== 'story' && phase !== 'loading' && (
        <div className="fixed-col" style={{ zIndex: 50 }}>
          <AnimatePresence initial={false}>
            {phase === 'opening' && (
              <motion.div key="opening" className="absolute inset-0" {...flip}>
                <OpeningScene returning={returning.current} onSkip={skipIntro} onContinue={() => setPhase('q0')} />
              </motion.div>
            )}
            {phase === 'q0' && (
              <motion.div key="q0" className="absolute inset-0" {...flip}>
                <QuestionScene index={0} question={questions[0]} onYes={() => setPhase('q1')} />
              </motion.div>
            )}
            {phase === 'q1' && (
              <motion.div key="q1" className="absolute inset-0" {...flip}>
                <QuestionScene index={1} question={questions[1]} onYes={() => setPhase('gift')} />
              </motion.div>
            )}
            {phase === 'gift' && (
              <motion.div key="gift" className="absolute inset-0" {...flip}>
                <GiftBox onWarm={warm} onOpened={openStory} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {storyMounted && (
        <Suspense fallback={<div className="bg-burgundy fixed inset-0" />}>
          <PhotoGallery />
        </Suspense>
      )}
    </>
  )
}
