import { useEffect, useRef } from 'react'
import { useAnimationFrame } from 'framer-motion'
import rig from '../data/bear.generated.json'
import { art } from '../lib/assets'
import { pop } from '../lib/sound'
import { burst } from '../lib/flash'

const W = 640
const H = 780
const JOINTS = {
  // Where each part hinges, in the bear's own 640 x 780 drawing
  pelvis: [320, 560],
  torso: [320, 540],
  head: [320, 376],
  armL: [226, 410],
  armR: [414, 410],
  legL: [256, 740],
  legR: [384, 740],
  skirt: [320, 512],
}
const origin = ([x, y]) => `${(x / W) * 100}% ${(y / H) * 100}%`

function Part({ name }) {
  const p = rig.parts[name]
  return (
    <img
      src={art(`bear/${name}`)}
      alt=""
      draggable={false}
      className="absolute"
      style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: `${p.w * 100}%`, height: `${p.h * 100}%` }}
    />
  )
}

function Bone({ name, joint, setRef, children }) {
  return (
    <div ref={setRef(name)} className="absolute inset-0" style={{ transformOrigin: origin(JOINTS[joint ?? name]), willChange: 'transform' }}>
      {children}
    </div>
  )
}

export const bearImages = Object.keys(rig.parts).map((n) => art(`bear/${n}`))

// A plush teddy in a tutu. Every limb is its own layer, so she shakes her hips for real:
// the hips lead, the body counters them, and the tutu swings a beat behind.
export function DancingCharacter({ size = '27rem', dancing = true, onTap, label = 'A dancing teddy bear', interactive }) {
  const ref = useRef({})
  const bones = (name) => (el) => {
    ref.current[name] = el
  }
  const state = useRef({ amp: 1, wave: 0, joy: 0, t0: null })

  useEffect(() => {
    state.current.target = dancing ? 1 : 0
  }, [dancing])

  useAnimationFrame((now, delta) => {
    const s = state.current
    const b = ref.current
    if (!b.root) return
    const t = now / 1000
    const dt = Math.min(0.05, delta / 1000)
    const target = s.target ?? 1
    s.amp += (target - s.amp) * (1 - Math.exp(-dt * 2.6))
    s.joy *= Math.exp(-dt * 3.4)
    const A = s.amp
    const idle = 1 - A

    // Dance beat: one left-right-left of the hips
    const beat = (t * Math.PI * 2) / 0.86
    const sway = Math.sin(beat)
    const hipX = sway * 3.5 * A + Math.sin(t * 1.5) * 0.25 * idle
    const hipY = -Math.abs(Math.cos(beat)) * 1.05 * A - s.joy * 7
    const hipRot = sway * 7.5 * A
    const counter = -Math.sin(beat - 0.32) * 9.5 * A + Math.sin(t * 1.5) * 1.2 * idle
    const headRot = Math.sin(beat - 0.85) * 10 * A + Math.sin(t * 1.2) * 4 * idle
    const headY = Math.cos(beat * 2) * 0.42 * A + Math.sin(t * 2.1) * 0.25 * idle
    const skirt = Math.sin(beat - 0.62) * 12 * A
    const flare = 1 + Math.abs(Math.sin(beat - 0.62)) * 0.06 * A
    const armL = A * (118 + Math.sin(beat) * 24) + idle * (Math.sin(t * 2) * 4 + 8) + s.joy * 60
    const armR = -(A * (118 - Math.sin(beat) * 24) + idle * (112 + Math.sin(t * 6.2) * 17)) - s.joy * 30
    const legRot = hipX * 1.5
    const legBend = 0.05 * A

    b.root.style.transform = `translate3d(${(Math.sin(beat / 2) * 1.3 * A).toFixed(3)}%,${(s.joy * -2).toFixed(3)}%,0)`
    b.pelvis.style.transform = `translate3d(${hipX.toFixed(3)}%,${hipY.toFixed(3)}%,0) rotate(${hipRot.toFixed(3)}deg)`
    b.torso.style.transform = `rotate(${counter.toFixed(3)}deg)`
    b.head.style.transform = `translate3d(0,${headY.toFixed(3)}%,0) rotate(${(headRot - counter * 0.4).toFixed(3)}deg)`
    b.skirt.style.transform = `rotate(${(skirt - hipRot * 0.3).toFixed(3)}deg) scale(${flare.toFixed(4)},${(2 - flare).toFixed(4)})`
    b.armL.style.transform = `rotate(${armL.toFixed(3)}deg)`
    b.armR.style.transform = `rotate(${armR.toFixed(3)}deg)`
    b.legL.style.transform = `rotate(${legRot.toFixed(3)}deg) scaleY(${(1 - Math.max(0, sway) * legBend).toFixed(4)})`
    b.legR.style.transform = `rotate(${legRot.toFixed(3)}deg) scaleY(${(1 + Math.min(0, sway) * legBend).toFixed(4)})`
    b.shadow.style.transform = `translate3d(${(hipX * 2).toFixed(3)}%,0,0) scale(${(1 - s.joy * 0.25 - Math.abs(sway) * 0.03 * A).toFixed(4)})`
  })

  const tap = (e) => {
    state.current.joy = 1
    pop(1.2)
    burst(e.clientX, e.clientY, 12, { power: 0.7 })
    onTap?.()
  }

  const Tag = interactive ? 'button' : 'div'

  return (
    <Tag
      onClick={interactive ? tap : undefined}
      aria-label={interactive ? label : undefined}
      role={interactive ? undefined : 'img'}
      className="relative block"
      style={{ width: size, aspectRatio: W / H, transition: 'width .9s cubic-bezier(.22,.9,.24,1)' }}
    >
      <div
        ref={bones('shadow')}
        className="absolute"
        style={{ left: '14%', right: '14%', bottom: '-1.2%', height: '7%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgb(50 8 20 / 0.5), transparent)' }}
      />
      <div ref={bones('root')} className="absolute inset-0">
        <Bone setRef={bones} name="legL"><Part name="legL" /></Bone>
        <Bone setRef={bones} name="legR"><Part name="legR" /></Bone>
        <Bone setRef={bones} name="pelvis">
          <Bone setRef={bones} name="torso">
            <Bone setRef={bones} name="armL"><Part name="armL" /></Bone>
            <Bone setRef={bones} name="armR"><Part name="armR" /></Bone>
            <Part name="torso" />
            <Bone setRef={bones} name="head"><Part name="head" /></Bone>
          </Bone>
          <Bone setRef={bones} name="skirt"><Part name="skirt" /></Bone>
        </Bone>
      </div>
    </Tag>
  )
}
