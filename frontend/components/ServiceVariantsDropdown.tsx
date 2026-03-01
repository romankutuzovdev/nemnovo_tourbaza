'use client'

import { useState } from 'react'
import type { ServiceVariant } from '@/lib/api'

type Props = {
  variants: ServiceVariant[]
}

export function ServiceVariantsDropdown({ variants }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  if (variants.length === 0) return null

  const selected = selectedIdx !== null ? variants[selectedIdx] : null

  return (
    <div className="mt-10">
      <label htmlFor="service-variant" className="block font-sans text-sm font-semibold text-black/70 mb-2 uppercase tracking-wider">
        Выберите вариант
      </label>
      <select
        id="service-variant"
        className="w-full max-w-md font-sans text-base text-black bg-white border border-secondary/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
        value={selectedIdx ?? ''}
        onChange={(e) => setSelectedIdx(e.target.value === '' ? null : Number(e.target.value))}
      >
        <option value="">— Не выбрано —</option>
        {variants.map((v, i) => (
          <option key={i} value={i}>{v.name}</option>
        ))}
      </select>

      {selected?.description && (
        <p className="mt-3 font-sans text-sm text-black/70 leading-relaxed max-w-md">
          {selected.description}
        </p>
      )}
    </div>
  )
}
