import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ADS = ['/ads/ad1.mp4', '/ads/ad2.mp4']
const SWAP_MS = 9000

/**
 * Atração: os 2 vídeos ficam SEMPRE montados e tocando; trocamos só a opacidade
 * (crossfade). Nunca pisca, nunca fica preto. A única coisa por cima do vídeo é
 * o botão pulsante no rodapé — não cobre a publicidade.
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

      {/* vinheta sutil nas bordas, sem tampar o centro */}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 18cqw rgba(0,0,0,.5)' }} />

      {/* botão compacto, rodapé, pulsante — NÃO cobre a publicidade */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          onStart()
        }}
        whileTap={{ scale: 0.95 }}
        className="animate-touchpulse absolute bottom-[7cqw] left-1/2 -translate-x-1/2 rounded-full bg-lime px-[6cqw] py-[3cqw] text-[4.2cqw] font-extrabold text-graphite-950 shadow-[0_2cqw_6cqw_rgba(148,188,34,.5)]"
      >
        👆 Toque para participar
      </motion.button>
    </div>
  )
}
