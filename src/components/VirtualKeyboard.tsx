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

const NUMERIC: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0'],
]

function Key({ label, onTap, className = '', flex = 1 }: { label: string; onTap: () => void; className?: string; flex?: number }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      style={{ flex }}
      className={`glass flex h-[96px] items-center justify-center rounded-2xl text-[40px] font-semibold text-white/90 ${className}`}
    >
      {label}
    </motion.button>
  )
}

export function VirtualKeyboard({ mode, onKey, onBackspace, onConfirm, confirmLabel = 'Confirmar', canConfirm = true }: Props) {
  const rows = mode === 'qwerty' ? QWERTY : NUMERIC

  return (
    <div className="flex flex-col gap-3 px-10">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-3">
          {row.map((k) => (
            <Key key={k} label={k} onTap={() => onKey(k)} flex={mode === 'numeric' ? 0 : 1} className={mode === 'numeric' ? 'w-[200px] flex-none' : ''} />
          ))}
        </div>
      ))}

      <div className="mt-1 flex justify-center gap-3">
        {mode === 'qwerty' && (
          <Key label="espaço" onTap={() => onKey(' ')} flex={2} className="text-[26px] uppercase tracking-widest text-white/60" />
        )}
        <Key label="⌫" onTap={onBackspace} flex={1} className="bg-white/5 text-[44px]" />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => canConfirm && onConfirm()}
          disabled={!canConfirm}
          style={{ flex: 2 }}
          className={`flex h-[96px] items-center justify-center gap-3 rounded-2xl text-[34px] font-bold transition ${
            canConfirm ? 'bg-lime text-graphite-950 shadow-[0_14px_40px_rgba(148,188,34,.45)]' : 'cursor-not-allowed bg-white/5 text-white/25'
          }`}
        >
          {confirmLabel} →
        </motion.button>
      </div>
    </div>
  )
}
