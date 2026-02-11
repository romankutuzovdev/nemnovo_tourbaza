/**
 * API бэкенда: контент (услуги, новости). UI-переводы — в frontend/locales (next-intl).
 */

import type { Locale } from './i18n'

const LOCALES: Locale[] = ['ru', 'be', 'en', 'pl', 'zh']

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  return url.replace(/\/$/, '')
}

/** Элемент из /api/services/?locale= */
export type ServiceItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
}

/** Ответ /api/services/<slug>/?locale= */
export type ServiceDetail = ServiceItem & { long_desc: string }

/** Элемент из /api/promos/?locale= */
export type PromoItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
}

/** Ответ /api/promos/<slug>/?locale= */
export type PromoDetail = PromoItem & { long_desc: string }

/** Элемент из /api/portfolio/?locale= */
export type PortfolioItem = {
  slug: string
  image: string | null
  image_url: string
  image_urls: string[]
  event_date: string | null
  order: number
  is_pinned: boolean
  title: string
  description: string
}

/** Деталь мероприятия из /api/portfolio/<slug>/?locale= — с массивом всех фото */
export type PortfolioItemDetail = Omit<PortfolioItem, 'image_urls'> & { images: string[] }

/** Кэш на 60 сек: меньше запросов к бэкенду. После правок в админке — обновите страницу через минуту или перезапустите dev. */
const fetchOpts = { next: { revalidate: 60 } }

export async function fetchServices(locale: Locale): Promise<ServiceItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/services/?locale=${loc}`, fetchOpts)
  if (!res.ok) throw new Error(`Services fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchServiceBySlug(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/services/${encodeURIComponent(slug)}/?locale=${loc}`, fetchOpts)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Service fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchPromos(locale: Locale): Promise<PromoItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/promos/?locale=${loc}`, fetchOpts)
  if (!res.ok) throw new Error(`Promos fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchPromoBySlug(slug: string, locale: Locale): Promise<PromoDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/promos/${encodeURIComponent(slug)}/?locale=${loc}`, fetchOpts)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Promo fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/portfolio/?locale=${loc}`, fetchOpts)
  if (!res.ok) throw new Error(`Portfolio fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchPortfolioItem(slug: string, locale: Locale): Promise<PortfolioItemDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/portfolio/${encodeURIComponent(slug)}/?locale=${loc}`, fetchOpts)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Portfolio item fetch failed: ${res.status}`)
  return res.json()
}

/** Ссылка для скачивания всех фото мероприятия (ZIP) */
export function getPortfolioDownloadUrl(slug: string): string {
  return `${getApiUrl()}/api/portfolio/${encodeURIComponent(slug)}/download/`
}

/** Блок способа из /api/how-to-get/ (на самолёте, автобусе и т.д.) */
export type HowToGetBlockItem = {
  transport_type: string
  title: string
  content: string
}

/** Город из /api/how-to-get/ (Из Минска, Из Москвы и т.д.) */
export type HowToGetCityItem = {
  slug: string
  name: string
  order: number
  blocks: HowToGetBlockItem[]
}

/** Ответ /api/how-to-get/?locale= */
export type HowToGetResponse = {
  cities: HowToGetCityItem[]
  address: string
  gps_lat: number | null
  gps_lon: number | null
}

export async function fetchHowToGet(locale: Locale): Promise<HowToGetResponse> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await fetch(`${getApiUrl()}/api/how-to-get/?locale=${loc}`, fetchOpts)
  if (!res.ok) throw new Error(`How-to-get fetch failed: ${res.status}`)
  return res.json()
}

/** Элемент из /api/partners/ */
export type PartnerItem = {
  id: number
  name: string
  logo_display: string | null
  link: string
  order: number
}

export async function fetchPartners(): Promise<PartnerItem[]> {
  const res = await fetch(`${getApiUrl()}/api/partners/`, fetchOpts)
  if (!res.ok) throw new Error(`Partners fetch failed: ${res.status}`)
  return res.json()
}

/** Реквизиты компании для футера (GET /api/company-info/) */
export type CompanyInfo = {
  company_name: string
  legal_address: string
  office_address: string
  unp: string
  okpo: string
  trade_register: string
  services_register: string
  contact_email: string
}

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const res = await fetch(`${getApiUrl()}/api/company-info/`, fetchOpts)
  if (!res.ok) throw new Error(`Company info fetch failed: ${res.status}`)
  return res.json()
}

/** Отправка формы контакта (заявка или претензия). Тестово письма уходят на один ящик. */
export type ContactFormType = 'main' | 'complaint'

export async function sendContactForm(
  type: ContactFormType,
  payload: { name: string; email: string; message: string }
): Promise<{ ok: true } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { error?: string }).error || `Ошибка ${res.status}` }
  if ((data as { ok?: boolean }).ok) return { ok: true }
  return { error: (data as { error?: string }).error || 'Неизвестная ошибка' }
}
