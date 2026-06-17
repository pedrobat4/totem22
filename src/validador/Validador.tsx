import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { decodeToken, isUsed, markUsed } from '../lib/token'
import type { TokenPayload } from '../lib/types'

type Result =
  | { status: 'valid'; payload: TokenPayload }
  | { status: 'used'; payload: TokenPayload }
  | { status: 'invalid' }

const READER_ID = 'qr-reader'

export function Validador() {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const runningRef = useRef(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  async function stop() {
    if (scannerRef.current && runningRef.current) {
      runningRef.current = false
      try {
        await scannerRef.current.stop()
      } catch {
        /* ignore */
      }
    }
  }

  async function start() {
    setError('')
    setResult(null)
    if (!scannerRef.current) scannerRef.current = new Html5Qrcode(READER_ID)
    try {
      runningRef.current = true
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 300, height: 300 } },
        onDecoded,
        () => {},
      )
    } catch {
      runningRef.current = false
      setError('Não foi possível acessar a câmera. Permita o acesso à câmera e recarregue a página.')
    }
  }

  async function onDecoded(text: string) {
    if (!runningRef.current) return
    await stop()

    // GANCHO API REAL: em vez de decodificar local + checar localStorage,
    // troque por  await fetch('/api/validar', { method:'POST', body: token })
    // e use o status retornado pelo backend.
    const payload = decodeToken(text)
    if (!payload) return setResult({ status: 'invalid' })
    if (isUsed(payload.id)) return setResult({ status: 'used', payload })
    markUsed(payload.id)
    setResult({ status: 'valid', payload })
  }

  useEffect(() => {
    start()
    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ok = result?.status === 'valid'
  const bg = !result ? '#1b1c1c' : ok ? '#1d2b0a' : result.status === 'used' ? '#2b0d0d' : '#2b2410'

  return (
    <div className="min-h-screen w-full text-white" style={{ background: bg, transition: 'background .3s', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 py-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">
            Lead<span className="text-lime">Spin</span> · Validador
          </h1>
          <p className="mt-1 text-white/60">Aponte a câmera para o QR Code do prêmio</p>
        </header>

        {/* área da câmera */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40">
          <div id={READER_ID} className="aspect-square w-full" />
        </div>

        {error && <p className="mt-5 rounded-2xl bg-red-500/15 p-4 text-center text-red-300">{error}</p>}

        {/* resultado */}
        {result && (
          <div className="mt-6 rounded-3xl p-7 text-center" style={{ background: ok ? '#94BC22' : result.status === 'used' ? '#C0142B' : '#9a7b13', color: ok ? '#1b1c1c' : '#fff' }}>
            <div className="text-6xl">{ok ? '✅' : result.status === 'used' ? '⛔' : '❓'}</div>
            <div className="mt-2 text-4xl font-black">
              {ok ? 'VÁLIDO' : result.status === 'used' ? 'JÁ UTILIZADO' : 'QR INVÁLIDO'}
            </div>

            {result.status !== 'invalid' && (
              <div className="mt-5 space-y-1">
                <div className="text-2xl font-bold">{result.payload.storeName}</div>
                <div className="text-lg opacity-90">{result.payload.prize}</div>
                <div className="mt-3 text-lg">
                  Lead: <span className="font-semibold">{result.payload.name}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-6">
          {result ? (
            <button onClick={start} className="w-full rounded-2xl bg-lime py-5 text-2xl font-extrabold text-graphite-950">
              Validar próximo →
            </button>
          ) : (
            <p className="text-center text-sm text-white/40">Escaneando… mantenha o QR dentro do quadro</p>
          )}
        </div>
      </div>
    </div>
  )
}
