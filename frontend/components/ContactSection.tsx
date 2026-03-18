'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { sendContactForm, fetchCompanyInfo, type CompanyInfo } from '@/lib/api'

const defaultCompany: CompanyInfo = {
  company_name: '',
  legal_address: '',
  office_address: '',
  unp: '',
  okpo: '',
  state_registration: '',
  trade_register: '',
  services_register: '',
  contact_email: 'office@nemnovotour.by',
}

const IconAddress = () => (
  <svg className="w-5 h-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconClock = () => (
  <svg className="w-5 h-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const IconPhone = () => (
  <svg className="w-5 h-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconEmail = () => (
  <svg className="w-5 h-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
export function ContactSection() {
  const t = useTranslations()
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  useEffect(() => {
    fetchCompanyInfo()
      .then((data) => setCompany(data ?? defaultCompany))
      .catch(() => setCompany(defaultCompany))
  }, [])
  const contactEmail = company?.contact_email || defaultCompany.contact_email
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
    <section id="contact" className="app-section bg-white">
      <div className="app-container">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">{t('contact.title')}</h2>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Контактная информация: адрес и время работы в карточках */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
            <div className="flex flex-col gap-4 sm:col-span-2">
              <div className="p-6 rounded-xl bg-[#F7F7F9] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex gap-4">
                  <IconAddress />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-black/70 mb-2 break-words">{t('footer.addressLabel')}</p>
                    <p className="font-sans text-sm text-gray-600 leading-snug whitespace-pre-line break-words">{t('footer.address')}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#F7F7F9] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex gap-4">
                  <IconClock />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-black/70 mb-2 break-words">{t('footer.workingHours')}</p>
                    <p className="font-sans text-sm text-gray-600 leading-snug whitespace-pre-line break-words">{t('footer.workingHoursValue')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20 sm:col-span-2 space-y-4">
              <div className="flex gap-4">
                <IconPhone />
                <div className="min-w-0 flex-1 space-y-4">
                  {(() => {
                    const parts1 = (t('footer.phone1Hours') || '').split('\n').map((s) => s.replace(/,\s*$/, '').trim())
                    const parts2 = (t('footer.phone2Hours') || '').split('\n').map((s) => s.replace(/,\s*$/, '').trim())
                    const [hours1, daysOff1] = [(parts1[0] || '').trim(), (parts1[1] || '').trim()]
                    const [hours2, daysOff2] = [(parts2[0] || '').trim(), (parts2[1] || '').trim()]
                    return (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1 items-baseline">
                          <div>
                            <p className="font-sans text-sm font-semibold text-black/70 break-words whitespace-pre-line">{t('footer.phone1Label')}</p>
                            <a href="tel:+375291792539" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors break-all mt-1">+375 29 179 25 39</a>
                          </div>
                          <div className="shrink-0 text-left">
                            <p className="font-sans text-sm text-black/70 whitespace-nowrap">{hours1}</p>
                            <p className="font-sans text-sm text-black/70 whitespace-nowrap mt-0.5">{daysOff1}</p>
                          </div>
                        </div>
                        <div className="border-t border-secondary/20 my-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1 items-start">
                          <div>
                            <p className="font-sans text-sm font-semibold text-black/70 break-words whitespace-pre-line">{t('footer.phone2Label')}</p>
                            <div className="mt-1 space-y-0.5">
                              <a href="tel:+375297801304" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors break-all">+375 29 780 13 04</a>
                              <a href="tel:+375296011637" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors break-all">+375 29 601 16 37</a>
                              <a href="tel:+375152490729" className="block font-sans text-sm font-medium text-black hover:text-primary transition-colors break-all">+375 15 249 07 29</a>
                            </div>
                          </div>
                          <div className="shrink-0 text-left">
                            <p className="font-sans text-sm text-black/70 whitespace-nowrap">{hours2}</p>
                            <p className="font-sans text-sm text-black/70 whitespace-nowrap mt-0.5">{daysOff2}</p>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20 sm:col-span-2">
              <div className="flex gap-4">
                <IconEmail />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-xs font-semibold tracking-wider uppercase text-black/70 mb-1 break-words">{t('footer.emailLabel')}</p>
                  <a href={`mailto:${contactEmail}`} className="font-sans text-sm font-medium text-black hover:text-primary transition-colors break-all">
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Форма */}
          <div className="lg:col-span-3 min-w-0">
            <div className="w-full min-w-0 max-w-xl">
              <h3 className="font-serif text-xl font-medium text-primary mb-6 break-words">{t('contact.formMain')}</h3>
              {sent ? (
                <p className="font-sans text-black/80">{t('contact.thanks')}</p>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(e.currentTarget) }} action="#" method="post">
                  <input type="hidden" name="_to" value="office@nemnovotour.by" />
                  <div className="min-w-0">
                    <label htmlFor="main-name" className="block font-sans text-sm text-primary mb-1 break-words">{t('contact.nameLabel')}</label>
                    <input id="main-name" name="name" type="text" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-primary/50 rounded-lg" placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="main-email" className="block font-sans text-sm text-primary mb-1 break-words">{t('contact.emailLabel')}</label>
                    <input id="main-email" name="email" type="email" required className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black placeholder:text-black/80/60 focus:outline-none focus:border-primary/50 rounded-lg" placeholder={t('contact.emailPlaceholder')} />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="main-msg" className="block font-sans text-sm text-primary mb-1 break-words">{t('contact.messageLabel')}</label>
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
