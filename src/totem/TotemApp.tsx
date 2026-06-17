import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Stage } from '../components/Stage'
import { Attract } from './Attract'
import { Cadastro } from './Cadastro'
import { Categorias } from './Categorias'
import { Roleta } from './Roleta'
import { Resultado } from './Resultado'
import { makeToken } from '../lib/token'
import { CATEGORIES } from '../lib/data'
import type { Store } from '../lib/types'

type Step = 'attract' | 'cadastro' | 'categorias' | 'roleta' | 'resultado'

const INACTIVITY_MS = 60_000

export function TotemApp() {
  const [step, setStep] = useState<Step>('attract')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [token, setToken] = useState('')

  const reset = useCallback(() => {
    setName('')
    setPhone('')
    setCategories([])
    setStore(null)
    setToken('')
    setStep('attract')
  }, [])

  // Timer de inatividade: qualquer toque/tecla reinicia a contagem.
  // Sem interação por 60s fora da Atração → volta para a Atração.
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    const arm = () => {
      window.clearTimeout(timer.current)
      if (step !== 'attract') timer.current = window.setTimeout(reset, INACTIVITY_MS)
    }
    arm()
    window.addEventListener('pointerdown', arm)
    window.addEventListener('keydown', arm)
    return () => {
      window.clearTimeout(timer.current)
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
    }
  }, [step, reset])

  const onCadastro = (n: string, p: string) => {
    setName(n)
    setPhone(p)
    setStep('categorias')
  }
  const onCategorias = (cats: string[]) => {
    setCategories(cats)
    setStep('roleta')
  }
  const onRoleta = (won: Store) => {
    setStore(won)
    const catLabels = categories.map((id) => CATEGORIES.find((c) => c.id === id)?.label ?? id)
    setToken(makeToken({ name, phone, categories: catLabels, store: won }))
    setStep('resultado')
  }

  return (
    <Stage>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {step === 'attract' && <Attract onStart={() => setStep('cadastro')} />}
          {step === 'cadastro' && <Cadastro onDone={onCadastro} />}
          {step === 'categorias' && <Categorias onDone={onCategorias} />}
          {step === 'roleta' && <Roleta categories={categories} onDone={onRoleta} />}
          {step === 'resultado' && store && <Resultado name={name} store={store} token={token} onRestart={reset} />}
        </motion.div>
      </AnimatePresence>
    </Stage>
  )
}
