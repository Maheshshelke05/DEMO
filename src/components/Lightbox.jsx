import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { photo as lookup } from '../lib/assets'
import { pop } from '../lib/sound'

// Tap any print and it floats up to full size, uncropped by the collage layout.
export function Lightbox({ item, onClose }) {
  const p = item && lookup(item.key)
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed-col flex flex-col items-center justify-center"
          style={{ zIndex: 80, background: 'rgb(30 4 12 / 0.86)', padding: '1.6rem', perspective: '90rem', touchAction: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={() => {
            pop(0.8)
            onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo"
        >
          <motion.figure
            className="polaroid"
            style={{ padding: '1.2rem 1.2rem 0', width: '100%', maxHeight: '100%', margin: 0 }}
            initial={{ rotateX: 24, rotateZ: -5, scale: 0.72, y: 60 }}
            animate={{ rotateX: 0, rotateZ: 0, scale: 1, y: 0 }}
            exit={{ rotateX: -18, rotateZ: 4, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 190, damping: 22 }}
          >
            <div className="photo-window" style={{ aspectRatio: p.ratio, maxHeight: 'calc(var(--vh) - 11rem)', margin: '0 auto', backgroundImage: `url(${p.blur})` }}>
              <img src={p.src} srcSet={p.srcSet} sizes="100vw" alt={item.caption ?? 'A photo of her'} style={{ objectFit: 'contain' }} />
            </div>
            <figcaption className="text-center" style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: '2.7rem', color: '#57131f', padding: '0.9rem 0 1.2rem' }}>
              {item.caption || '💗'}
            </figcaption>
          </motion.figure>
          <button className="absolute" style={{ top: '1.6rem', right: '1.6rem', width: '4.4rem', height: '4.4rem', borderRadius: '50%', background: '#fff1d8', display: 'grid', placeItems: 'center', color: '#57131f' }} aria-label="Close photo">
            <X size="2.2rem" strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
