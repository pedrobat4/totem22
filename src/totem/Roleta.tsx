import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Wheel, sectorCenter } from '../components/Wheel'
import { STORES } from '../lib/data'
import type { Store } from '../lib/types'

const SPINS = 6

function pickWinner(categories: string[]): Store {
  // Sorteio ponderado: lojas das categorias escolhidas pesam 3×.
  const pool = STORES.map((s) => ({ s, w: s.weight * (categories.includes(s.category) ? 3 : 1) }))
  const total = pool.reduce((a, b) => a + b.w, 0)
  let r = Math.random() * total
  for (const p of pool) {
    r -= p.w
    if (r <= 0) return p.s
  }
  return pool[pool.length - 1].s
}

export function Roleta({ categories, onDone }: { categories: string[]; onDone: (store: Store) => void }) {
  const [winner] = useState(() => pickWinner(categories))
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [flash, setFlash] = useState(false)
  const fired = useRef(false)

  const start = () => {
    if (spinning) return
    setSpinning(true)
    const idx = STORES.findIndex((s) => s.id === winner.id)
    const target = 360 * SPINS - sectorCenter(idx, STORES.length)
    setRot(target)
  }

  const onComplete = () => {
    if (fired.current || !spinning) return
    fired.current = true
    setFlash(true)
    confetti({ particleCount: 220, spread: 100, origin: { y: 0.4 }, colors: ['#94BC22', '#03A095', '#D9DC00', '#ffffff'] })
    setTimeout(() => confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 }, colors: ['#D9DC00', '#94BC22'] }), 250)
    setTimeout(() => onDone(winner), 1700)
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
      <h1 className="absolute top-[120px] text-center text-[64px] font-extrabold text-white">
        {spinning ? 'Boa sorte! 🍀' : 'Toque para girar'}
      </h1>

      <div className="relative" style={{ width: 900, height: 900 }}>
        {/* ponteiro fixo no topo */}
        <div className="absolute left-1/2 top-[-26px] z-20 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: '34px solid transparent', borderRight: '34px solid transparent', borderTop: '54px solid #94BC22', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }} />

        <motion.div
          className="h-full w-full"
          animate={{ rotate: rot }}
          transition={{ duration: 5.6, ease: [0.1, 0.82, 0.12, 1] }}
          onAnimationComplete={onComplete}
        >
          <Wheel stores={STORES} />
        </motion.div>

        {flash && (
          <motion.div className="gold-flash" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.2, 1] }} />
        )}
      </div>

      {!spinning && (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={start}
          className="animate-touchpulse absolute bottom-[120px] rounded-full bg-lime px-16 py-7 text-[46px] font-extrabold text-graphite-950 shadow-[0_20px_60px_rgba(148,188,34,.5)]"
        >
          GIRAR 🎯
        </motion.button>
      )}
    </div>
  )
}
