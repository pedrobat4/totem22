import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VirtualKeyboard } from '../components/VirtualKeyboard'

function formatPhone(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function Cadastro({ onDone }: { onDone: (name: string, phone: string) => void }) {
  const [sub, setSub] = useState<'nome' | 'telefone'>('nome')
  const [name, setName] = useState('')
  const [digits, setDigits] = useState('')

  const nameValid = name.trim().length >= 2
  const phoneValid = digits.length === 11

  const isName = sub === 'nome'
  const prompt = isName ? 'Como podemos te chamar?' : 'Qual seu WhatsApp?'
  const sub2 = isName ? 'Digite seu nome' : 'Você recebe o prêmio por aqui'

  const handleKey = (ch: string) => {
    if (isName) {
      if (name.length < 28) setName((n) => n + ch)
    } else {
      if (/[0-9]/.test(ch)) setDigits((d) => (d.length < 11 ? d + ch : d))
    }
  }
  const handleBack = () => (isName ? setName((n) => n.slice(0, -1)) : setDigits((d) => d.slice(0, -1)))
  const handleConfirm = () => {
    if (isName && nameValid) setSub('telefone')
    else if (!isName && phoneValid) onDone(name.trim(), formatPhone(digits))
  }

  const display = isName ? name : formatPhone(digits)

  return (
    <div className="absolute inset-0 flex flex-col items-center px-16 pt-[150px]">
      {/* progresso */}
      <div className="flex gap-3">
        {['nome', 'telefone'].map((s) => (
          <div key={s} className={`h-2 w-24 rounded-full ${sub === s ? 'bg-lime' : 'bg-white/15'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-16 text-center"
        >
          <h1 className="text-[72px] font-extrabold leading-tight text-white">{prompt}</h1>
          <p className="mt-3 text-[30px] text-teal">{sub2}</p>
        </motion.div>
      </AnimatePresence>

      {/* input + teclado na ZONA DE CONFORTO inferior (--comfort-zone) */}
      <div className="comfort-block">
        <div className="mx-16 mb-8">
          <div className="glass-strong flex min-h-[130px] items-center justify-center rounded-3xl px-10">
            <span className="text-[68px] font-bold tracking-wide text-white">
              {display || <span className="text-white/30">{isName ? 'Seu nome' : '(00) 00000-0000'}</span>}
            </span>
            <span className="ml-2 inline-block h-[64px] w-[3px] animate-pulse bg-lime" />
          </div>
          {!isName && digits.length > 0 && !phoneValid && (
            <p className="mt-3 text-center text-[24px] text-white/45">Faltam {11 - digits.length} dígitos</p>
          )}
        </div>

        <VirtualKeyboard
          mode={isName ? 'qwerty' : 'numeric'}
          onKey={handleKey}
          onBackspace={handleBack}
          onConfirm={handleConfirm}
          confirmLabel={isName ? 'Continuar' : 'Continuar'}
          canConfirm={isName ? nameValid : phoneValid}
        />
      </div>
    </div>
  )
}
