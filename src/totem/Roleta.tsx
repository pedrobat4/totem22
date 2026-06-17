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
    setRot(360 * SPINS - sectorCenter(idx, STORES.length))
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
    <div className="flex h-full w-full flex-col items-center px-[5cqw] pt-[7cqw]">
      <h1 className="text-center text-[6cqw] font-extrabold leading-tight text-white">
        {spinning ? 'Boa sorte! 🍀' : 'Toque no centro para girar'}
      </h1>
      {!spinning && <p className="mt-[1cqw] text-[2.9cqw] text-teal">Cada giro garante um prêmio</p>}

      {/* roleta — clicável (clicar no meio gira) e posicionada mais para cima */}
      <div className="relative mt-[5cqw] h-[84cqw] w-[84cqw] cursor-pointer" onClick={start}>
        {/* ponteiro fixo no topo */}
        <div
          className="absolute left-1/2 top-[-2.4cqw] z-20 -translate-x-1/2"
          style={{ width: 0, height: 0, borderLeft: '3.2cqw solid transparent', borderRight: '3.2cqw solid transparent', borderTop: '5cqw solid #94BC22', filter: 'drop-shadow(0 0.6cqw 1cqw rgba(0,0,0,.5))' }}
        />

        <motion.div className="h-full w-full" animate={{ rotate: rot }} transition={{ duration: 5.6, ease: [0.1, 0.82, 0.12, 1] }} onAnimationComplete={onComplete}>
          <Wheel stores={STORES} />
        </motion.div>

        {flash && <motion.div className="gold-flash" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.2, 1] }} />}

        {/* botão central GIRAR — overlay flex centraliza no miolo de verdade
            (a pulsação usa transform:scale, que não desloca mais o botão) */}
        {!spinning && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                start()
              }}
              whileTap={{ scale: 0.92 }}
              className="animate-touchpulse pointer-events-auto flex h-[19cqw] w-[19cqw] items-center justify-center rounded-full bg-lime text-[3.6cqw] font-black tracking-wide text-graphite-950 shadow-[0_1.4cqw_4cqw_rgba(148,188,34,.55)]"
            >
              GIRAR
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
