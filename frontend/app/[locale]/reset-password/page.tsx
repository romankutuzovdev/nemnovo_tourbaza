'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { confirmPasswordReset } from '@/lib/auth'

function ResetPasswordForm() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUid(searchParams.get('uid') ?? '')
    setToken(searchParams.get('token') ?? '')
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await confirmPasswordReset({ uid, token, new_password: password, new_password_confirm: passwordConfirm })
    setLoading(false)
    if ('ok' in result && result.ok) setSuccess(true)
    else setError(('error' in result ? result.error : null) ?? 'Ошибка')
  }

  if (!uid || !token) {
    return (
      <div className="pt-24 pb-24 min-h-screen bg-white">
        <div className="max-w-md mx-auto px-6">
          <p className="font-sans text-black/80">Недействительная ссылка. Запросите сброс пароля заново.</p>
          <Link href={`/${locale}/forgot-password`} className="mt-4 inline-block font-sans text-sm text-primary hover:underline">{t('forgotTitle')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6">
        <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10">
          ← {t('backToLogin')}
        </Link>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('resetTitle')}</h1>
        {success ? (
          <>
            <p className="mt-6 font-sans text-black/80">{t('successChange')}</p>
            <Link href={`/${locale}/login`} className="mt-4 inline-block font-sans text-sm text-primary hover:underline">{t('backToLogin')}</Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="font-sans text-sm text-black/80">{t('resetIntro')}</p>
            <div>
              <label htmlFor="password" className="block font-sans text-sm text-black/80 mb-1">{t('newPassword')}</label>
              <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" placeholder={t('passwordPlaceholder')} />
            </div>
            <div>
              <label htmlFor="password_confirm" className="block font-sans text-sm text-black/80 mb-1">{t('passwordConfirm')}</label>
              <input id="password_confirm" type="password" required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" placeholder={t('passwordConfirm')} />
            </div>
            {error && <p className="font-sans text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 disabled:opacity-60">{t('submitChange')}</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-24 min-h-screen bg-white"><div className="max-w-md mx-auto px-6">Загрузка…</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
