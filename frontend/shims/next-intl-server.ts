// Серверный shim для `next-intl/server`.
// Важно: без `'use client'`, иначе App Router может падать в dev/prod.

const RU: Record<string, string> = {
  'common.allServices': 'Все услуги',
  'servicesSection.more': 'Подробнее →',
  'servicesSection.inSection': 'В этом разделе',
  'footer.cookiePolicy': 'Политика в отношении обработки cookie',
}

export async function getTranslations(namespace?: string) {
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return RU[fullKey] ?? ''
  }
}

