import type { ReactNode } from 'react'

/**
 * Área do totem: preenche o viewport real do aparelho (celular cheio, TV cheia)
 * e, em telas largas, vira uma coluna portrait centralizada. É um container
 * (container-type: inline-size), então os filhos dimensionam em `cqw` e ficam
 * proporcionais em qualquer resolução — sem escala fixa, sem letterbox.
 */
export function Stage({ children }: { children: ReactNode }) {
  return <div className="screen">{children}</div>
}
