import React from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchEvents, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

const LOCALE = 'ru' as const

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Немново — Близкая. Незнакомая. Беларусь.',
    template: '%s | Немново',
  },
  description: 'Турбаза в Беларуси. Создавайте яркие воспоминания вместе с нами. Услуги, фотоотчёты, как добраться.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let initialServices: Awaited<ReturnType<typeof fetchServices>> = []
  let initialEvents: Awaited<ReturnType<typeof fetchEvents>> = []
  let initialNews: Awaited<ReturnType<typeof fetchNews>> = []
  let initialPromos: Awaited<ReturnType<typeof fetchPromos>> = []
  let initialPortfolio: Awaited<ReturnType<typeof fetchPortfolio>> = []
  try {
    const [services, events, news, promos, portfolio] = await Promise.all([
      fetchServices(LOCALE),
      fetchEvents(LOCALE),
      fetchNews(LOCALE),
      fetchPromos(LOCALE),
      fetchPortfolio(LOCALE),
    ])
    initialServices = services
    initialEvents = events
    initialNews = news
    initialPromos = promos
    initialPortfolio = portfolio
  } catch {
    // leave empty
  }

  return (
    <LocaleProvider
      locale={LOCALE}
      initialServices={initialServices}
      initialEvents={initialEvents}
      initialNews={initialNews}
      initialPromos={initialPromos}
      initialPortfolio={initialPortfolio}
    >
      <AuthProvider>
        <CartProvider>
          <LocaleSetter locale={LOCALE} />
          <Header />
          {/* Spacer под фиксированный хедер (как в tourfirma_nemnovo) */}
          <div className="shrink-0 header-spacer h-[6.25rem] sm:h-[6.75rem] md:h-[7rem] lg:h-[7.75rem]" aria-hidden />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <HotOfferPopup />
        </CartProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}
