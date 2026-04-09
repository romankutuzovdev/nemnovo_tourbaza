// Серверный shim для `next-intl/server`.
// Важно: без `'use client'`, иначе App Router может падать в dev/prod.

import ruMessages from '@/locales/ru/common.json'

type Messages = Record<string, unknown>

function getMessage(messages: Messages, fullKey: string): string {
  const parts = fullKey.split('.').filter(Boolean)
  let cur: unknown = messages
  for (const p of parts) {
    if (typeof cur !== 'object' || cur === null) return ''
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : ''
}

export async function getTranslations(namespace?: string) {
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return getMessage(ruMessages as Messages, fullKey)
  }
}

