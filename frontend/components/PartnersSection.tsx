'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'
import { fetchPartners, type PartnerItem } from '@/lib/api'

const SLIDE_DURATION = 5000

export function PartnersSection() {
  const t = useTranslations('partnersSection')
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPartners().then(setPartners).catch(() => setPartners([]))
  }, [])

  const scrollToSlide = useCallback((i: number) => {
    const el = scrollRef.current
    if (!el || !partners.length) return
    const card = el.querySelector('[data-partner-item]') as HTMLElement
    if (!card) return
    const gap = 24
    const cardWidth = card.offsetWidth + gap
    el.scrollTo({ left: i * cardWidth, behavior: 'smooth' })
    setIndex(i)
  }, [partners.length])

  const go = useCallback((delta: number) => {
    if (!partners.length) return
    const next = Math.max(0, Math.min(partners.length - 1, index + delta))
    scrollToSlide(next)
  }, [index, partners.length, scrollToSlide])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !partners.length) return
    const onScroll = () => {
      const card = el.querySelector('[data-partner-item]') as HTMLElement
      if (!card) return
      const gap = 24
      const cardWidth = card.offsetWidth + gap
      const i = Math.round(el.scrollLeft / cardWidth)
      setIndex(Math.min(i, partners.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [partners.length])

  useEffect(() => {
    if (partners.length <= 1) return
    const t = setInterval(() => {
      setIndex((i) => {
        const next = i >= partners.length - 1 ? 0 : i + 1
        setTimeout(() => scrollToSlide(next), 0)
        return next
      })
    }, SLIDE_DURATION)
    return () => clearInterval(t)
  }, [partners.length, scrollToSlide])

  return (
    <section className="pt-10 md:pt-12 pb-5 md:pb-6 bg-secondary/40 border-y border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-primary tracking-tight">
            {t('title')}
          </h2>
        </AnimateOnScroll>

        {partners.length === 0 ? (
          <div className="mt-10 font-sans text-sm text-black/60">{t('loading')}</div>
        ) : (
          <div className="mt-12">
            <div className="relative">
              <div
                ref={scrollRef}
                className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-none flex gap-6 pb-2 -mx-1"
                style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {partners.map((p) => (
                  <div
                    key={p.id}
                    data-partner-item
                    className="min-w-[140px] md:min-w-[180px] shrink-0 snap-start flex flex-col items-center"
                  >
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center w-full"
                      >
                        {p.logo_display ? (
                          <span className="flex items-center justify-center w-[140px] h-[100px] md:w-[180px] md:h-[120px]">
                            <img
                              src={p.logo_display}
                              alt={p.name}
                              className="max-w-full max-h-full w-auto h-auto object-contain"
                            />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-[140px] h-[100px] md:w-[180px] md:h-[120px] font-sans text-sm font-medium text-black/70 text-center">
                            {p.name}
                          </span>
                        )}
                        <span className="mt-3 font-sans text-sm text-black/80 text-center leading-tight">
                          {p.name}
                        </span>
                      </a>
                    ) : (
                      <>
                        {p.logo_display ? (
                          <span className="flex items-center justify-center w-[140px] h-[100px] md:w-[180px] md:h-[120px]">
                            <img
                              src={p.logo_display}
                              alt={p.name}
                              className="max-w-full max-h-full w-auto h-auto object-contain"
                            />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-[140px] h-[100px] md:w-[180px] md:h-[120px] font-sans text-sm font-medium text-black/70 text-center">
                            {p.name}
                          </span>
                        )}
                        <span className="mt-3 font-sans text-sm text-black/80 text-center leading-tight">
                          {p.name}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {partners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white/90 border border-secondary/20 shadow-md flex items-center justify-center text-black/70 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-opacity z-10"
aria-label={t('prevPartner')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= partners.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white/90 border border-secondary/20 shadow-md flex items-center justify-center text-black/70 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-opacity z-10"
            aria-label={t('nextPartner')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <div className="flex justify-center gap-2 mt-6">
                    {partners.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => scrollToSlide(i)}
                        className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-black/80' : 'w-2 bg-black/30 hover:bg-black/50'}`}
                        aria-label={`Партнёр ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
