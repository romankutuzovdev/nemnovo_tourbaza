'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendContactForm } from '@/lib/api'

export function ComplaintFormSection() {
  const t = useTranslations()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(form: HTMLFormElement) {
    setError(null)
    setLoading(true)
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? ''
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim() ?? ''
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value?.trim() ?? ''
    const result = await sendContactForm('complaint', { name, email, message })
    setLoading(false)
    if ('ok' in result && result.ok) {
      setSent(true)
    } else {
      setError(('error' in result ? result.error : null) ?? t('contact.sendError'))
    }
  }

  return (
    <section className="bg-white border-t border-secondary/10">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('contact.formComplaint')}</h2>
        <p className="mt-2 font-sans text-sm text-black/80 mb-8 max-w-xl">{t('contact.complaintIntro')}</p>
        <div className="mt-6">
        {sent ? (
          <p className="font-sans text-black/80">{t('contact.thanks')}</p>
        ) : (
          <form className="space-y-4 max-w-xl" onSubmit={(e) => { e.preventDefault(); handleSubmit(e.currentTarget) }} action="#" method="post">
            <input type="hidden" name="_to" value="marketing@nemnovo.by" />
            <div>
              <label htmlFor="comp-name" className="block font-sans text-sm text-black/80 mb-1">{t('contact.nameLabel')}</label>
              <input id="comp-name" name="name" type="text" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50" placeholder={t('contact.namePlaceholder')} />
            </div>
            <div>
              <label htmlFor="comp-email" className="block font-sans text-sm text-black/80 mb-1">{t('contact.emailLabel')}</label>
              <input id="comp-email" name="email" type="email" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50" placeholder={t('contact.emailPlaceholder')} />
            </div>
            <div>
              <label htmlFor="comp-msg" className="block font-sans text-sm text-black/80 mb-1">{t('contact.complaintMessageLabel')}</label>
              <textarea id="comp-msg" name="message" rows={3} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50 resize-none" placeholder={t('contact.complaintMessagePlaceholder')} />
            </div>
            {error && <p className="font-sans text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="px-6 py-3 border border-secondary/30 text-black font-sans text-sm tracking-wide hover:border-secondary/50 transition-colors disabled:opacity-60">{loading ? t('contact.sending') : t('contact.send')}</button>
          </form>
        )}
        </div>
      </div>
    </section>
  )
}
