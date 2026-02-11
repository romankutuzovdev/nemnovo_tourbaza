'use client'

import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { InteractiveMap } from '@/components/InteractiveMap'

export function MapSection() {
  const t = useTranslations()

  return (
    <section id="map" className="py-12 sm:py-16 bg-secondary/30 border-t border-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-sans text-2xl sm:text-3xl font-bold text-black tracking-tight mb-6">
          {t('howToGet.mapTitle') || 'Карта турбазы'}
        </h2>
        <p className="font-sans text-sm text-black/70 mb-6 max-w-2xl">
          {t('howToGet.mapHint') || 'Нажмите на объект, чтобы увеличить изображение'}
        </p>
        <Suspense fallback={<div className="aspect-[4/3] bg-secondary/30 animate-pulse rounded" />}>
          <InteractiveMap />
        </Suspense>
      </div>
    </section>
  )
}
