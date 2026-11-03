import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { setMuted, subscribe } from '../lib/sound'

export function SoundToggle() {
  const [muted, setLocal] = useState(false)
  useEffect(() => subscribe((s) => setLocal(s.muted)), [])
  return (
    <motion.button
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.6 }}
      onClick={() => setMuted(!muted)}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      aria-pressed={!muted}
      className="fixed grid place-items-center"
      style={{
        top: 'calc(env(safe-area-inset-top) + 1.2rem)',
        right: 'calc(50% - var(--col) / 2 + 1.2rem)',
        width: '4.2rem',
        height: '4.2rem',
        zIndex: 70,
        borderRadius: '50%',
        color: '#6e0d20',
        background: 'radial-gradient(circle at 36% 28%, #fff, #ffd0e3 55%, #f28bae)',
        boxShadow: '0 0 0 0.22rem #fffdf8, 0 0.5rem 1.2rem rgb(40 4 14 / 0.5)',
      }}
    >
      {muted ? <VolumeX size="2.1rem" strokeWidth={2.4} /> : <Volume2 size="2.1rem" strokeWidth={2.4} />}
    </motion.button>
  )
}
