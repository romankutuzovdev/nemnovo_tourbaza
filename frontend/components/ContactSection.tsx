'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { sendContactForm } from '@/lib/api'

const IconAddress = () => (
  <svg className="w-5 h-5 shrink-0 text-primary/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconClock = () => (
  <svg className="w-5 h-5 shrink-0 text-primary/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const IconPhone = () => (
  <svg className="w-5 h-5 shrink-0 text-primary/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconDirections = () => (
  <svg className="w-5 h-5 shrink-0 text-primary/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export function ContactSection() {
  const t = useTranslations()
  const locale = useLocale()
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
    <section id="contact" className="pt-6 md:pt-8 pb-16 md:pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('contact.title')}</h2>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Контактная информация: адрес, время, телефоны, как добраться */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20">
              <div className="flex gap-4">
                <IconAddress />
                <div>
                  <p className="font-sans text-xs font-semibold tracking-wider uppercase text-black/70 mb-1">{t('footer.addressLabel')}</p>
                  <p className="font-sans text-sm text-black/90 leading-snug whitespace-pre-line">{t('footer.address')}</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20">
              <div className="flex gap-4">
                <IconClock />
                <div>
                  <p className="font-sans text-xs font-semibold tracking-wider uppercase text-black/70 mb-1">{t('footer.workingHours')}</p>
                  <p className="font-sans text-sm text-black/90 leading-snug whitespace-pre-line uppercase">{t('footer.workingHoursValue')}</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20 space-y-4">
              <div className="flex gap-4">
                <IconPhone />
                <div className="space-y-3 min-w-0">
                  <p className="font-sans text-xs font-semibold tracking-wider uppercase text-black/70">{t('footer.phone1Label')}</p>
                  <a href="tel:+375291792539" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors">+375 29 179 25 39</a>
                  <p className="font-sans text-xs font-semibold tracking-wider uppercase text-black/70 pt-1">{t('footer.phone2Label')}</p>
                  <a href="tel:+375297801304" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors">+375 29 780 13 04</a>
                </div>
              </div>
            </div>
            <Link
              href={`/${locale}/how-to-get`}
              className="flex items-center gap-4 p-5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-colors group"
            >
              <IconDirections />
              <span className="font-sans text-sm font-semibold text-black group-hover:text-primary transition-colors">{t('footer.howToGet')}</span>
              <svg className="w-4 h-4 ml-auto text-black/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Форма */}
          <div className="lg:col-span-3">
            <div className="max-w-xl">
              <h3 className="font-serif text-xl font-medium text-black mb-6">{t('contact.formMain')}</h3>
              {sent ? (
                <p className="font-sans text-black/80">{t('contact.thanks')}</p>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(e.currentTarget) }} action="#" method="post">
                  <input type="hidden" name="_to" value="office@nemnovotour.by" />
                  <div>
                    <label htmlFor="main-name" className="block font-sans text-sm text-black/80 mb-1">{t('contact.nameLabel')}</label>
                    <input id="main-name" name="name" type="text" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-primary/50 rounded-lg" placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div>
                    <label htmlFor="main-email" className="block font-sans text-sm text-black/80 mb-1">{t('contact.emailLabel')}</label>
                    <input id="main-email" name="email" type="email" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-primary/50 rounded-lg" placeholder={t('contact.emailPlaceholder')} />
                  </div>
                  <div>
                    <label htmlFor="main-msg" className="block font-sans text-sm text-black/80 mb-1">{t('contact.messageLabel')}</label>
                    <textarea id="main-msg" name="message" rows={3} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-primary/50 rounded-lg resize-none" placeholder={t('contact.messagePlaceholder')} />
                  </div>
                  {error && <p className="font-sans text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60">{loading ? t('contact.sending') : t('contact.send')}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
