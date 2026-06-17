import type { Store, TokenPayload } from './types'
import { TOTEM } from '../config'

/* ─── base64url UTF-8 (suporta acentos) ─────────────────────────────── */
function b64urlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlDecode(s: string): string {
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : ''
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'ls-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Gera o token único (string que vai dentro do QR) com todos os dados do lead. */
export function makeToken(input: { name: string; phone: string; categories: string[]; store: Store }): string {
  const payload: TokenPayload = {
    v: 1,
    id: randomId(),
    name: input.name.trim(),
    phone: input.phone,
    categories: input.categories,
    storeName: input.store.name,
    prize: input.store.prize,
    location: TOTEM.location,
    ts: Date.now(),
  }
  return b64urlEncode(JSON.stringify(payload))
}

/** Lê o conteúdo do QR de volta para um payload (ou null se inválido). */
export function decodeToken(raw: string): TokenPayload | null {
  try {
    const obj = JSON.parse(b64urlDecode(raw.trim()))
    if (obj && obj.v === 1 && obj.id && obj.storeName) return obj as TokenPayload
    return null
  } catch {
    return null
  }
}

/* ─── Marca de uso único (front-only, localStorage) ──────────────────
 * GANCHO API REAL: troque estas três funções por chamadas ao backend
 * (ex.: POST /validar { id } → { status: 'valido' | 'usado' }). A UI do
 * validador não muda, só a fonte da verdade.
 * ------------------------------------------------------------------- */
const USED_KEY = 'leadspin:used-tokens'

function readUsed(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(USED_KEY) || '{}')
  } catch {
    return {}
  }
}

export function isUsed(id: string): boolean {
  return id in readUsed()
}

export function markUsed(id: string): void {
  const used = readUsed()
  used[id] = Date.now()
  localStorage.setItem(USED_KEY, JSON.stringify(used))
}
