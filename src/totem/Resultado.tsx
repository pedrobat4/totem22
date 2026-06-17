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
    <div className="flex h-full w-full flex-col items-center overflow-y-auto px-[5cqw] pb-[6cqw] pt-[7cqw] text-center">
      <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-[3.8cqw] font-semibold text-teal">
        Parabéns, {first}!
      </motion.p>
      <motion.h1
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="text-gold-glow mt-[1cqw] text-[11cqw] font-black leading-none"
      >
        Você ganhou!
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-strong mt-[4cqw] w-full rounded-[4cqw] p-[5cqw]">
        <div className="text-[6cqw]">{store.emoji}</div>
        <div className="mt-[0.6cqw] text-[5.4cqw] font-extrabold text-white">{store.name}</div>
        <div className="mt-[1.4cqw] inline-block rounded-full bg-lime px-[3.5cqw] py-[1.4cqw] text-[3.3cqw] font-bold text-graphite-950">{store.prize}</div>

        {qr ? (
          <img src={qr} alt="QR Code do prêmio" className="mx-auto mt-[4cqw] h-[42cqw] w-[42cqw] rounded-[3cqw] bg-white p-[1.5cqw]" />
        ) : (
          <div className="mx-auto mt-[4cqw] flex h-[42cqw] w-[42cqw] items-center justify-center rounded-[3cqw] bg-white/10 text-[3cqw] text-white/50">gerando…</div>
        )}

        <p className="mt-[3cqw] text-[2.9cqw] leading-snug text-white/80">Mostre este QR Code na loja para retirar seu prêmio.</p>
        <p className="mt-[1.2cqw] flex items-center justify-center gap-[1cqw] text-[2.8cqw] font-semibold text-lime">
          <span>📲</span> Também enviamos para o seu WhatsApp
        </p>
      </motion.div>

      <button onClick={onRestart} className="glass mt-[4cqw] rounded-full px-[5cqw] py-[2.4cqw] text-[3.2cqw] font-bold text-white">
        Nova participação ({left}s)
      </button>
    </div>
  )
}
