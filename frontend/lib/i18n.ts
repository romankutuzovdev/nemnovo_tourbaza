export const locales = ['ru', 'be', 'en', 'pl', 'zh'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  be: 'Беларуская',
  en: 'English',
  pl: 'Polski',
  zh: '中文',
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
