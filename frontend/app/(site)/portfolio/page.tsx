'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PortfolioSection } from '@/components/PortfolioSection'

export default function PortfolioPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary/20">
      <header className="pt-20 md:pt-20 pb-6 md:pb-8 max-w-6xl mx-auto px-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors mb-4"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary tracking-tight max-w-2xl">
          {t('portfolioSection.title')}
        </h1>
      </header>
      <PortfolioSection hideTitle />
    </div>
  )
}
