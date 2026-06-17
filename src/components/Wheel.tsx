import type { Store } from '../lib/types'

const SIZE = 900
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE / 2 - 8

function pt(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  return [CX + radius * Math.sin(rad), CY - radius * Math.cos(rad)]
}

/** Setor i ocupa [i*seg, (i+1)*seg]; 0° no topo, sentido horário. */
export function sectorCenter(i: number, n: number): number {
  const seg = 360 / n
  return i * seg + seg / 2
}

export function Wheel({ stores }: { stores: Store[] }) {
  const n = stores.length
  const seg = 360 / n

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,.55))' }}>
      <circle cx={CX} cy={CY} r={R + 6} fill="#101111" />
      {stores.map((s, i) => {
        const a0 = i * seg
        const a1 = (i + 1) * seg
        const [x0, y0] = pt(a0, R)
        const [x1, y1] = pt(a1, R)
        const large = seg > 180 ? 1 : 0
        const [lx, ly] = pt(a0 + seg / 2, R * 0.64)
        const labelAngle = a0 + seg / 2
        return (
          <g key={s.id}>
            <path d={`M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.color} stroke="rgba(0,0,0,.25)" strokeWidth={2} />
            <g transform={`translate(${lx} ${ly}) rotate(${labelAngle})`}>
              <text textAnchor="middle" dy={-14} fontSize={40}>{s.emoji}</text>
              <text textAnchor="middle" dy={26} fontSize={26} fontWeight={800} fill="#fff" style={{ paintOrder: 'stroke' }} stroke="rgba(0,0,0,.35)" strokeWidth={3}>
                {s.name}
              </text>
            </g>
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth={6} />
      {/* aro do hub central (o botão GIRAR é sobreposto por cima, fora da rotação) */}
      <circle cx={CX} cy={CY} r={92} fill="#1b1c1c" stroke="rgba(255,255,255,.18)" strokeWidth={5} />
    </svg>
  )
}
