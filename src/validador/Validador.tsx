import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { decodeToken, isUsed, markUsed } from '../lib/token'
import type { TokenPayload } from '../lib/types'

type Result =
  | { status: 'valid'; payload: TokenPayload }
  | { status: 'used'; payload: TokenPayload }
  | { status: 'invalid' }

const READER_ID = 'qr-reader'

function fmtWhen(ts: number): string {
  try {
    return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="shrink-0 text-sm font-medium uppercase tracking-wide text-white/45">{label}</span>
      <span className="text-right text-lg font-semibold text-white">{value || '—'}</span>
    </div>
  )
}

export function Validador() {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const runningRef = useRef(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  function ensure(): Html5Qrcode {
    if (!scannerRef.current) scannerRef.current = new Html5Qrcode(READER_ID)
    return scannerRef.current
  }

  async function stop() {
    if (scannerRef.current && runningRef.current) {
      runningRef.current = false
      try {
        await scannerRef.current.stop()
      } catch {
        /* ignore */
      }
    }
    setScanning(false)
  }

  function process(text: string) {
    // GANCHO API REAL: troque por  await fetch('/api/validar', { method:'POST', body: token })
    const payload = decodeToken(text)
    if (!payload) return setResult({ status: 'invalid' })
    if (isUsed(payload.id)) return setResult({ status: 'used', payload })
    markUsed(payload.id)
    setResult({ status: 'valid', payload })
  }

  async function start() {
    setError('')
    setResult(null)
    const scanner = ensure()
    const config = { fps: 15, experimentalFeatures: { useBarCodeDetectorIfSupported: true } }
    const onHit = async (text: string) => {
      if (!runningRef.current) return
      await stop()
      process(text)
    }
    try {
      runningRef.current = true
      setScanning(true)
      await scanner.start({ facingMode: 'environment' }, config, onHit, () => {})
    } catch (e) {
      runningRef.current = false
      setScanning(false)
      const msg = e instanceof Error ? e.message : String(e)
      setError('Não foi possível abrir a câmera: ' + msg + ' — permita o acesso à câmera para este site.')
    }
  }

  async function onFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    ev.target.value = ''
    if (!file) return
    setError('')
    await stop()
    try {
      const text = await ensure().scanFile(file, false)
      process(text)
    } catch {
      setResult({ status: 'invalid' })
      setError('Não consegui ler um QR nessa foto. Tente enquadrar só o QR, com boa luz.')
    }
  }

  useEffect(() => {
    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ok = result?.status === 'valid'
  const used = result?.status === 'used'
  const pageBg = !result ? '#161717' : ok ? '#16230a' : used ? '#230a0a' : '#231d0a'
  const headBg = ok ? '#94BC22' : used ? '#C0142B' : '#9a7b13'

  return (
    // wrapper fixo + rolável: escapa do overflow:hidden global do totem e rola no celular
    <div
      className="fixed inset-0 overflow-y-auto text-white"
      style={{ background: pageBg, transition: 'background .3s', fontFamily: 'Inter, system-ui, sans-serif', WebkitOverflowScrolling: 'touch' }}
    >
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

      <div className="mx-auto w-full max-w-[560px] px-5 pb-12 pt-8">
        <header className="text-center">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-lime" />
          <h1 className="text-3xl font-black tracking-tight">
            Lead<span className="text-lime">Spin</span>
          </h1>
          <p className="mt-1 text-sm text-white/55">Validador de prêmios · escaneie o QR Code</p>
        </header>

        {/* câmera (some quando há resultado) */}
        <div className={`relative mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-black/50 shadow-2xl ${result ? 'hidden' : ''}`}>
          <div id={READER_ID} className="aspect-square w-full" />
          {!scanning && (
            <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 text-center backdrop-blur-sm">
              <span className="text-6xl">📷</span>
              <span className="rounded-full bg-lime px-8 py-3.5 text-xl font-extrabold text-graphite-950 shadow-lg">Ativar câmera</span>
              <span className="px-8 text-sm text-white/55">Toque e permita o acesso à câmera</span>
            </button>
          )}
          {scanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[62%] w-[62%] rounded-3xl border-[3px] border-lime/80" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,.28)' }} />
            </div>
          )}
        </div>

        {scanning && !result && (
          <div className="mt-4 text-center">
            <p className="text-sm text-white/50">Centralize o QR no quadro · ~15 cm · boa luz</p>
            <button onClick={() => fileRef.current?.click()} className="mt-3 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80">
              não está lendo? 📸 ler por foto
            </button>
          </div>
        )}

        {error && <p className="mt-5 rounded-2xl bg-red-500/15 p-4 text-center text-sm text-red-200">{error}</p>}

        {/* resultado */}
        {result && (
          <div className="mt-7">
            <div className="rounded-[28px] p-7 text-center shadow-2xl" style={{ background: headBg, color: ok ? '#15240a' : '#fff' }}>
              <div className="text-7xl leading-none">{ok ? '✅' : used ? '⛔' : '❓'}</div>
              <div className="mt-2 text-4xl font-black tracking-tight">{ok ? 'VÁLIDO' : used ? 'JÁ UTILIZADO' : 'QR INVÁLIDO'}</div>
              <div className="mt-1 text-sm font-medium opacity-80">{ok ? 'Pode liberar o prêmio' : used ? 'Este prêmio já foi resgatado' : 'QR não reconhecido'}</div>
            </div>

            {result.status !== 'invalid' && (
              <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-2">
                <Row label="Prêmio" value={`${result.payload.storeName} — ${result.payload.prize}`} />
                <div className="h-px bg-white/10" />
                <Row label="Nome" value={result.payload.name} />
                <div className="h-px bg-white/10" />
                <Row label="Telefone" value={result.payload.phone} />
                <div className="h-px bg-white/10" />
                <Row label="Mais gosta de" value={(result.payload.categories || []).join(' · ')} />
                <div className="h-px bg-white/10" />
                <Row label="Totem" value={result.payload.location} />
                <div className="h-px bg-white/10" />
                <Row label="Horário" value={fmtWhen(result.payload.ts)} />
              </div>
            )}

            <button onClick={start} className="mt-6 w-full rounded-2xl bg-lime py-5 text-2xl font-extrabold text-graphite-950 shadow-lg">
              Validar próximo →
            </button>
          </div>
        )}

        {!result && !scanning && (
          <button onClick={() => fileRef.current?.click()} className="mt-6 w-full rounded-2xl border border-white/15 py-4 text-lg font-semibold text-white/80">
            📸 Ler de uma foto
          </button>
        )}
      </div>
    </div>
  )
}
