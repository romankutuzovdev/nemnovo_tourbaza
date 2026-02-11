'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { register } from '@/lib/auth'

export default function RegisterPage() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')
  const { loginSuccess, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', password_confirm: '' })
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
    const result = await register(form)
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
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('registerTitle')}</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block font-sans text-sm text-black/80 mb-1">{t('email')}</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" placeholder="email@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block font-sans text-sm text-black/80 mb-1">{t('password')}</label>
            <input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" placeholder={t('passwordPlaceholder')} />
          </div>
          <div>
            <label htmlFor="password_confirm" className="block font-sans text-sm text-black/80 mb-1">{t('passwordConfirm')}</label>
            <input id="password_confirm" type="password" required value={form.password_confirm} onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" placeholder={t('passwordConfirm')} />
          </div>
          {error && <p className="font-sans text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 disabled:opacity-60">{t('submitRegister')}</button>
        </form>
        <p className="mt-6 font-sans text-sm text-black/70">
          {t('hasAccount')} <Link href={`/${locale}/login`} className="text-primary hover:underline">{tNav('login')}</Link>
        </p>
      </div>
    </div>
  )
}
