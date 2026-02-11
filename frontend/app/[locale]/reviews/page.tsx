'use client'

import Link from 'next/link'
import { ReviewsSection } from '@/components/ReviewsSection'
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
      </div>
      <ReviewsSection />
      <ComplaintFormSection />
    </div>
  )
}
