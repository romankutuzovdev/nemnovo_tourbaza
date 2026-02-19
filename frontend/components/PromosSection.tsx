'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useCallback, useEffect } from 'react'
import { AnimateOnScroll } from './AnimateOnScroll'
import { useLocale, usePromos } from '@/contexts/LocaleContext'
import { useTranslations } from 'next-intl'
import { getPromoImageSrc } from '@/lib/api'

export function PromosSection() {
  const t = useTranslations()
  const locale = useLocale()
  const promos = usePromos()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const run = () => requestAnimationFrame(updateArrows)
    run()
    window.addEventListener('resize', run)
    return () => window.removeEventListener('resize', run)
  }, [updateArrows, promos.length])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const step = el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
  }

  if (promos.length === 0) return null

  return (
    <section id="promos" className="pt-6 md:pt-8 pb-3 md:pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="section-title-main text-primary">
              {t('promosSection.title')}
            </h2>
            {promos.length > 1 && (
              <div className="flex items-center gap-2" aria-hidden>
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-full border border-secondary/20 text-black/80 hover:bg-secondary/30 hover:border-secondary/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label={t('promosSection.prev')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="p-2 rounded-full border border-secondary/20 text-black/80 hover:bg-secondary/30 hover:border-secondary/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label={t('promosSection.next')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </AnimateOnScroll>
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="mt-8 sm:mt-12 flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-none py-1 -mx-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {promos.map((p) => {
            const src = getPromoImageSrc(p)
            return (
              <Link
                key={p.slug}
                href={`/${locale}/promos/${p.slug}`}
                className="block group shrink-0 w-[min(100%,320px)] sm:w-[min(100%,360px)] md:w-[min(100%,380px)]"
                style={{ scrollSnapAlign: 'start' }}
                aria-label={p.title}
              >
                <article className="h-full min-h-[140px] bg-secondary/50 border border-secondary/10 rounded-sm flex flex-col md:flex-row gap-4 overflow-hidden transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
                  {src && (
                    <div className="relative w-full md:w-36 h-36 shrink-0">
                      <Image
                        src={src}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 320px, 160px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-serif text-xl font-medium text-black group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm text-black/80 line-clamp-3 break-words">
                      {p.short_desc.length > 120 ? `${p.short_desc.slice(0, 120).trim()}…` : p.short_desc}
                    </p>
                    <span className="mt-2 font-sans text-xs text-black/60 group-hover:text-primary transition-colors">
                      {t('servicesSection.more')}
                    </span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
