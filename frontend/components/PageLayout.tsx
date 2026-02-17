'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export const PAGE_CONTAINER = 'max-w-6xl mx-auto px-4 sm:px-6'
// На мобильных хедер выше (полоса с адресом + навбар), чтобы «Главная» не залазила под него
export const PAGE_TOP = 'pt-32 md:pt-24 pb-10'

type PageLayoutProps = {
  children: React.ReactNode
  /** Uppercase badge above title */
  badge?: string
  /** Main page title (h1) */
  title?: string
  /** Optional description under title */
  description?: string
  /** Title in primary color */
  titlePrimary?: boolean
  /** Extra class for the header (e.g. pt-32 for more top spacing) */
  headerClassName?: string
}

export function PageLayout({ children, badge, title, description, titlePrimary, headerClassName }: PageLayoutProps) {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <div className="min-h-screen">
      <header className={`${PAGE_TOP} ${PAGE_CONTAINER} ${headerClassName ?? ''}`}>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors"
        >
          ← {t('nav.home')}
        </Link>
        {title != null && (
          <h1
            className={`font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-2xl ${
              titlePrimary ? 'text-primary' : 'text-black'
            }`}
          >
            {title}
          </h1>
        )}
        {description != null && (
          <p className="mt-4 font-sans text-black/80 max-w-xl">{description}</p>
        )}
      </header>
      {children}
    </div>
  )
}
