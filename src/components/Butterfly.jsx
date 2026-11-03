import { art } from '../lib/assets'
import { u } from './Sticker'

// A paper butterfly with two real wings hinged on its body in CSS 3D.
export function Butterfly({ tone = 'pink', w = 8, x, y, right, bottom, r = 0, speed = 0.46, unit = 'rem', z, style, className = '' }) {
  const wing = art(`wing-${tone}`)
  const size = u(w, unit)
  return (
    <div
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        position: x != null || right != null ? 'absolute' : 'relative',
        left: u(x, unit),
        top: u(y, unit),
        right: u(right, unit),
        bottom: u(bottom, unit),
        width: size,
        height: `calc(${size} * 1.2)`,
        zIndex: z,
        transform: `rotate(${r}deg) rotateX(28deg)`,
        transformStyle: 'preserve-3d',
        perspective: '40rem',
        ...style,
      }}
    >
      <img
        src={wing}
        alt=""
        className="absolute"
        style={{
          left: '50%',
          top: 0,
          width: '50%',
          marginLeft: '-1%',
          transformOrigin: '0 50%',
          animation: `flutterR ${speed}s ease-in-out infinite`,
        }}
      />
      <div
        className="absolute"
        style={{ right: '50%', top: 0, width: '50%', marginRight: '-1%', transformOrigin: '100% 50%', animation: `flutterL ${speed}s ease-in-out infinite` }}
      >
        <img src={wing} alt="" style={{ width: '100%', transform: 'scaleX(-1)' }} />
      </div>
      <img src={art(`wingbody-${tone}`)} alt="" className="absolute" style={{ left: '50%', top: '26%', width: '14%', transform: 'translateX(-50%)' }} />
    </div>
  )
}
