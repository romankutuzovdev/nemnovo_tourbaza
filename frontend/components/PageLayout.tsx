'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export const PAGE_CONTAINER = 'max-w-6xl mx-auto px-4 sm:px-6'
// На мобильных отступ больше (хедер выше), на десктопе — меньше. pb единый под заголовок страницы.
export const PAGE_TOP = 'pt-40 md:pt-24 pb-6 md:pb-8'

/** Сегмент пути → ключ перевода (nav.* или footer.legal.*) */
const SEGMENT_TO_KEY: Record<string, string> = {
  about: 'nav.about',
  services: 'nav.services',
  portfolio: 'nav.portfolio',
  promos: 'nav.promos',
  news: 'nav.news',
  events: 'nav.events',
  'how-to-get': 'nav.howToGet',
  reviews: 'nav.reviews',
  contact: 'nav.contact',
  agencies: 'nav.agencies',
  'cookie-policy': 'footer.cookiePolicy',
  privacy: 'footer.privacy',
}

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
  /** Hide breadcrumbs (e.g. for portfolio, promos) */
  hideBreadcrumbs?: boolean
  /** Simple home link like on news page (text link, same spacing) */
  simpleHomeLink?: boolean
  /** Больше верхнего отступа, чтобы ссылка «назад» не заходила под хедер */
  moreTopPadding?: boolean
}

function pathSegments(pathname: string, locale: string): string[] {
  const prefix = `/${locale}`
  const path = pathname === prefix || pathname.startsWith(prefix + '/')
    ? pathname.slice(prefix.length) || ''
    : ''
  return path ? path.split('/').filter(Boolean) : []
}

export function PageLayout({ children, badge, title, description, titlePrimary, headerClassName, hideBreadcrumbs, simpleHomeLink, moreTopPadding }: PageLayoutProps) {
  const locale = useLocale()
  const pathname = usePathname() ?? ''
  const t = useTranslations()
  const segments = pathSegments(pathname, locale)

  const breadcrumbs: { href: string; label: string }[] = []
  let acc = `/${locale}`
  breadcrumbs.push({ href: acc, label: t('nav.home') })
  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`
    const key = SEGMENT_TO_KEY[segments[i]]
    const label = key ? t(key) : (i === segments.length - 1 && title ? title : segments[i])
    breadcrumbs.push({ href: acc, label })
  }

  const headerSpacing = simpleHomeLink
    ? (moreTopPadding ? 'pt-44 md:pt-32 pb-6 md:pb-8' : 'pt-40 md:pt-24 pb-6 md:pb-8')
    : undefined

  return (
    <div className="min-h-screen">
      <header className={`${headerSpacing ?? PAGE_TOP} ${PAGE_CONTAINER} ${headerClassName ?? ''}`}>
        <nav className={simpleHomeLink ? undefined : 'flex flex-col gap-3 md:gap-4'} aria-label={hideBreadcrumbs ? undefined : 'Breadcrumb'}>
          <Link
            href={`/${locale}`}
            className={
              simpleHomeLink
                ? 'lg:hidden inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors'
                : 'lg:hidden self-start inline-flex items-center gap-2 font-sans text-sm font-medium px-3 py-2 rounded-lg border border-secondary/30 text-black/80 hover:text-black hover:border-secondary/50 hover:bg-secondary/5 transition-colors'
            }
          >
            <span aria-hidden>←</span>
            {t('nav.home')}
          </Link>
          {!hideBreadcrumbs && (
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-black/70">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-secondary/50" aria-hidden>/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-black" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-black transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          )}
        </nav>
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
