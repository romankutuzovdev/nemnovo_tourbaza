'use client'

import Link from 'next/link'
import { HowToGetThereSection } from '@/components/HowToGetThereSection'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export default function HowToGetPage() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-6 sm:pb-8 max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black"
        >
          ← {t('nav.home')}
        </Link>
      </div>
      <HowToGetThereSection />
    </div>
  )
}
