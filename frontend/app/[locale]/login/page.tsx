'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')
  const { loginSuccess, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    router.replace(`/${locale}/cabinet`)
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await login({ username: email, password })
    setLoading(false)
    if ('ok' in result && result.ok) {
      loginSuccess(result.data)
      router.replace(`/${locale}/cabinet`)
    } else {
      setError(('error' in result ? result.error : null) ?? 'Ошибка')
    }
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10">
          ← {tNav('home')}
        </Link>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('loginTitle')}</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          <div>
            <label htmlFor="password" className="block font-sans text-sm text-black/80 mb-1">{t('password')}</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50"
              placeholder={t('passwordPlaceholder')}
            />
          </div>
          {error && <p className="font-sans text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 disabled:opacity-60"
          >
            {t('submit')}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2">
          <Link href={`/${locale}/forgot-password`} className="font-sans text-sm text-black/70 hover:text-black">
            {t('forgotTitle')}
          </Link>
          <p className="font-sans text-sm text-black/70">
            {t('noAccount')} <Link href={`/${locale}/register`} className="text-primary hover:underline">{tNav('register')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
