'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchCompanyInfo, type CompanyInfo } from '@/lib/api'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.326.015.094.034.308.019.475z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  vk: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 3.202 5.66.356.44.593.576.813.576.22 0 .322-.102.322-.66V9.722c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.576 1.254-1.406 2.151-3.574 3.051-6.016.17-.407.373-.677.78-.677h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 5.031-2.354 5.031-.373.61-.508.813-.254 1.322.22.44.94 1.254 1.406 1.881.609.847 1.067 1.422 1.336 1.792.27.37.44.44.78.44h2.49c.575 0 .745-.27.61-.745-.27-.847-1.355-2.372-2.457-3.965-1.693-2.457-2.438-2.813-2.031-2.813z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: keyof typeof SOCIAL_ICONS }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 text-black/80 hover:bg-primary hover:text-white transition-colors"
      aria-label={label}
      title={label}
    >
      {SOCIAL_ICONS[icon]}
    </a>
  )
}

const SOCIAL_LINKS = [
  { href: 'https://t.me/nemnovo', label: 'Telegram', icon: 'telegram' as const },
  { href: 'https://instagram.com/nemnovotour', label: 'Instagram', icon: 'instagram' as const },
  { href: 'https://vk.com/nemnovotour', label: 'VK', icon: 'vk' as const },
  { href: 'https://facebook.com/nemnovotour', label: 'Facebook', icon: 'facebook' as const },
]

const defaultCompany: CompanyInfo = {
  company_name: 'ООО «Немново Тур»',
  legal_address: '231734, Гродненская область, Гродненский район д. Немново, 15 – 7',
  office_address: 'Республика Беларусь, 230002 г. Гродно, ул. Богуцкого, 2/1',
  unp: '591535043',
  okpo: '508605124000',
  state_registration: 'Свидетельство о государственной регистрации и юридического лица №591535043 от 31.01.2025',
  trade_register: 'Дата и номер регистрации в торговом реестре Республики Беларусь: 03.04.2025 г. №746010',
  services_register: 'Дата и номер регистрации в реестре бытовых услуг Республики Беларусь: 27.03.2025 г. №100797',
  contact_email: 'office@nemnovotour.by',
}

export function Footer() {
  const locale = useLocale()
  const t = useTranslations()
  const [company, setCompany] = useState<CompanyInfo | null>(null)

  useEffect(() => {
    fetchCompanyInfo()
      .then((data) => setCompany(data ?? defaultCompany))
      .catch(() => setCompany(defaultCompany))
  }, [])

  const info = company ?? defaultCompany

  return (
    <footer className="bg-secondary/60 border-t border-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {/* Колонка 1: лого, подпись, соцсети */}
          <div className="flex flex-col">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3 font-serif-legacy text-2xl font-medium text-black transition-opacity duration-200 hover:opacity-80 w-fit"
            >
              <Image
                src="/logo.png"
                alt={t('footer.copyright')}
                width={64}
                height={64}
                className="w-16 h-16 object-contain shrink-0"
              />
              {t('footer.copyright')}
            </Link>
            <p className="mt-3 font-sans text-sm text-black/80 max-w-xs whitespace-pre-line">
              {t('footer.slogan')}
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <SocialLink key={href} href={href} label={label} icon={icon} />
              ))}
            </div>
          </div>

          {/* Колонка 2: адрес, время работы, телефон */}
          <div className="font-sans text-sm text-black/80 space-y-4">
            <div>
              <p className="font-medium text-black mb-1">{t('footer.addressLabel')}</p>
              <p>{t('footer.address')}</p>
            </div>
            <div>
              <p className="font-medium text-black mb-1">{t('footer.workingHours')}</p>
              <p className="whitespace-pre-line uppercase">{t('footer.workingHoursValue')}</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-black mb-1">{t('footer.phone1Label')}</p>
                <a href="tel:+375291792539" className="hover:text-black transition-colors">+375 29 179 25 39</a>
              </div>
              <div>
                <p className="font-medium text-black mb-1">{t('footer.phone2Label')}</p>
                <a href="tel:+375297801304" className="hover:text-black transition-colors">+375 29 780 13 04</a>
              </div>
            </div>
            <Link
              href={`/${locale}/how-to-get`}
              className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-secondary/30 text-black font-sans text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors w-fit"
            >
              {t('footer.howToGet')}
            </Link>
          </div>

          {/* Колонка 3: реквизиты, кнопки политик */}
          <div className="font-sans text-sm text-black/80 space-y-4">
            <p className="font-medium text-black">{t('footer.requisites')}</p>
            <p className="font-medium text-black">{info.company_name}</p>
            {info.legal_address && (
              <p><span className="text-black/70">{t('footer.legalAddressLabel')}</span> {info.legal_address}</p>
            )}
            {info.office_address && (
              <p><span className="text-black/70">{t('footer.officeAddressLabel')}</span> {info.office_address}</p>
            )}
            {(info.unp || info.okpo) && (
              <p>
                {info.unp && <>{t('footer.unpLabel')} {info.unp}</>}
                {info.unp && info.okpo && ', '}
                {info.okpo && <>{t('footer.okpoLabel')} {info.okpo}</>}
              </p>
            )}
            {info.state_registration && <p>{info.state_registration}</p>}
            {info.trade_register && <p>{info.trade_register}</p>}
            {info.services_register && <p>{info.services_register}</p>}
            <a href={`mailto:${info.contact_email}`} className="inline-block text-black/80 hover:text-black transition-colors">
              {info.contact_email}
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/${locale}/privacy`}
                className="font-sans text-sm text-black/80 hover:text-black transition-colors underline underline-offset-2"
              >
                {t('footer.personalDataPolicy')}
              </Link>
              <Link
                href={`/${locale}/cookie-policy`}
                className="font-sans text-sm text-black/80 hover:text-black transition-colors underline underline-offset-2"
              >
                {t('footer.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary/10">
          <p className="font-sans text-xs text-black/80" suppressHydrationWarning>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
