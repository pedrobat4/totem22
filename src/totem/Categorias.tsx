import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../lib/data'

export function Categorias({ onDone }: { onDone: (selected: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const canGo = sel.length >= 1

  return (
    <div className="absolute inset-0 flex flex-col items-center px-16 pt-[160px]">
      <h1 className="text-center text-[72px] font-extrabold leading-tight text-white">
        O que você <span className="text-lime">curte?</span>
      </h1>
      <p className="mt-3 text-[30px] text-teal">Escolha pelo menos uma — a roleta foca no seu gosto</p>

      <div className="mt-16 grid w-full max-w-[900px] grid-cols-2 gap-6">
        {CATEGORIES.map((c, i) => {
          const on = sel.includes(c.id)
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(c.id)}
              className={`flex h-[170px] items-center gap-6 rounded-3xl px-10 text-left transition-colors ${
                on ? 'bg-lime text-graphite-950' : 'glass text-white'
              }`}
            >
              <span className="text-[72px]">{c.emoji}</span>
              <span className="text-[44px] font-bold">{c.label}</span>
              <span className={`ml-auto flex h-12 w-12 items-center justify-center rounded-full text-[30px] ${on ? 'bg-graphite-950 text-lime' : 'bg-white/10 text-transparent'}`}>
                ✓
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="comfort-block px-16">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => canGo && onDone(sel)}
          disabled={!canGo}
          className={`flex h-[120px] w-full items-center justify-center rounded-3xl text-[44px] font-extrabold transition ${
            canGo ? 'bg-lime text-graphite-950 shadow-[0_18px_50px_rgba(148,188,34,.5)]' : 'cursor-not-allowed bg-white/5 text-white/25'
          }`}
        >
          Girar a roleta 🎯
        </motion.button>
      </div>
    </div>
  )
}
