'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export default function PrivacyPage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <Link
        href={`/${locale}`}
        className="font-sans text-sm text-black/80 hover:text-black mb-12 inline-block"
      >
        ← {t('privacy.back')}
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">
        {t('privacy.title')}
      </h1>
      <div className="mt-12 font-sans text-black/80 leading-relaxed space-y-6">
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p>{t('privacy.p4')}</p>
      </div>
    </div>
  )
}
