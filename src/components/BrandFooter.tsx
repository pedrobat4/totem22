/**
 * Faixa de logomarcas no rodapé (realização). Fica ABSOLUTA no fundo da Stage,
 * com pointer-events-none para nunca bloquear o toque das telas. Logos pequenas:
 * Montes Claros Shopping vai num chip branco (o texto dela é escuro) e a Metabuy
 * (branca) entra direto sobre o degradê escuro. Tamanhos em cqw → proporcionais.
 */
export function BrandFooter() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
      {/* degradê pra dar leitura sobre vídeo/fundo */}
      <div
        className="absolute inset-x-0 bottom-0 h-[26cqw]"
        style={{ background: 'linear-gradient(to top, rgba(9,10,10,.94) 14%, rgba(9,10,10,.72) 48%, transparent)' }}
      />

      <div className="relative flex flex-col items-center gap-[1.8cqw] px-[5cqw] pb-[3.6cqw] pt-[7cqw]">
        <span className="text-[2cqw] font-semibold uppercase tracking-[0.42em] text-white/40">Realização</span>
        <div className="flex items-center gap-[3.6cqw]">
          <span className="flex items-center rounded-[2cqw] bg-white px-[2.6cqw] py-[1.5cqw] shadow-lg shadow-black/30">
            <img src="/brands/montes-claros-shopping.webp" alt="Montes Claros Shopping" className="h-[5cqw] w-auto" />
          </span>
          <span className="h-[5cqw] w-px bg-white/15" />
          <img src="/brands/metabuy.png" alt="Metabuy" className="h-[3.2cqw] w-auto opacity-90" />
        </div>
      </div>
    </div>
  )
}
