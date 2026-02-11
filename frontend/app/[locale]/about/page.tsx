'use client'

import Link from 'next/link'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export default function AboutPage() {
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
      <AboutSection />
      <VideoSection />
    </div>
  )
}
