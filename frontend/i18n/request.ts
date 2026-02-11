import { getRequestConfig } from 'next-intl/server'
import { isValidLocale, type Locale } from '@/lib/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (typeof requestLocale === 'string' && isValidLocale(requestLocale)
    ? requestLocale
    : 'ru') as Locale
  const messages = (await import(`@/locales/${locale}/common.json`)).default
  return { locale, messages }
})
