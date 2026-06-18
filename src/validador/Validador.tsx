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
    <div className="flex items-start justify-between gap-4 py-3.5">
      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-white/40">{label}</span>
      <span className="text-right text-lg font-semibold leading-snug text-white">{value || '—'}</span>
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

  // Destrava o documento só nesta rota: o totem trava overflow/scroll no
  // global, mas o validador precisa rolar e ser responsivo no celular.
  useEffect(() => {
    document.documentElement.classList.add('scrollable')
    return () => {
      document.documentElement.classList.remove('scrollable')
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ok = result?.status === 'valid'
  const used = result?.status === 'used'
  const invalid = result?.status === 'invalid'
  const pageBg = !result ? '#141515' : ok ? '#0f1f06' : used ? '#1f0808' : '#1f1906'
  const accent = ok ? '#94BC22' : used ? '#e5484d' : '#D9DC00'
  const statusLabel = ok ? 'VÁLIDO' : used ? 'JÁ UTILIZADO' : 'QR INVÁLIDO'
  const statusSub = ok ? 'Pode liberar o prêmio' : used ? 'Este prêmio já foi resgatado' : 'QR não reconhecido'
  const statusIcon = ok ? '✓' : used ? '✕' : '!'

  return (
    // fluxo normal de página (com .scrollable no html) → rola nativo e responsivo
    <div
      className="min-h-dvh w-full"
      style={{ background: pageBg, transition: 'background .35s', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}
    >
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

      <div className="mx-auto w-full max-w-[600px] px-5 pb-14 pt-9">
        {/* ===== Cabeçalho / título ===== */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-xl font-black text-graphite-950">L</span>
            <span className="text-xl font-extrabold tracking-tight">
              Lead<span className="text-lime">Spin</span>
            </span>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Validador</span>
        </header>

        {!result && (
          <div className="mt-7">
            <h1 className="text-[34px] font-black leading-tight tracking-tight">Validador de Prêmios</h1>
            <p className="mt-1.5 text-[15px] text-white/55">Escaneie o QR Code do cliente para conferir o prêmio</p>
          </div>
        )}

        {/* ===== Câmera (SOME quando há resultado) ===== */}
        {!result && (
          <div className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-black/60 shadow-2xl">
            <div id={READER_ID} className="aspect-square w-full" />
            {!scanning ? (
              <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 text-center backdrop-blur-[2px]">
                <span className="text-6xl">📷</span>
                <span className="rounded-full bg-lime px-9 py-4 text-xl font-extrabold text-graphite-950 shadow-lg">Ativar câmera</span>
                <span className="px-8 text-sm text-white/55">Toque e permita o acesso à câmera</span>
              </button>
            ) : (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {/* cantos de mira */}
                <div className="relative h-[64%] w-[64%]">
                  {[
                    'left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl',
                    'right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl',
                    'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-2xl',
                    'right-0 bottom-0 border-r-4 border-b-4 rounded-br-2xl',
                  ].map((c) => (
                    <span key={c} className={`absolute h-10 w-10 border-lime ${c}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && scanning && (
          <div className="mt-4 text-center">
            <p className="text-sm text-white/50">Centralize o QR no quadro · ~15 cm · boa luz</p>
            <button onClick={() => fileRef.current?.click()} className="mt-3 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80">
              não está lendo? 📸 ler por foto
            </button>
          </div>
        )}

        {error && <p className="mt-5 rounded-2xl bg-red-500/15 p-4 text-center text-sm text-red-200">{error}</p>}

        {/* ===== Resultado (câmera já sumiu) ===== */}
        {result && (
          <div className="mt-7">
            {/* selo de status */}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-full text-5xl font-black" style={{ background: accent, color: ok ? '#0f1f06' : '#fff' }}>
                {statusIcon}
              </span>
              <div className="mt-3 text-3xl font-black tracking-tight" style={{ color: accent }}>
                {statusLabel}
              </div>
              <div className="mt-0.5 text-sm text-white/55">{statusSub}</div>
            </div>

            {!invalid && result.status !== 'invalid' && (
              <>
                {/* nome do cliente em destaque */}
                <div className="mt-7 rounded-[26px] border border-white/10 bg-white/[0.05] p-6 text-center">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">Cliente</div>
                  <div className="mt-1 text-[30px] font-black leading-tight">{result.payload.name}</div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-base font-extrabold text-graphite-950">
                    🎁 {result.payload.storeName} — {result.payload.prize}
                  </div>
                </div>

                {/* detalhes */}
                <div className="mt-4 divide-y divide-white/10 rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-1">
                  <Row label="Telefone" value={result.payload.phone} />
                  <Row label="Mais gosta de" value={(result.payload.categories || []).join(' · ')} />
                  <Row label="Totem" value={result.payload.location} />
                  <Row label="Horário" value={fmtWhen(result.payload.ts)} />
                </div>
              </>
            )}

            <button onClick={start} className="mt-7 w-full rounded-2xl bg-lime py-5 text-xl font-extrabold text-graphite-950 shadow-lg">
              Validar próximo →
            </button>
          </div>
        )}

        {!result && !scanning && (
          <button onClick={() => fileRef.current?.click()} className="mt-6 w-full rounded-2xl border border-white/15 py-4 text-base font-semibold text-white/75">
            📸 Ler de uma foto
          </button>
        )}
      </div>
    </div>
  )
}
