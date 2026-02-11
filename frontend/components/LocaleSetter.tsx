'use client'

import { useEffect } from 'react'
import type { Locale } from '@/lib/i18n'

const localeToLang: Record<Locale, string> = {
  ru: 'ru',
  be: 'be',
  en: 'en',
  pl: 'pl',
  zh: 'zh',
}

export function LocaleSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = localeToLang[locale as Locale] ?? 'ru'
  }, [locale])
  return null
}
