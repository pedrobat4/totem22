import type { Category, Store } from './types'

export const CATEGORIES: Category[] = [
  { id: 'moda', label: 'Moda', emoji: '👗' },
  { id: 'beleza', label: 'Beleza', emoji: '💄' },
  { id: 'eletronicos', label: 'Eletrônicos', emoji: '📱' },
  { id: 'casa', label: 'Casa & Decoração', emoji: '🛋️' },
  { id: 'esporte', label: 'Esporte', emoji: '👟' },
  { id: 'alimentacao', label: 'Alimentação', emoji: '🍔' },
]

// Lojas parceiras (marcas reais de shopping). Cor = setor da roleta.
// Gold (#D9DC00) é proibido aqui — reservado ao momento de vitória.
export const STORES: Store[] = [
  { id: 'renner', name: 'Renner', category: 'moda', weight: 3, prize: '20% OFF em qualquer peça', color: '#E4467A', emoji: '🛍️' },
  { id: 'riachuelo', name: 'Riachuelo', category: 'moda', weight: 2, prize: 'R$ 50 de desconto', color: '#03A095', emoji: '👕' },
  { id: 'boticario', name: 'O Boticário', category: 'beleza', weight: 3, prize: 'Brinde exclusivo + 15% OFF', color: '#6F5BD0', emoji: '💄' },
  { id: 'sephora', name: 'Sephora', category: 'beleza', weight: 1, prize: 'Kit de amostras premium', color: '#222', emoji: '✨' },
  { id: 'kalunga', name: 'Kalunga', category: 'eletronicos', weight: 2, prize: '10% OFF em acessórios', color: '#2E7DD1', emoji: '🖥️' },
  { id: 'iplace', name: 'iPlace', category: 'eletronicos', weight: 1, prize: 'Capa de brinde na compra', color: '#4A4A4A', emoji: '📱' },
  { id: 'centauro', name: 'Centauro', category: 'esporte', weight: 2, prize: 'R$ 80 OFF acima de R$ 300', color: '#94BC22', emoji: '👟' },
  { id: 'cacau', name: 'Cacau Show', category: 'alimentacao', weight: 3, prize: 'Trufa grátis + 10% OFF', color: '#7A4A23', emoji: '🍫' },
  { id: 'tokstok', name: 'Tok&Stok', category: 'casa', weight: 1, prize: 'R$ 100 OFF acima de R$ 500', color: '#C75B12', emoji: '🛋️' },
  { id: 'cinemark', name: 'Cinemark', category: 'alimentacao', weight: 2, prize: 'Pipoca grátis na sessão', color: '#C0142B', emoji: '🍿' },
]
