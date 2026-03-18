import React from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchEvents, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

const LOCALE = 'ru' as const

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Немново — Близкая. Незнакомая. Беларусь.',
  description: 'Турбаза в Беларуси. Создавайте яркие воспоминания вместе с нами. Услуги, фотоотчёты, как добраться.',
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale(LOCALE)

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

  const messages = (await import(`@/locales/${LOCALE}/common.json`)).default

  return (
    <NextIntlClientProvider key={LOCALE} locale={LOCALE} messages={messages}>
      <LocaleProvider
        locale={LOCALE}
        initialServices={initialServices}
        initialEvents={initialEvents}
        initialNews={initialNews}
        initialPromos={initialPromos}
        initialPortfolio={initialPortfolio}
      >
        <AuthProvider>
          <LocaleSetter locale={LOCALE} />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <HotOfferPopup />
        </AuthProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  )
}
