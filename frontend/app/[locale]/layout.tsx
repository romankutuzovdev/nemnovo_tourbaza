import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchEvents, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'be' }, { locale: 'en' }, { locale: 'pl' }, { locale: 'zh' }]
}

export const metadata: Metadata = {
  title: 'Немново — Близкая. Незнакомая. Беларусь.',
  description: 'Турбаза в Беларуси. Создавайте яркие воспоминания вместе с нами. Услуги, фотоотчёты, как добраться.',
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const loc = locale as Locale
  setRequestLocale(loc)

  let initialServices: Awaited<ReturnType<typeof fetchServices>> = []
  let initialEvents: Awaited<ReturnType<typeof fetchEvents>> = []
  let initialNews: Awaited<ReturnType<typeof fetchNews>> = []
  let initialPromos: Awaited<ReturnType<typeof fetchPromos>> = []
  let initialPortfolio: Awaited<ReturnType<typeof fetchPortfolio>> = []
  try {
    const [services, events, news, promos, portfolio] = await Promise.all([
      fetchServices(loc),
      fetchEvents(loc),
      fetchNews(loc),
      fetchPromos(loc),
      fetchPortfolio(loc),
    ])
    initialServices = services
    initialEvents = events
    initialNews = news
    initialPromos = promos
    initialPortfolio = portfolio
  } catch {
    // leave empty
  }

  const messages = (await import(`@/locales/${loc}/common.json`)).default

  return (
    <NextIntlClientProvider key={loc} locale={loc} messages={messages}>
      <LocaleProvider
        locale={loc}
        initialServices={initialServices}
        initialEvents={initialEvents}
        initialNews={initialNews}
        initialPromos={initialPromos}
        initialPortfolio={initialPortfolio}
      >
        <AuthProvider>
        <LocaleSetter locale={locale} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        </AuthProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  )
}
