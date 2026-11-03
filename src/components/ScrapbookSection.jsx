import { useEffect, useRef } from 'react'
import { art } from '../lib/assets'
import { registerSheet } from '../lib/scrollFx'

function TornEdge({ kind, bg }) {
  const mask = (n) => {
    const url = `url(${art(`edge-${kind}-${n}`)})`
    return { WebkitMaskImage: url, maskImage: url }
  }
  return (
    <div className="edge" aria-hidden="true">
      <div className="edge-shadow" style={{ backgroundImage: `url(${art(`edge-${kind}-shadow`)})` }} />
      <div className="edge-rim" style={mask('rim')} />
      <div className={`edge-body ${bg}`} style={mask('body')} />
    </div>
  )
}

// One page of the scrapbook. Its top edge is torn paper, it slides over the page before it,
// and when the next page arrives it bends back into the distance.
export function ScrapbookSection({ bg = 'bg-cream', edge = 'a', z = 1, id, height, label, className = '', children }) {
  const sheet = useRef(null)
  const inner = useRef(null)
  const dim = useRef(null)

  useEffect(() => {
    const ro = new ResizeObserver(() => sheet.current?.style.setProperty('--h', `${inner.current.offsetHeight}px`))
    ro.observe(inner.current)
    const off = registerSheet(sheet.current, inner.current, dim.current)
    return () => {
      ro.disconnect()
      off()
    }
  }, [])

  return (
    <section ref={sheet} id={id} className="sheet" style={{ zIndex: z }} aria-label={label}>
      <div ref={inner} className={`sheet-inner ${bg} ${className}`} style={{ height: height ? `${height}rem` : undefined }}>
        {edge && <TornEdge kind={edge} bg={bg} />}
        {children}
        <div ref={dim} className="sheet-dim" />
      </div>
    </section>
  )
}
