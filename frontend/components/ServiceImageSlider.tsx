'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  images: string[]
  title: string
}

export function ServiceImageSlider({ images, title }: Props) {
  const [idx, setIdx] = useState(0)

  if (images.length === 0) return null

  const prev = () => setIdx((i) => Math.max(0, i - 1))
  const next = () => setIdx((i) => Math.min(images.length - 1, i + 1))

  return (
    <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
      <Image
        key={idx}
        src={images[idx]}
        alt={`${title} — фото ${idx + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 1024px"
        className="object-cover"
        priority={idx === 0}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]" aria-hidden />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl"
            aria-label="Предыдущее фото"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            disabled={idx === images.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl"
            aria-label="Следующее фото"
          >
            ›
          </button>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
                aria-label={`Фото ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
