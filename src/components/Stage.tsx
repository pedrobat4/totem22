import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Palco fixo 1080×1920 (TV vertical). Escala para caber em qualquer viewport
 * mantendo a proporção — assim o dev preview e a TV real ficam idênticos.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const calc = () => setScale(Math.min(window.innerWidth / 1080, window.innerHeight / 1920))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return (
    <div className="stage-viewport">
      <div className="stage" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}
