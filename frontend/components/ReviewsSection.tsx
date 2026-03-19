'use client'

import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'
import type { ReviewsStatsContent } from '@/lib/api'

interface ReviewsSectionProps {
  statsContent?: ReviewsStatsContent | null
}

export function ReviewsSection({ statsContent }: ReviewsSectionProps) {
  const t = useTranslations('reviewsSection')
  const distanceValue = statsContent?.distance_value || t('distanceValue')
  const distanceLabel = statsContent?.distance_label || t('distanceLabel')
  const stat1Value = statsContent?.stat1_value || t('stat1Value')
  const stat1Label = statsContent?.stat1_label || t('stat1Label')
  const stat2Value = statsContent?.stat2_value || t('stat2Value')
  const stat2Label = statsContent?.stat2_label || t('stat2Label')

  return (
    <section id="reviews" className="app-section bg-primary">
      <div className="app-container">
        <AnimateOnScroll variant="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 items-center justify-items-center text-center text-white">
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {distanceValue}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {distanceLabel}
              </span>
            </div>
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {stat1Value}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {stat1Label}
              </span>
            </div>
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {stat2Value}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {stat2Label}
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
