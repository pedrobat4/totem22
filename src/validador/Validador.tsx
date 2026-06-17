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
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-2.5 last:border-0">
      <span className="shrink-0 text-white/55">{label}</span>
      <span className="text-right font-semibold">{value || '—'}</span>
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

  // decodifica + define status (usado tanto pela câmera quanto pela foto)
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
    // Config robusta: detector nativo do navegador quando houver + quadro inteiro.
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

  // Plano B: ler o QR de uma foto (tirar agora ou escolher da galeria)
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
  const pageBg = !result ? '#1b1c1c' : ok ? '#1d2b0a' : used ? '#2b0d0d' : '#2b2410'
  const headBg = ok ? '#94BC22' : used ? '#C0142B' : '#9a7b13'

  return (
    <div className="min-h-screen w-full text-white" style={{ background: pageBg, transition: 'background .3s', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 py-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">
            Lead<span className="text-lime">Spin</span> · Validador
          </h1>
          <p className="mt-1 text-white/60">Aponte a câmera para o QR Code do prêmio</p>
        </header>

        {/* câmera */}
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40">
          <div id={READER_ID} className="aspect-square w-full" />
          {!scanning && !result && (
            <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 text-center">
              <span className="text-5xl">📷</span>
              <span className="rounded-full bg-lime px-7 py-3 text-xl font-extrabold text-graphite-950">Ativar câmera</span>
              <span className="px-8 text-sm text-white/60">Toque e permita o acesso à câmera</span>
            </button>
          )}
        </div>

        {error && <p className="mt-5 rounded-2xl bg-red-500/15 p-4 text-center text-sm text-red-200">{error}</p>}

        {/* dica + plano B enquanto escaneia */}
        {scanning && !result && (
          <div className="mt-4 text-center">
            <p className="text-sm text-white/40">Mantenha o QR a ~15 cm, centralizado e com boa luz</p>
            <button onClick={() => fileRef.current?.click()} className="mt-3 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80">
              não está lendo? 📸 ler por foto
            </button>
          </div>
        )}

        {/* resultado */}
        {result && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <div className="p-6 text-center" style={{ background: headBg, color: ok ? '#1b1c1c' : '#fff' }}>
              <div className="text-6xl">{ok ? '✅' : used ? '⛔' : '❓'}</div>
              <div className="mt-1 text-4xl font-black">{ok ? 'VÁLIDO' : used ? 'JÁ UTILIZADO' : 'QR INVÁLIDO'}</div>
              {used && <div className="mt-1 text-sm opacity-90">Este prêmio já foi resgatado</div>}
            </div>

            {result.status !== 'invalid' && (
              <div className="bg-black/35 px-6 py-4 text-[15px]">
                <Row label="Prêmio" value={`${result.payload.storeName} — ${result.payload.prize}`} />
                <Row label="Nome" value={result.payload.name} />
                <Row label="Telefone" value={result.payload.phone} />
                <Row label="Mais gosta de" value={(result.payload.categories || []).join(' · ')} />
                <Row label="Totem" value={result.payload.location} />
                <Row label="Horário" value={fmtWhen(result.payload.ts)} />
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-6">
          {result ? (
            <button onClick={start} className="w-full rounded-2xl bg-lime py-5 text-2xl font-extrabold text-graphite-950">
              Validar próximo →
            </button>
          ) : !scanning ? (
            <button onClick={() => fileRef.current?.click()} className="w-full rounded-2xl border border-white/15 py-4 text-lg font-semibold text-white/80">
              📸 Ler de uma foto
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
