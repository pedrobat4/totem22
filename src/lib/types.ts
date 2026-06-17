export type Category = {
  id: string
  label: string
  emoji: string
}

export type Store = {
  id: string
  name: string
  /** Categoria à qual a loja pertence (id de Category). */
  category: string
  /** Peso-base no sorteio ponderado. Maior = mais provável. */
  weight: number
  prize: string
  /** Cor do setor na roleta (NUNCA dourado — reservado à vitória). */
  color: string
  emoji: string
}

export type Lead = {
  token: string
  name: string
  phone: string
  categories: string[]
  storeId: string
  storeName: string
  prize: string
  createdAt: number
}

/** Conteúdo decodificado do QR Code — tudo que o /validador precisa mostrar. */
export type TokenPayload = {
  v: 1
  id: string
  name: string
  phone: string
  categories: string[] // rótulos do que a pessoa mais gosta
  storeName: string
  prize: string
  location: string // localização do totem
  ts: number
}
