'use client'

import { Suspense } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { HowToGetThereSection } from '@/components/HowToGetThereSection'
import { InteractiveMap } from '@/components/InteractiveMap'
import { useTranslations } from 'next-intl'

export default function HowToGetPage() {
  const t = useTranslations()

  return (
    <PageLayout simpleHomeLink hideBreadcrumbs>
      <HowToGetThereSection />
      <section className="pt-6 md:pt-8 pb-3 md:pb-4 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight mb-4">
          {t('howToGet.mapTitle') || 'Карта турбазы'}
        </h2>
        <p className="font-sans text-sm text-black/70 mb-6 max-w-2xl">
          {t('howToGet.mapHint') || 'Нажмите на объект, чтобы увеличить изображение'}
        </p>
        <Suspense fallback={<div className="aspect-[4/3] bg-secondary/30 animate-pulse rounded" />}>
          <InteractiveMap />
        </Suspense>
      </section>
    </PageLayout>
  )
}
