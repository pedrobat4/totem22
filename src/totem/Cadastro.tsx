import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { BrandFooter } from '../components/BrandFooter'

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

  const handleKey = (ch: string) => {
    if (isName) {
      if (name.length < 28) setName((n) => n + ch)
    } else if (/[0-9]/.test(ch)) {
      setDigits((d) => (d.length < 11 ? d + ch : d))
    }
  }
  const handleBack = () => (isName ? setName((n) => n.slice(0, -1)) : setDigits((d) => d.slice(0, -1)))
  const handleConfirm = () => {
    if (isName && nameValid) setSub('telefone')
    else if (!isName && phoneValid) onDone(name.trim(), formatPhone(digits))
  }

  const display = isName ? name : formatPhone(digits)

  return (
    <div className="flex h-full w-full flex-col items-center px-[5cqw] pt-[7cqw]">
      {/* progresso */}
      <div className="flex gap-[1.4cqw]">
        {['nome', 'telefone'].map((s) => (
          <div key={s} className={`h-[0.8cqw] w-[10cqw] rounded-full ${sub === s ? 'bg-lime' : 'bg-white/15'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="flex w-full flex-col items-center"
        >
          {/* título + subtítulo */}
          <div className="mt-[5cqw] text-center">
            <h1 className="text-[6.6cqw] font-extrabold leading-tight text-white">
              {isName ? 'Como podemos te chamar?' : 'Qual seu WhatsApp?'}
            </h1>
            <p className="mt-[1cqw] text-[2.9cqw] text-teal">{isName ? 'Digite seu nome' : 'Você recebe o prêmio por aqui'}</p>
          </div>

          {/* campo de input — logo abaixo do subtítulo */}
          <div className="mt-[3.5cqw] w-full px-[2cqw]">
            <div className="glass-strong flex min-h-[12cqw] items-center justify-center rounded-[3cqw] px-[4cqw]">
              <span className="text-[6cqw] font-bold tracking-wide text-white">
                {display || <span className="text-white/30">{isName ? 'Seu nome' : '(00) 00000-0000'}</span>}
              </span>
              <span className="ml-[0.4cqw] inline-block h-[5.5cqw] w-[0.4cqw] animate-pulse bg-lime" />
            </div>
            {!isName && digits.length > 0 && !phoneValid && (
              <p className="mt-[1cqw] text-center text-[2.4cqw] text-white/45">Faltam {11 - digits.length} dígitos</p>
            )}
          </div>

          {/* TECLADO — no topo, logo abaixo do campo de input */}
          <div className="mt-[3cqw] w-full">
            <VirtualKeyboard
              mode={isName ? 'qwerty' : 'numeric'}
              onKey={handleKey}
              onBackspace={handleBack}
              onConfirm={handleConfirm}
              confirmLabel="Continuar"
              canConfirm={isName ? nameValid : phoneValid}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* faixa de logomarcas (realização) no rodapé */}
      <BrandFooter />
    </div>
  )
}
