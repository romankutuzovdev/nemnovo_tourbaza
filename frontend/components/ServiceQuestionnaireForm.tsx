'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendServiceQuestionnaire } from '@/lib/api'
import type { ServiceQuestion } from '@/lib/api'

type Props = {
  serviceSlug: string
  questions: ServiceQuestion[]
}

export function ServiceQuestionnaireForm({ serviceSlug, questions }: Props) {
  const t = useTranslations()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? ''
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim() ?? ''
    const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim() ?? ''
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value?.trim() ?? ''
    const result = await sendServiceQuestionnaire(serviceSlug, { name, email, phone, message, answers: {} })
    setLoading(false)
    if ('ok' in result && result.ok) {
      setSent(true)
    } else {
      setError(('error' in result ? result.error : null) ?? t('contact.sendError'))
    }
  }

  if (sent) {
    return (
      <div className="mt-12 p-6 md:p-8 rounded-xl bg-primary/10 border border-primary/20">
        <p className="font-sans text-lg text-primary font-medium">{t('contact.thanks')}</p>
      </div>
    )
  }

  void questions

  return (
    <div className="mt-12">
      <h2 className="font-serif text-xl md:text-2xl font-medium text-black/90 mb-6">
        {t('servicesSection.questionnaire')}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="q-name" className="block font-sans text-sm font-medium text-black/80 mb-1">
            {t('contact.nameLabel')}*
          </label>
          <input
            id="q-name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder={t('contact.namePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="q-phone" className="block font-sans text-sm font-medium text-black/80 mb-1">
            {t('contact.phoneLabel')}*
          </label>
          <input
            id="q-phone"
            name="phone"
            type="tel"
            required
            className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder={t('contact.phonePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="q-email" className="block font-sans text-sm font-medium text-black/80 mb-1">
            {t('contact.emailLabel')}
          </label>
          <input
            id="q-email"
            name="email"
            type="email"
            className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder={t('contact.emailPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="q-message" className="block font-sans text-sm font-medium text-black/80 mb-1">
            {t('contact.messageLabel')}*
          </label>
          <textarea
            id="q-message"
            name="message"
            rows={4}
            required
            className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            placeholder={t('contact.messagePlaceholder')}
          />
        </div>
        {error && (
          <p className="font-sans text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white font-sans text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {loading ? t('contact.sending') : t('contact.send')}
        </button>
      </form>
    </div>
  )
}
