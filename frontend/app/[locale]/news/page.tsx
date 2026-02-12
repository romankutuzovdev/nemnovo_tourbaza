'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export default function NewsPage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-medium text-primary">
          {t('nav.news')}
        </h1>
        <p className="mt-4 font-sans text-black/80">
          {t('news.placeholder')}
        </p>
      </div>
    </div>
  )
}
