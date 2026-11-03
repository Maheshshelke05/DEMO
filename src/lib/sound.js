// All sound is synthesised live, so there are no audio files to download.
// A music-box "Happy Birthday" (the melody is public domain), a camera shutter and a soft pop.
let ctx = null
let master = null
let musicBus = null
let muted = false
let musicOn = false
let timer = null
let nextBar = 0
let barIndex = 0
const listeners = new Set()

const HZ = (m) => 440 * Math.pow(2, (m - 69) / 12)
const notify = () => listeners.forEach((fn) => fn({ muted, musicOn }))

export const subscribe = (fn) => {
  listeners.add(fn)
  fn({ muted, musicOn })
  return () => listeners.delete(fn)
}

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.85
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -14
  limiter.ratio.value = 6
  master.connect(limiter)
  limiter.connect(ctx.destination)

  // A small room, built from decaying noise
  const seconds = 1.7
  const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buffer.getChannelData(ch)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3.2)
  }
  const room = ctx.createConvolver()
  room.buffer = buffer
  const wet = ctx.createGain()
  wet.gain.value = 0.3
  room.connect(wet)
  wet.connect(master)

  musicBus = ctx.createGain()
  musicBus.gain.value = 0
  musicBus.connect(master)
  musicBus.connect(room)
  return ctx
}

// Browsers only allow sound after a tap, so every tap handler calls this.
export function unlock() {
  const c = ensure()
  if (c && c.state === 'suspended') c.resume()
}

function bell(freq, when, vel = 1) {
  // Metal tine: a sine with slightly inharmonic overtones that fade quickly
  const partials = [
    [1, 1, 1.9],
    [2.01, 0.34, 0.9],
    [4.2, 0.12, 0.34],
    [6.6, 0.05, 0.16],
  ]
  for (const [ratio, amp, decay] of partials) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq * ratio
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(amp * vel * 0.2, when + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, when + decay)
    o.connect(g)
    g.connect(musicBus)
    o.start(when)
    o.stop(when + decay + 0.05)
  }
}

// "Happy Birthday" in C, one line per bar of 3/4. [midi note, beat within the bar]
const G = 67, A = 69, B = 71, C5 = 72, D5 = 74, E5 = 76, F5 = 77, G5 = 79
const BARS = [
  { pick: [[G, -1], [G, -0.25]], notes: [[A, 0], [G, 1], [C5, 2]], chord: [48, 55, 64] },
  { notes: [[B, 0]], pick: [[G, 2], [G, 2.75]], chord: [43, 50, 59] },
  { notes: [[A, 0], [G, 1], [D5, 2]], chord: [43, 50, 59] },
  { notes: [[C5, 0]], pick: [[G, 2], [G, 2.75]], chord: [48, 55, 64] },
  { notes: [[G5, 0], [E5, 1], [C5, 2]], chord: [48, 55, 64] },
  { notes: [[B, 0], [A, 1]], pick: [[F5, 2], [F5, 2.75]], chord: [41, 53, 60] },
  { notes: [[E5, 0], [C5, 1], [D5, 2]], chord: [48, 55, 62] },
  { notes: [[C5, 0]], chord: [48, 55, 64] },
]
const BEAT = 0.5
const REST_BARS = 2

function scheduleBar(bar, start) {
  for (const [m, b] of bar.notes ?? []) bell(HZ(m + 12), start + b * BEAT, 1)
  for (const [m, b] of bar.pick ?? []) bell(HZ(m + 12), start + b * BEAT, 0.8)
  bar.chord?.forEach((m, i) => bell(HZ(m + 12), start + i * BEAT, 0.34))
}

function pump() {
  if (!musicOn || !ctx) return
  while (nextBar < ctx.currentTime + 1.6) {
    const pos = barIndex % (BARS.length + REST_BARS)
    if (pos < BARS.length) scheduleBar(BARS[pos], nextBar)
    nextBar += BEAT * 3
    barIndex++
  }
}

export function startMusic() {
  if (!ensure() || musicOn) return
  unlock()
  musicOn = true
  barIndex = 0
  nextBar = ctx.currentTime + 0.9
  musicBus.gain.cancelScheduledValues(ctx.currentTime)
  musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 0.5)
  timer = setInterval(pump, 300)
  pump()
  notify()
}

export function stopMusic() {
  if (!ctx || !musicOn) return
  musicOn = false
  clearInterval(timer)
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
  notify()
}

export const toggleMusic = () => (musicOn ? stopMusic() : startMusic())

export function setMuted(next) {
  muted = next
  if (master) master.gain.setTargetAtTime(next ? 0 : 0.85, ctx.currentTime, 0.04)
  notify()
}

export function pop(pitch = 1) {
  if (!ensure()) return
  unlock()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(420 * pitch, t)
  o.frequency.exponentialRampToValueAtTime(920 * pitch, t + 0.07)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + 0.2)
}

export function shutter() {
  if (!ensure()) return
  unlock()
  const t = ctx.currentTime
  const click = (when, tone, level) => {
    const len = Math.floor(ctx.sampleRate * 0.04)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    const s = ctx.createBufferSource()
    const f = ctx.createBiquadFilter()
    const g = ctx.createGain()
    s.buffer = buf
    f.type = 'bandpass'
    f.frequency.value = tone
    f.Q.value = 1.1
    g.gain.value = level
    s.connect(f)
    f.connect(g)
    g.connect(master)
    s.start(when)
  }
  click(t, 3200, 0.5)
  click(t + 0.085, 1900, 0.38)
}

// Never keep playing once she switches apps or locks the phone
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) ctx.suspend()
    else if (ctx.state === 'suspended') ctx.resume()
  })
}
