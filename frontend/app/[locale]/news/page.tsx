'use client'

import { useTranslations } from 'next-intl'
import { PageLayout } from '@/components/PageLayout'

export default function NewsPage() {
  const t = useTranslations()

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-black/80 mb-4">
            {t('nav.news')}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight max-w-2xl">
            {t('nav.news')}
          </h1>
          <p className="mt-4 font-sans text-black/80 max-w-xl">
            {t('news.placeholder')}
          </p>
        </div>
      </section>
    </PageLayout>
  )
}
