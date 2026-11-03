import { useEffect, useRef } from 'react'
import { art, sticker } from '../lib/assets'
import { registerTilt } from '../lib/scrollFx'
import { u } from './Sticker'

// A sticker that lifts and turns a little as it passes through the screen.
export function TiltSticker({ name, f, w, x, y, right, bottom, r = 0, z, rx = 10, ry = 0, rz = 8, depth = 30, perspective = 650 }) {
  const outer = useRef(null)
  const inner = useRef(null)
  useEffect(() => registerTilt(outer.current, inner.current, { base: r, rx, ry, rz, z: depth, perspective }), [r, rx, ry, rz, depth, perspective])
  return (
    <div ref={outer} className="pointer-events-none absolute" style={{ left: u(x), top: u(y), right: u(right), bottom: u(bottom), width: u(w), zIndex: z }}>
      <img ref={inner} src={f ? sticker(f) : art(name)} alt="" aria-hidden="true" draggable={false} loading="lazy" decoding="async" style={{ width: '100%' }} />
    </div>
  )
}
