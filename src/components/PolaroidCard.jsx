import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { photo as lookup } from '../lib/assets'
import { registerTilt } from '../lib/scrollFx'
import { Tape, u } from './Sticker'

export const LightboxContext = createContext(null)

function useRevealOnce(ref, enabled) {
  const [shown, setShown] = useState(!enabled)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '4% 0px 4% 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [enabled, ref])
  return shown
}

export function Photo({ k, sizes = '60vw', eager, alt, position, zoom }) {
  const p = lookup(k)
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={p.src}
      srcSet={p.srcSet}
      sizes={sizes}
      alt={alt ?? 'A photo of her'}
      draggable={false}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity .7s ease',
        objectPosition: position,
        transform: zoom ? `scale(${zoom})` : undefined,
      }}
    />
  )
}

// The classic white-border print. Sits flat by default, or turns in 3D with scroll when tilt is set.
export function PolaroidCard({
  photo,
  caption,
  w = 18,
  x,
  y,
  right,
  bottom,
  r = 0,
  z,
  unit = 'rem',
  tilt,
  tape,
  tapeR = -4,
  date,
  ratio,
  position,
  eager,
  develop = true,
  sizes,
  frame = 'polaroid',
  captionFont,
  origin,
  style,
  className = '',
  children,
}) {
  const open = useContext(LightboxContext)
  const outer = useRef(null)
  const inner = useRef(null)
  const shown = useRevealOnce(outer, develop)
  const p = lookup(photo)
  const windowRatio = ratio ?? p.ratio

  useEffect(() => {
    if (!tilt || !outer.current) return
    return registerTilt(outer.current, inner.current, { base: r, ...(tilt === true ? {} : tilt) })
  }, [tilt, r])

  const em = `calc(${u(w, unit)} / 10)`
  const pad = frame === 'thin' ? '0.32em 0.32em 0.32em' : frame === 'paper' ? '0.65em' : caption ? '0.5em 0.5em 0' : '0.5em 0.5em 1.75em'
  const positioned = x != null || right != null || y != null || bottom != null

  return (
    <div
      ref={outer}
      className={className}
      style={{
        position: positioned ? 'absolute' : 'relative',
        left: u(x, unit),
        right: u(right, unit),
        top: u(y, unit),
        bottom: u(bottom, unit),
        width: u(w, unit),
        zIndex: z,
        ...style,
      }}
    >
      <figure
        ref={inner}
        className="polaroid"
        onClick={open ? () => open(photo, caption) : undefined}
        role={open ? 'button' : undefined}
        tabIndex={open ? 0 : undefined}
        aria-label={open ? `Open photo${caption ? `: ${caption}` : ''}` : undefined}
        onKeyDown={open ? (e) => e.key === 'Enter' && open(photo, caption) : undefined}
        style={{
          fontSize: em,
          padding: pad,
          cursor: open ? 'pointer' : undefined,
          transform: tilt ? undefined : `rotate(${r}deg)`,
          transformOrigin: origin,
          background: frame === 'paper' ? 'transparent' : undefined,
          boxShadow: frame === 'paper' ? 'none' : undefined,
        }}
      >
        <div className="photo-window" style={{ aspectRatio: windowRatio, backgroundImage: `url(${p.blur})` }}>
          <Photo k={photo} sizes={sizes ?? `${Math.round(w * 2.8)}vw`} eager={eager} position={position} alt={caption ? `Her: ${caption}` : undefined} />
          {develop && <div className="develop" style={{ opacity: shown ? 0 : 0.62 }} />}
          <div className="gloss" />
          {date && <span className="datestamp" style={{ fontSize: '1.15em' }}>10/10 ♥</span>}
        </div>
        {caption && frame === 'polaroid' && (
          <figcaption
            className="text-center"
            style={{
              fontFamily: captionFont ?? 'var(--font-hand)',
              fontWeight: 700,
              color: '#57131f',
              fontSize: `clamp(${u(1.5, unit)}, 1.16em, ${u(2.5, unit)})`,
              lineHeight: 1.04,
              padding: '0.34em 0.2em 0.42em',
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
      {tape && <Tape kind={tape} w={w * 0.46} unit={unit} x={w * 0.27} y={-w * 0.035} r={tapeR} />}
      {children}
    </div>
  )
}
