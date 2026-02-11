'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { requestPasswordReset } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const locale = useLocale()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await requestPasswordReset(email)
    setLoading(false)
    if ('ok' in result && result.ok) setSent(true)
    else setError(('error' in result ? result.error : null) ?? 'Ошибка')
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6">
        <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10">
          ← {t('backToLogin')}
        </Link>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('forgotTitle')}</h1>
        {sent ? (
          <p className="mt-6 font-sans text-black/80">{t('successReset')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="font-sans text-sm text-black/80">{t('forgotIntro')}</p>
            <div>
              <label htmlFor="email" className="block font-sans text-sm text-black/80 mb-1">{t('email')}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50"
                placeholder="email@example.com"
              />
            </div>
            {error && <p className="font-sans text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 disabled:opacity-60">
              {t('submitReset')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
