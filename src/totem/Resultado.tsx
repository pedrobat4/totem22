import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import type { Store } from '../lib/types'

const RESTART_SECONDS = 30

export function Resultado({ name, store, token, onRestart }: { name: string; store: Store; token: string; onRestart: () => void }) {
  const [qr, setQr] = useState('')
  const [left, setLeft] = useState(RESTART_SECONDS)

  useEffect(() => {
    QRCode.toDataURL(token, { margin: 1, width: 460, color: { dark: '#1b1c1c', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [token])

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s <= 1 ? (onRestart(), 0) : s - 1)), 1000)
    return () => clearInterval(id)
  }, [onRestart])

  const first = name.split(' ')[0]

  return (
    <div className="absolute inset-0 flex flex-col items-center px-16 pt-[120px] text-center">
      <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-[40px] font-semibold text-teal">
        Parabéns, {first}!
      </motion.p>
      <motion.h1
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="text-gold-glow mt-2 text-[120px] font-black leading-none"
      >
        Você ganhou!
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-strong mt-10 w-full max-w-[820px] rounded-[40px] p-12">
        <div className="text-[60px]">{store.emoji}</div>
        <div className="mt-2 text-[58px] font-extrabold text-white">{store.name}</div>
        <div className="mt-3 inline-block rounded-full bg-lime px-8 py-3 text-[36px] font-bold text-graphite-950">{store.prize}</div>

        {qr ? (
          <img src={qr} alt="QR Code do prêmio" className="mx-auto mt-10 h-[420px] w-[420px] rounded-3xl bg-white p-4" />
        ) : (
          <div className="mx-auto mt-10 flex h-[420px] w-[420px] items-center justify-center rounded-3xl bg-white/10 text-[30px] text-white/50">gerando…</div>
        )}

        <p className="mt-8 text-[30px] leading-snug text-white/80">
          Mostre este QR Code na loja para retirar seu prêmio.
        </p>
        <p className="mt-3 flex items-center justify-center gap-3 text-[28px] font-semibold text-lime">
          <span>📲</span> Também enviamos para o seu WhatsApp
        </p>
      </motion.div>

      <button onClick={onRestart} className="mt-10 rounded-full glass px-12 py-5 text-[34px] font-bold text-white">
        Nova participação ({left}s)
      </button>
    </div>
  )
}
