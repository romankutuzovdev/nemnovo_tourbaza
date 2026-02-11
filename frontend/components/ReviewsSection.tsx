'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'

const SLIDE_DURATION = 5000
const REVIEWS_COUNT = 7

export function ReviewsSection() {
  const t = useTranslations('reviewsSection')
  const reviews = useMemo(() => Array.from({ length: REVIEWS_COUNT }, (_, i) => ({
    text: t(`reviews.${i}.text`),
    author: t(`reviews.${i}.author`),
  })), [t])
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToSlide = useCallback((i: number) => {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector('[data-review-card]') as HTMLElement
    if (!card) return
    const gap = 32
    const cardWidth = card.offsetWidth + gap
    el.scrollTo({ left: i * cardWidth, behavior: 'smooth' })
    setIndex(i)
  }, [])

  const go = useCallback((delta: number) => {
    const next = Math.max(0, Math.min(reviews.length - 1, index + delta))
    scrollToSlide(next)
  }, [index, scrollToSlide])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const card = el.querySelector('[data-review-card]') as HTMLElement
      if (!card) return
      const gap = 32
      const cardWidth = card.offsetWidth + gap
      const i = Math.round(el.scrollLeft / cardWidth)
      setIndex(Math.min(i, reviews.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => {
        const next = i >= reviews.length - 1 ? 0 : i + 1
        setTimeout(() => scrollToSlide(next), 0)
        return next
      })
    }, SLIDE_DURATION)
    return () => clearInterval(t)
  }, [scrollToSlide])

  return (
    <section id="reviews" className="pt-12 md:pt-16 pb-24 md:pb-32 bg-secondary/40 border-y border-secondary/10">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-base tracking-[0.2em] uppercase text-black/80 mb-4">
            {t('badge')}
          </p>
          <h2 className="font-sans text-xl md:text-2xl lg:text-3xl font-medium text-black tracking-tight max-w-2xl">
            {t('title')}
          </h2>
        </AnimateOnScroll>
      </div>
      <div className="mt-12 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
        <AnimateOnScroll variant="fade-up" delay={0} className="flex justify-start md:justify-start">
          <div className="transition-transform duration-300 hover:scale-[1.02] text-left">
            <span className="font-sans text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight">{t('distanceValue')}</span>
            <span className="block font-sans text-sm md:text-base text-black/90 mt-2 leading-snug">{t('distanceLabel')}</span>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll variant="fade-up" delay={80} className="flex justify-center">
          <div className="transition-transform duration-300 hover:scale-[1.02] text-center">
            <span className="font-sans text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight">{t('stat1Value')}</span>
            <span className="block font-sans text-sm md:text-base text-black/90 mt-2 leading-snug">{t('stat1Label')}</span>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll variant="fade-up" delay={160} className="flex justify-end md:justify-end">
          <div className="transition-transform duration-300 hover:scale-[1.02] text-right">
            <span className="font-sans text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight">{t('stat2Value')}</span>
            <span className="block font-sans text-sm md:text-base text-black/90 mt-2 leading-snug">{t('stat2Label')}</span>
          </div>
        </AnimateOnScroll>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-none flex gap-8 pb-2 -mx-1"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {reviews.map((r, i) => (
              <div
                key={i}
                data-review-card
                className="min-w-[calc(100%-2rem)] md:min-w-[calc(50%-1rem)] shrink-0 snap-start"
              >
                <blockquote className="h-full p-8 bg-white/80 border border-secondary/10 rounded-sm transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
                  <p className="font-sans text-black/80 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <cite className="mt-4 block font-sans text-sm text-black not-italic">{r.author}</cite>
                </blockquote>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white/90 border border-secondary/20 shadow-md flex items-center justify-center text-black/70 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-opacity z-10"
            aria-label={t('prevReview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= reviews.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white/90 border border-secondary/20 shadow-md flex items-center justify-center text-black/70 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-opacity z-10"
            aria-label={t('nextReview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSlide(i)}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-black/80' : 'w-2 bg-black/30 hover:bg-black/50'}`}
                aria-label={`${t('badge')} ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
