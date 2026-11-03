import { useEffect, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { registerPin, registerRange } from '../lib/scrollFx'

// A scene that stays on screen for a stretch of scrolling. The render function gets a 0-1 progress value.
// The pinned frame is as tall as the largest viewport, so nothing shows when the address bar slides away.
export function Pinned({ vh = 300, className = '', stageClassName = '', stageStyle, backdrop, children }) {
  const track = useRef(null)
  const pin = useRef(null)
  const progress = useMotionValue(0)

  useEffect(() => registerPin(track.current, pin.current, progress), [progress])

  return (
    <div ref={track} className={`relative ${className}`} style={{ height: `${vh}vh` }}>
      <div ref={pin} className="sticky top-0 overflow-hidden" style={{ height: '100lvh', background: backdrop }}>
        <div className={`absolute left-0 top-0 w-full ${stageClassName}`} style={{ height: 'var(--vh)', ...stageStyle }}>
          {children(progress)}
        </div>
      </div>
    </div>
  )
}

export function useRange(from = 0.92, to = 0.25) {
  const ref = useRef(null)
  const value = useMotionValue(0)
  useEffect(() => registerRange(ref.current, from, to, value), [from, to, value])
  return [ref, value]
}

// Renders children only once the scene gets close, so heavy scenes never slow down the start of the page.
export function WhenNear({ margin = '160%', minHeight, children }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [margin])
  return (
    <div ref={ref} style={{ minHeight, position: 'absolute', inset: 0 }}>
      {near ? children : null}
    </div>
  )
}
