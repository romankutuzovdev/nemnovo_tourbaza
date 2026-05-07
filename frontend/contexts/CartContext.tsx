'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  slug: string
  title: string
  price: number
  variantName?: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (slug: string, quantity: number, variantName?: string) => void
  removeItem: (slug: string, variantName?: string) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = 'nemnovo_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      if (Array.isArray(parsed)) setItems(parsed.filter((x) => x.slug && x.quantity > 0))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const itemKey = (item: Pick<CartItem, 'slug' | 'variantName'>) => `${item.slug}::${item.variantName || ''}`

  const api = useMemo<CartContextType>(() => {
    const count = items.reduce((acc, it) => acc + it.quantity, 0)
    const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
    return {
      items,
      addItem: (item, quantity = 1) =>
        setItems((prev) => {
          const idx = prev.findIndex((x) => itemKey(x) === itemKey(item))
          if (idx === -1) return [...prev, { ...item, quantity }]
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
          return next
        }),
      updateQuantity: (slug, quantity, variantName) =>
        setItems((prev) =>
          prev.map((x) =>
            itemKey(x) === itemKey({ slug, variantName })
              ? { ...x, quantity: Math.max(1, quantity) }
              : x
          )
        ),
      removeItem: (slug, variantName) => setItems((prev) => prev.filter((x) => itemKey(x) !== itemKey({ slug, variantName }))),
      clear: () => setItems([]),
      count,
      total,
    }
  }, [items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
