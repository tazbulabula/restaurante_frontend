// src/store/cartStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  produto_id: number
  name: string
  price: number
  quantidade: number
  observacoes?: string
}

interface CartState {
  items: CartItem[]
  total: number
  addItem: (produto: { id: number; name: string; price: number }, quantidade?: number) => void
  removeItem: (produtoId: number) => void
  updateQuantidade: (produtoId: number, quantidade: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (produto, quantidade = 1) => {
        const { items } = get()
        const existing = items.find(item => item.produto_id === produto.id)

        if (existing) {
          set({
            items: items.map(item =>
              item.produto_id === produto.id
                ? { ...item, quantidade: item.quantidade + quantidade }
                : item
            ),
            total: get().total + (produto.price * quantidade),
          })
        } else {
          set({
            items: [...items, { produto_id: produto.id, name: produto.name, price: produto.price, quantidade }],
            total: get().total + (produto.price * quantidade),
          })
        }
      },

      removeItem: (produtoId) => {
        const { items } = get()
        const item = items.find(i => i.produto_id === produtoId)
        if (item) {
          set({
            items: items.filter(i => i.produto_id !== produtoId),
            total: get().total - (item.price * item.quantidade),
          })
        }
      },

      updateQuantidade: (produtoId, quantidade) => {
        const { items } = get()
        const item = items.find(i => i.produto_id === produtoId)
        if (item && quantidade > 0) {
          const diff = quantidade - item.quantidade
          set({
            items: items.map(i =>
              i.produto_id === produtoId ? { ...i, quantidade } : i
            ),
            total: get().total + (item.price * diff),
          })
        }
      },

      clearCart: () => set({ items: [], total: 0 }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantidade, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)