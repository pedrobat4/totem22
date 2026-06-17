import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ADS = ['/ads/ad1.mp4', '/ads/ad2.mp4']
const SWAP_MS = 9000

/**
 * Atração: os 2 vídeos ficam SEMPRE montados e tocando; trocamos só a opacidade
 * (crossfade). Nunca pisca, nunca fica preto. A tela toda é tocável; por cima do
 * vídeo só existe um convite DISCRETO no topo — não cobre a publicidade.
 */
export function Attract({ onStart }: { onStart: () => void }) {
  const [active, setActive] = useState(0)
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]

  useEffect(() => {
    refs.forEach((r) => r.current?.play().catch(() => {}))
    const id = setInterval(() => setActive((a) => 1 - a), SWAP_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="absolute inset-0 cursor-pointer bg-black" onClick={onStart}>
      {ADS.map((src, i) => (
        <video
          key={src}
          ref={refs[i]}
          src={src}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: active === i ? 1 : 0 }}
        />
      ))}

      {/* leve escurecimento só no topo, pra dar legibilidade ao convite */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22cqw]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.45), transparent)' }} />

      {/* convite DISCRETO no topo — chip de vidro com pontinho lime pulsando */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          onStart()
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileTap={{ scale: 0.96 }}
        className="absolute left-1/2 top-[6cqw] flex -translate-x-1/2 items-center gap-[1.6cqw] rounded-full border border-white/25 px-[4cqw] py-[1.8cqw] text-[2.9cqw] font-medium text-white/95"
        style={{ background: 'rgba(20,21,21,.32)', backdropFilter: 'blur(12px) saturate(140%)', WebkitBackdropFilter: 'blur(12px) saturate(140%)', textShadow: '0 1px 6px rgba(0,0,0,.5)' }}
      >
        <span className="relative flex h-[1.8cqw] w-[1.8cqw]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
          <span className="relative inline-flex h-[1.8cqw] w-[1.8cqw] rounded-full bg-lime" />
        </span>
        Toque para participar
      </motion.button>
    </div>
  )
}
