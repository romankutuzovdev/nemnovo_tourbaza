'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  title: string
  photosLabel: string
  closeLabel: string
}

export function PortfolioGallery({ images, title, photosLabel, closeLabel }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      else if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1))
      else if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, images.length])

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(i)}
            className="relative block aspect-square rounded-lg overflow-hidden bg-secondary/30 border border-secondary/10 hover:border-primary/40 transition-colors group text-left w-full"
          >
            <Image
              src={url}
              alt={`${title} — ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white font-sans text-xs rounded">
              {i + 1} / {images.length}
            </span>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal
          aria-label={`${title} — ${photosLabel}`}
        >
          <div
            className="flex flex-col items-center w-full max-w-6xl flex-1 min-h-0 px-4 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-xs font-sans mb-2">{title}</p>
            <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
              <Image
                src={images[lightboxIndex]}
                alt={`${title} — ${lightboxIndex + 1}`}
                width={1600}
                height={1200}
                className="max-h-[88vh] w-auto h-auto object-contain"
                sizes="(max-width: 1200px) 100vw, 1280px"
              />
            </div>
            <div className="flex items-center justify-center gap-6 py-4">
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                disabled={lightboxIndex === 0}
                className="text-white/60 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-white/50 text-xs tabular-nums">
                {lightboxIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => Math.min(images.length - 1, i + 1))}
                disabled={lightboxIndex === images.length - 1}
                className="text-white/60 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="text-white/50 hover:text-white/80 text-xs font-sans pb-4"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
