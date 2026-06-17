import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ADS = ['/ads/ad1.mp4', '/ads/ad2.mp4']
const SWAP_MS = 9000

/**
 * Atração: os 2 vídeos ficam SEMPRE montados e tocando; trocamos só a opacidade
 * (crossfade). Nunca pisca, nunca fica preto. A única coisa por cima do vídeo é
 * o botão pulsante no canto inferior — não cobre a publicidade.
 */
export function Attract({ onStart }: { onStart: () => void }) {
  const [active, setActive] = useState(0)
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]

  useEffect(() => {
    // garante o play (autoplay mudo) nos dois
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

      {/* leve vinheta só nas bordas pra dar profundidade, sem tampar o centro */}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 220px rgba(0,0,0,.55)' }} />

      {/* botão compacto, canto inferior, pulsante — NÃO cobre a publicidade */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          onStart()
        }}
        whileTap={{ scale: 0.95 }}
        className="animate-touchpulse absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-lime px-12 py-6 text-[40px] font-extrabold text-graphite-950 shadow-[0_20px_60px_rgba(148,188,34,.5)]"
      >
        👆 Toque para participar
      </motion.button>
    </div>
  )
}
