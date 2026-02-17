'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { sendContactForm } from '@/lib/api'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function ContactFormModal({ isOpen, onClose }: Props) {
  const t = useTranslations('contact')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  async function handleSubmit(form: HTMLFormElement) {
    setError(null)
    setLoading(true)
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? ''
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim() ?? ''
    const message = (form.querySelector('[name="message"]') as HTMLInputElement)?.value?.trim() ?? ''
    const result = await sendContactForm('main', { name, email, message })
    setLoading(false)
    if ('ok' in result && result.ok) {
      setSent(true)
    } else {
      setError(('error' in result ? result.error : null) ?? t('sendError'))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-black/60 hover:text-black transition-colors"
          aria-label={t('close')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 md:p-8">
          <h2 id="modal-title" className="font-serif text-xl md:text-2xl font-medium text-black tracking-tight pr-10 mb-6">
            {t('formMain')}
          </h2>
          {sent ? (
            <p className="font-sans text-black/80">{t('thanks')}</p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(e.currentTarget)
              }}
              action="#"
              method="post"
            >
              <input type="hidden" name="_to" value="office@nemnovotour.by" />
              <div>
                <label htmlFor="modal-name" className="block font-sans text-sm text-black/80 mb-1">
                  {t('nameLabel')}
                </label>
                <input
                  id="modal-name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/60 focus:outline-none focus:border-secondary/50"
                  placeholder={t('namePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="modal-email" className="block font-sans text-sm text-black/80 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/60 focus:outline-none focus:border-secondary/50"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="modal-msg" className="block font-sans text-sm text-black/80 mb-1">
                  {t('messageLabel')}
                </label>
                <textarea
                  id="modal-msg"
                  name="message"
                  rows={3}
                  className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/60 focus:outline-none focus:border-secondary/50 resize-none"
                  placeholder={t('messagePlaceholder')}
                />
              </div>
              {error && <p className="font-sans text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? t('sending') : t('send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
