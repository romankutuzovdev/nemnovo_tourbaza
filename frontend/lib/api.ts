/**
 * API бэкенда: контент (услуги, новости). UI-переводы — в frontend/locales (next-intl).
 */

import type { Locale } from './i18n'

const LOCALES: Locale[] = ['ru', 'be', 'en', 'pl', 'zh']

export function getApiUrl(): string {
  const url = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').trim()
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

/** Элемент из /api/events/?locale= */
export type EventItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
}

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

const API_TIMEOUT = 15000 // 15 сек

async function apiFetch(url: string): Promise<Response | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT)
  try {
    const res = await fetch(url, { cache: 'no-store' as RequestCache, signal: controller.signal })
    return res
  } catch {
    return null // таймаут, сеть, и т.д.
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchServices(locale: Locale): Promise<ServiceItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/services/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchServiceBySlug(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/services/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

export async function fetchEvents(locale: Locale): Promise<EventItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/events/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPromos(locale: Locale): Promise<PromoItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/promos/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPromoBySlug(slug: string, locale: Locale): Promise<PromoDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/promos/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

export async function fetchPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/portfolio/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPortfolioItem(slug: string, locale: Locale): Promise<PortfolioItemDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/portfolio/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
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

const DEFAULT_HOW_TO_GET: HowToGetResponse = { cities: [], address: '', gps_lat: null, gps_lon: null }

export async function fetchHowToGet(locale: Locale): Promise<HowToGetResponse> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/how-to-get/?locale=${loc}`)
  if (!res?.ok) return DEFAULT_HOW_TO_GET
  return res.json().catch(() => DEFAULT_HOW_TO_GET)
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
  const res = await apiFetch(`${getApiUrl()}/api/partners/`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

/** Отзыв из /api/reviews/ (для главной, с оценкой 1–5) */
export type ReviewItem = {
  id: number
  author: string
  text: string
  rating: number
  order: number
}

export async function fetchReviews(): Promise<ReviewItem[]> {
  const res = await apiFetch(`${getApiUrl()}/api/reviews/`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

/** Реквизиты компании для футера (GET /api/company-info/) */
export type CompanyInfo = {
  company_name: string
  legal_address: string
  office_address: string
  unp: string
  okpo: string
  state_registration?: string
  trade_register: string
  services_register: string
  contact_email: string
}

export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  const res = await apiFetch(`${getApiUrl()}/api/company-info/`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
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
