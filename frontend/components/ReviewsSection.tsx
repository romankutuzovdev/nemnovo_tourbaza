'use client'

import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'

export function ReviewsSection() {
  const t = useTranslations('reviewsSection')

  return (
    <section id="reviews" className="pt-4 md:pt-5 pb-8 md:pb-10 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 items-center justify-items-center text-center text-white">
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {t('distanceValue')}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {t('distanceLabel')}
              </span>
            </div>
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {t('stat1Value')}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {t('stat1Label')}
              </span>
            </div>
            <div>
              <span className="font-sans text-2xl md:text-3xl font-semibold tracking-tight block">
                {t('stat2Value')}
              </span>
              <span className="font-sans text-base leading-relaxed text-white/90 mt-1 block">
                {t('stat2Label')}
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
