import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../lib/data'

export function Categorias({ onDone }: { onDone: (selected: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const canGo = sel.length >= 1

  return (
    <div className="flex h-full w-full flex-col items-center px-[5cqw] pt-[7cqw]">
      <div className="text-center">
        <h1 className="text-[6.6cqw] font-extrabold leading-tight text-white">
          O que você <span className="text-lime">curte?</span>
        </h1>
        <p className="mt-[1cqw] text-[2.9cqw] text-teal">Escolha pelo menos uma — a roleta foca no seu gosto</p>
      </div>

      <div className="mt-[4cqw] grid w-full grid-cols-2 gap-[2.2cqw]">
        {CATEGORIES.map((c, i) => {
          const on = sel.includes(c.id)
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(c.id)}
              className={`relative flex items-center gap-[2.5cqw] overflow-hidden rounded-[3cqw] px-[3.5cqw] py-[3cqw] text-left transition-colors ${
                on ? 'bg-lime text-graphite-950 shadow-[0_1.6cqw_4cqw_rgba(148,188,34,.4)]' : 'glass text-white'
              }`}
            >
              <span
                className={`flex h-[11cqw] w-[11cqw] flex-none items-center justify-center rounded-[2.4cqw] text-[5.4cqw] ${
                  on ? 'bg-graphite-950/15' : 'bg-white/[0.06]'
                }`}
              >
                {c.emoji}
              </span>
              <span className="text-[3.6cqw] font-bold leading-tight">{c.label}</span>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => canGo && onDone(sel)}
        disabled={!canGo}
        className={`mt-[5cqw] flex h-[12cqw] w-full items-center justify-center gap-[1.5cqw] rounded-[3cqw] text-[4cqw] font-extrabold transition ${
          canGo ? 'bg-lime text-graphite-950 shadow-[0_1.8cqw_5cqw_rgba(148,188,34,.5)]' : 'cursor-not-allowed bg-white/5 text-white/25'
        }`}
      >
        Girar a roleta 🎯
      </motion.button>

      {!canGo && <p className="mt-[2cqw] text-[2.4cqw] text-white/35">Toque em uma categoria para continuar</p>}
    </div>
  )
}
