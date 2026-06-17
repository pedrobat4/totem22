import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../lib/data'

export function Categorias({ onDone }: { onDone: (selected: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const canGo = sel.length >= 1

  return (
    <div className="flex h-full w-full flex-col items-center px-[5cqw] pt-[8cqw]">
      <h1 className="text-center text-[6.6cqw] font-extrabold leading-tight text-white">
        O que você <span className="text-lime">curte?</span>
      </h1>
      <p className="mt-[1cqw] text-center text-[2.9cqw] text-teal">Escolha pelo menos uma — a roleta foca no seu gosto</p>

      <div className="flex w-full flex-1 items-center">
        <div className="grid w-full grid-cols-2 gap-[2cqw]">
          {CATEGORIES.map((c, i) => {
            const on = sel.includes(c.id)
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggle(c.id)}
                className={`flex h-[15cqw] items-center gap-[2cqw] rounded-[3cqw] px-[4cqw] text-left transition-colors ${
                  on ? 'bg-lime text-graphite-950' : 'glass text-white'
                }`}
              >
                <span className="text-[6.5cqw]">{c.emoji}</span>
                <span className="text-[4cqw] font-bold leading-tight">{c.label}</span>
                <span className={`ml-auto flex h-[5cqw] w-[5cqw] items-center justify-center rounded-full text-[2.8cqw] ${on ? 'bg-graphite-950 text-lime' : 'bg-white/10 text-transparent'}`}>
                  ✓
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="comfort-pad w-full">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => canGo && onDone(sel)}
          disabled={!canGo}
          className={`flex h-[11cqw] w-full items-center justify-center rounded-[3cqw] text-[4cqw] font-extrabold transition ${
            canGo ? 'bg-lime text-graphite-950 shadow-[0_1.8cqw_5cqw_rgba(148,188,34,.5)]' : 'cursor-not-allowed bg-white/5 text-white/25'
          }`}
        >
          Girar a roleta 🎯
        </motion.button>
      </div>
    </div>
  )
}
