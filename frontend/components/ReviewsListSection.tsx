'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'
import { fetchReviews, type ReviewItem } from '@/lib/api'

const MAX_STARS = 5
const TRUNCATE_CHARS = 120

function ReviewText({
  text,
  expanded,
  onToggle,
}: {
  text: string
  expanded: boolean
  onToggle: () => void
}) {
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
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
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

type ReviewsListSectionProps = { scrollable?: boolean }

export function ReviewsListSection({ scrollable }: ReviewsListSectionProps) {
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
      .then((data) => {
        if (!cancelled) setReviews(data)
      })
      .catch(() => {
        if (!cancelled) setReviews([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="reviews-list">
      <div>
        {loading ? (
          <p className="font-sans text-black/60">{t('loading')}</p>
        ) : reviews.length === 0 ? (
          <p className="font-sans text-black/60">{t('noReviews')}</p>
        ) : (
          <div
            className={`gap-6 ${scrollable ? 'flex flex-col max-h-[min(70vh,720px)] overflow-y-auto pr-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
          >
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
                  <cite className="mt-4 block font-sans text-sm text-black not-italic shrink-0">
                    {r.author}
                  </cite>
                </blockquote>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
