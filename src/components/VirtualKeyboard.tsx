import { motion } from 'framer-motion'

type Props = {
  mode: 'qwerty' | 'numeric'
  onKey: (ch: string) => void
  onBackspace: () => void
  onConfirm: () => void
  confirmLabel?: string
  canConfirm?: boolean
}

const QWERTY: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

function QKey({ label, onTap, className = '', flex = 1 }: { label: string; onTap: () => void; className?: string; flex?: number }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      style={{ flex }}
      className={`glass flex h-[9cqw] items-center justify-center rounded-[2cqw] text-[3.7cqw] font-semibold text-white/90 ${className}`}
    >
      {label}
    </motion.button>
  )
}

/* ── Dialpad numérico — teclas grandes, números em tamanho cheio ── */
function NumKey({ label, onTap, variant = 'glass' }: { label: string; onTap: () => void; variant?: 'glass' | 'muted' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onTap}
      className={`flex h-[15cqw] items-center justify-center rounded-[2.8cqw] font-bold ${
        variant === 'muted' ? 'bg-white/[0.06] text-[6cqw] text-white/75' : 'glass text-[7cqw] text-white'
      }`}
    >
      {label}
    </motion.button>
  )
}

export function VirtualKeyboard({ mode, onKey, onBackspace, onConfirm, confirmLabel = 'Confirmar', canConfirm = true }: Props) {
  if (mode === 'numeric') {
    return (
      <div className="mx-auto w-[74cqw]">
        <div className="grid grid-cols-3 gap-[2.4cqw]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <NumKey key={n} label={n} onTap={() => onKey(n)} />
          ))}
          <NumKey label="⌫" onTap={onBackspace} variant="muted" />
          <NumKey label="0" onTap={() => onKey('0')} />
          <motion.button
            whileTap={{ scale: 0.92 }}
            disabled={!canConfirm}
            onClick={() => canConfirm && onConfirm()}
            className={`flex h-[15cqw] items-center justify-center rounded-[2.8cqw] text-[6.5cqw] font-bold transition ${
              canConfirm ? 'bg-lime text-graphite-950 shadow-[0_1.6cqw_4cqw_rgba(148,188,34,.45)]' : 'cursor-not-allowed bg-white/5 text-white/25'
            }`}
            aria-label={confirmLabel}
          >
            ✓
          </motion.button>
        </div>
      </div>
    )
  }

  // QWERTY
  return (
    <div className="flex flex-col gap-[1.4cqw] px-[3cqw]">
      {QWERTY.map((row, i) => (
        <div key={i} className="flex justify-center gap-[1.4cqw]">
          {row.map((k) => (
            <QKey key={k} label={k} onTap={() => onKey(k)} flex={1} />
          ))}
        </div>
      ))}

      <div className="mt-[0.6cqw] flex justify-center gap-[1.4cqw]">
        <QKey label="espaço" onTap={() => onKey(' ')} flex={2} className="text-[2.4cqw] uppercase tracking-widest text-white/60" />
        <QKey label="⌫" onTap={onBackspace} flex={1} className="bg-white/5 text-[4cqw]" />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => canConfirm && onConfirm()}
          disabled={!canConfirm}
          style={{ flex: 2 }}
          className={`flex h-[9cqw] items-center justify-center gap-[1cqw] rounded-[2cqw] text-[3.2cqw] font-bold transition ${
            canConfirm ? 'bg-lime text-graphite-950 shadow-[0_1.4cqw_4cqw_rgba(148,188,34,.45)]' : 'cursor-not-allowed bg-white/5 text-white/25'
          }`}
        >
          {confirmLabel} →
        </motion.button>
      </div>
    </div>
  )
}
