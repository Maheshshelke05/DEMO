// The camera flash and the party bursts are one shared overlay, so any scene can fire them cheaply.
let flashEl = null
let burstFn = null

export const bindFlash = (el) => {
  flashEl = el
}
export const bindBurst = (fn) => {
  burstFn = fn
}

export function flash({ peak = 0.92, duration = 460 } = {}) {
  flashEl?.animate(
    [
      { opacity: 0 },
      { opacity: peak, offset: 0.1 },
      { opacity: peak * 0.5, offset: 0.34 },
      { opacity: 0 },
    ],
    { duration, easing: 'ease-out' },
  )
}

// Fills the screen with white and holds, used to hide the jump between big scenes.
export function whiteout(to = 1, duration = 420) {
  return flashEl?.animate([{ opacity: flashEl.style.opacity || 0 }, { opacity: to }], { duration, easing: 'ease-in', fill: 'forwards' }).finished
}

export function clearWhiteout(duration = 1000) {
  return flashEl?.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'forwards' }).finished
}

export const burst = (x, y, count, options) => burstFn?.(x, y, count, options)
