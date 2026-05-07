'use client'

import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

type Props = {
  slug: string
  title: string
  price: number | null
}

export function AddToCartButton({ slug, title, price }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  if (price == null) return null
  const finalPrice = price

  function handleAdd() {
    addItem({ slug, title, price: finalPrice }, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`px-6 py-3 font-sans text-sm tracking-wide transition-all duration-300 ${
        added
          ? 'bg-green-600 text-white scale-105 shadow-lg shadow-green-600/30'
          : 'bg-primary text-white hover:bg-primary/90'
      }`}
    >
      {added ? 'Добавлено' : 'В корзину'}
    </button>
  )
}
