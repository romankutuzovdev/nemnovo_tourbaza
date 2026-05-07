'use client'

import { useMemo, useState } from 'react'
import type { ServiceVariant } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

type Props = {
  slug: string
  title: string
  basePrice: number | null
  variants: ServiceVariant[]
}

export function ServicePurchasePanel({ slug, title, basePrice, variants }: Props) {
  const { addItem } = useCart()
  const [quantityInput, setQuantityInput] = useState('1')
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number | null>(variants.length ? null : -1)
  const [added, setAdded] = useState(false)

  const selectedVariant = selectedVariantIdx !== null && selectedVariantIdx >= 0 ? variants[selectedVariantIdx] : null
  const currentPrice = useMemo(() => {
    if (variants.length > 0) {
      if (!selectedVariant || !selectedVariant.price) return null
      return Number(selectedVariant.price)
    }
    return basePrice
  }, [variants, selectedVariant, basePrice])

  const canAdd = currentPrice !== null && (variants.length === 0 || selectedVariant !== null)

  function handleAdd() {
    if (!canAdd || currentPrice === null) return
    const quantity = Math.max(1, Number(quantityInput) || 1)
    addItem({ slug, title, price: currentPrice, variantName: selectedVariant?.name || undefined }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <div className="mt-6 space-y-3">
      {variants.length > 0 && (
        <div>
          <label htmlFor="service-variant" className="block font-sans text-sm font-semibold text-black/70 mb-2 uppercase tracking-wider">
            Выберите вариант
          </label>
          <select
            id="service-variant"
            className="w-full max-w-md font-sans text-base text-black bg-white border border-secondary/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
            value={selectedVariantIdx ?? ''}
            onChange={(e) => setSelectedVariantIdx(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">— Не выбрано —</option>
            {variants.map((v, i) => (
              <option key={`${v.name}-${i}`} value={i}>{v.name}{v.price ? ` — ${Number(v.price).toFixed(2)} BYN` : ''}</option>
            ))}
          </select>
          {selectedVariant?.description && <p className="mt-2 font-sans text-sm text-black/70">{selectedVariant.description}</p>}
        </div>
      )}

      <div className="flex items-center gap-4">
        {currentPrice !== null ? (
          <p className="font-serif text-2xl text-primary">{currentPrice.toFixed(2)} BYN</p>
        ) : (
          <p className="font-sans text-sm text-black/60">Цена не указана</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            onChange={(e) => {
              const next = e.target.value
              if (next === '' || /^\d+$/.test(next)) setQuantityInput(next)
            }}
            onBlur={() => {
              if (!quantityInput || Number(quantityInput) < 1) setQuantityInput('1')
            }}
            className="w-16 border border-secondary/20 px-2 py-1"
          />
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className={`px-4 py-2 text-sm transition-all duration-300 disabled:opacity-50 ${
              added ? 'bg-green-500 text-white scale-105 shadow-md shadow-green-600/40' : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {added ? 'Добавлено' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  )
}
