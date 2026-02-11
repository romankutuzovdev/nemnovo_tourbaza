'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

const COOKIE_CONSENT_KEY = 'nemnovo-cookie-consent'

export function CookieBanner() {
  const locale = useLocale()
  const t = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-secondary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] animate-slide-up-soft"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-sans text-sm text-black/80">
          {t('cookie.text')}{' '}
          <Link href={`/${locale}/privacy`} className="text-black underline hover:no-underline">
            {t('cookie.link')}
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]"
        >
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  )
}
