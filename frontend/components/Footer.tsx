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
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.586-.19 1.341 1.26 2.14 1.818.605.42 1.064.328 1.064.328l2.137-.03s1.117-.07.587-.962c-.043-.073-.308-.662-1.588-1.87-1.34-1.263-1.16-1.058.454-3.246.984-1.327 1.377-2.137 1.254-2.482-.117-.329-.84-.242-.84-.242l-2.406.015s-.178-.025-.31.056c-.128.078-.21.26-.21.26s-.377 1.01-.88 1.87c-1.063 1.818-1.49 1.914-1.663 1.798-.406-.27-.304-1.088-.304-1.669 0-1.816.27-2.572-.525-2.77-.264-.066-.458-.11-1.133-.117-.865-.01-1.598.003-2.014.21-.276.139-.49.449-.36.467.161.022.525.1.718.368.25.348.24 1.13.24 1.13s.144 2.112-.334 2.371c-.328.18-.778-.187-1.745-1.86-.494-.855-.866-1.803-.866-1.803s-.07-.175-.196-.27c-.153-.117-.368-.154-.368-.154l-2.286.015s-.343.01-.468.161c-.112.134-.009.41-.009.41s1.795 4.257 3.832 6.406c1.866 1.964 3.989 1.835 3.989 1.835h.961z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  max: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5 4v16h2v-7l4 5 4-5v7h2V4h-2l-4 6-4-6H5z" />
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

const defaultCompany: CompanyInfo = {
  company_name: 'ООО «Немново Тур»',
  legal_address: 'Республика Беларусь, 230015 г. Гродно, ул. Богуцкого 2/1',
  office_address: 'Республика Беларусь, 230015 г. Гродно, ул. Богуцкого, 2/1',
  unp: '591535043',
  okpo: '508605124000',
  trade_register: 'Дата и номер регистрации в торговом реестре Республики Беларусь: 03.04.2025 г. № 746010',
  services_register: 'Дата и номер регистрации в реестре бытовых услуг Республики Беларусь: 27.03.2025 г. № 100797',
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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3 font-serif text-2xl font-medium text-black transition-opacity duration-200 hover:opacity-80"
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
            <p className="mt-3 font-sans text-sm text-black/80 max-w-xs">
              {t('footer.slogan')}
            </p>
          </div>
          <div className="font-sans text-sm text-black/80 space-y-2 max-w-sm md:text-right md:ml-auto">
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
            {info.trade_register && <p>{info.trade_register}</p>}
            {info.services_register && <p>{info.services_register}</p>}
            <a
              href={`mailto:${info.contact_email}`}
              className="inline-block font-sans text-black/80 hover:text-black transition-colors duration-200 mt-1"
            >
              {info.contact_email}
            </a>
            <Link
              href={`/${locale}/how-to-get`}
              className="block font-sans text-black/80 hover:text-black transition-colors duration-200"
            >
              {t('footer.howToGet')}
            </Link>
            <div className="flex gap-3 mt-4">
              <SocialLink href="https://t.me/nemnovotour" label="Telegram" icon="telegram" />
              <SocialLink href="https://instagram.com/nemnovotour" label="Instagram" icon="instagram" />
              <SocialLink href="https://vk.com/nemnovotour" label="VK" icon="vk" />
              <SocialLink href="https://facebook.com/nemnovotour" label="Facebook" icon="facebook" />
              <SocialLink href="https://max.ru/" label="MAX" icon="max" />
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-secondary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-sans text-xs text-black/80">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="font-sans text-xs text-black/80 hover:text-black transition-colors duration-200">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
