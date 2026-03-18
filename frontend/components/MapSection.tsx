'use client'

import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { InteractiveMap } from '@/components/InteractiveMap'
import type { Locale } from '@/lib/i18n'

export function MapSection() {
  const t = useTranslations()
  const locale = useLocale() as Locale

  return (
    <section id="map" className="app-section bg-secondary/30 border-t border-secondary/10">
      <div className="app-container">
        <h2 className="section-title-main text-primary mb-6">
          {t('howToGet.mapTitle') || 'Карта турбазы'}
        </h2>
        <p className="font-sans text-sm text-black/70 mb-6 max-w-2xl">
          {t('howToGet.mapHint') || 'Нажмите на объект, чтобы увеличить изображение'}
        </p>
        <Suspense fallback={<div className="aspect-[4/3] bg-secondary/30 animate-pulse rounded" />}>
          <InteractiveMap locale={locale} />
        </Suspense>
      </div>
    </section>
  )
}
