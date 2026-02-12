'use client'

import Link from 'next/link'
import { ReviewsListSection } from '@/components/ReviewsListSection'
import { ComplaintFormSection } from '@/components/ComplaintFormSection'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export default function ReviewsPage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-8 max-w-6xl mx-auto px-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black"
        >
          ← {t('nav.home')}
        </Link>
        <p className="font-sans text-base tracking-[0.2em] uppercase text-black/80 mt-6 mb-2">
          {t('reviewsSection.badge')}
        </p>
        <h1 className="font-sans text-xl md:text-2xl lg:text-3xl font-medium text-black tracking-tight max-w-2xl">
          {t('reviewsSection.title')}
        </h1>
      </div>
      <ReviewsListSection />
      <ComplaintFormSection />
    </div>
  )
}
