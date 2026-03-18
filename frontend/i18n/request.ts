import { getRequestConfig } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

const LOCALE: Locale = 'ru'

export default getRequestConfig(async () => {
  const messages = (await import(`@/locales/${LOCALE}/common.json`)).default
  return { locale: LOCALE, messages }
})
