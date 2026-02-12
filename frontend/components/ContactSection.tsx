'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendContactForm } from '@/lib/api'

export function ContactSection() {
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
    const result = await sendContactForm('main', { name, email, message })
    setLoading(false)
    if ('ok' in result && result.ok) {
      setSent(true)
    } else {
      setError(('error' in result ? result.error : null) ?? t('contact.sendError'))
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="font-sans text-sm tracking-[0.2em] uppercase text-black/80 mb-4">{t('contact.badge')}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('contact.title')}</h2>
        <p className="mt-4 font-sans text-black/80 max-w-xl">{t('contact.intro')}</p>

        <div className="mt-16 max-w-xl">
          <h3 className="font-serif text-xl font-medium text-black mb-2">{t('contact.formMain')}</h3>
          <p className="font-sans text-sm text-black/80 mb-6">{t('contact.inboxNote')}</p>
          {sent ? (
            <p className="font-sans text-black/80">{t('contact.thanks')}</p>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(e.currentTarget) }} action="#" method="post">
              <input type="hidden" name="_to" value="office@nemnovotour.by" />
              <div>
                <label htmlFor="main-name" className="block font-sans text-sm text-black/80 mb-1">{t('contact.nameLabel')}</label>
                <input id="main-name" name="name" type="text" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50" placeholder={t('contact.namePlaceholder')} />
              </div>
              <div>
                <label htmlFor="main-email" className="block font-sans text-sm text-black/80 mb-1">{t('contact.emailLabel')}</label>
                <input id="main-email" name="email" type="email" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50" placeholder={t('contact.emailPlaceholder')} />
              </div>
              <div>
                <label htmlFor="main-msg" className="block font-sans text-sm text-black/80 mb-1">{t('contact.messageLabel')}</label>
                <textarea id="main-msg" name="message" rows={3} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-secondary/50 resize-none" placeholder={t('contact.messagePlaceholder')} />
              </div>
              {error && <p className="font-sans text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60">{loading ? t('contact.sending') : t('contact.send')}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
