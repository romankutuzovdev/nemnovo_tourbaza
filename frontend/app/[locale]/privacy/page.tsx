'use client'

import { useTranslations } from 'next-intl'
import { PageLayout } from '@/components/PageLayout'

export default function PrivacyPage() {
  const t = useTranslations()

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight mb-8">
            {t('privacy.title')}
          </h1>
          <div className="font-sans text-black/80 leading-relaxed space-y-6">
            <p>{t('privacy.p1')}</p>
            <p>{t('privacy.p2')}</p>
            <p>{t('privacy.p3')}</p>
            <p>{t('privacy.p4')}</p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
