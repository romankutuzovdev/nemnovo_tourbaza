'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'
import { fetchReviews, type ReviewItem } from '@/lib/api'

const MAX_STARS = 5

const TRUNCATE_CHARS = 120

function ReviewText({ text, expanded, onToggle }: { text: string; expanded: boolean; onToggle: () => void }) {
  const t = useTranslations('reviewsSection')
  const needsExpand = text.length > TRUNCATE_CHARS
  return (
    <div className="min-w-0 overflow-hidden flex-1 flex flex-col">
      <p
        className={`font-sans text-black/80 leading-relaxed break-words whitespace-normal max-w-full text-justify hyphens-auto ${!expanded && needsExpand ? 'line-clamp-4' : ''}`}
      >
        &ldquo;{text}&rdquo;
      </p>
      {needsExpand && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          className="mt-2 font-sans text-sm text-primary hover:text-primary/80 self-start"
        >
          {expanded ? t('collapse') : t('expand')}
        </button>
      )}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  const value = Math.max(1, Math.min(MAX_STARS, Math.round(rating)))
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} из ${MAX_STARS}`}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span
          key={i}
          className={i < value ? 'text-amber-500' : 'text-black/20'}
          aria-hidden
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 font-sans text-sm text-black/70 tabular-nums">
        {value} из {MAX_STARS}
      </span>
    </span>
  )
}

export function ReviewsSection() {
  const t = useTranslations('reviewsSection')
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const toggleExpand = useCallback((id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchReviews()
      .then((data) => { if (!cancelled) setReviews(data) })
      .catch(() => { if (!cancelled) setReviews([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

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
        {loading ? (
          <p className="font-sans text-black/60">{t('loading')}</p>
        ) : reviews.length === 0 ? (
          <p className="font-sans text-black/60">{t('noReviews')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <AnimateOnScroll key={r.id} variant="fade-up" delay={i * 50}>
                <blockquote className="h-full min-h-[200px] p-6 bg-white/80 border border-secondary/10 rounded-sm transition-all duration-300 hover:border-secondary/20 hover:shadow-md flex flex-col">
                  <div className="mb-3 shrink-0">
                    <StarRating rating={r.rating} />
                  </div>
                  <ReviewText
                    text={r.text}
                    expanded={!!expanded[r.id]}
                    onToggle={() => toggleExpand(r.id)}
                  />
                  <cite className="mt-4 block font-sans text-sm text-black not-italic shrink-0">{r.author}</cite>
                </blockquote>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
