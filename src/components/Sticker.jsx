import { art, sticker } from '../lib/assets'

// Lengths in the collage are given in rem, or in the height-safe --s unit inside pinned stages.
export const u = (n, unit = 'rem') => (n == null ? undefined : unit === 's' ? `calc(var(--s) * ${n})` : `${n}rem`)

export function Sticker({ name, f, w, x, y, right, bottom, r = 0, z, unit = 'rem', bob, wiggle, t, delay, eager, className = '', style }) {
  const src = f ? sticker(f) : art(name)
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`pointer-events-none ${bob ? 'bob' : ''} ${wiggle ? 'wiggle' : ''} ${className}`}
      style={{
        position: 'absolute',
        width: u(w, unit),
        left: u(x, unit),
        top: u(y, unit),
        right: u(right, unit),
        bottom: u(bottom, unit),
        zIndex: z,
        transform: `rotate(${r}deg)`,
        '--rot': `${r}deg`,
        '--t': t ? `${t}s` : undefined,
        '--delay': delay ? `${delay}s` : undefined,
        ...style,
      }}
    />
  )
}

export function Tape({ kind = 'kraft', w = 10, x, y, right, r = 0, unit = 'rem', z = 6 }) {
  return <Sticker name={`tape-${kind}`} w={w} x={x} y={y} right={right} r={r} unit={unit} z={z} />
}
