import React from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchEvents, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const currentLocale = locale as Locale

  let initialServices: Awaited<ReturnType<typeof fetchServices>> = []
  let initialEvents: Awaited<ReturnType<typeof fetchEvents>> = []
  let initialNews: Awaited<ReturnType<typeof fetchNews>> = []
  let initialPromos: Awaited<ReturnType<typeof fetchPromos>> = []
  let initialPortfolio: Awaited<ReturnType<typeof fetchPortfolio>> = []

  try {
    const [services, events, news, promos, portfolio] = await Promise.all([
      fetchServices(currentLocale),
      fetchEvents(currentLocale),
      fetchNews(currentLocale),
      fetchPromos(currentLocale),
      fetchPortfolio(currentLocale),
    ])
    initialServices = services
    initialEvents = events
    initialNews = news
    initialPromos = promos
    initialPortfolio = portfolio
  } catch {
    // leave empty collections if API is unavailable
  }

  return (
    <LocaleProvider
      locale={currentLocale}
      initialServices={initialServices}
      initialEvents={initialEvents}
      initialNews={initialNews}
      initialPromos={initialPromos}
      initialPortfolio={initialPortfolio}
    >
      <AuthProvider>
        <CartProvider>
          <LocaleSetter locale={currentLocale} />
          <Header />
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
