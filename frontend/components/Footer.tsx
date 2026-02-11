'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchCompanyInfo, type CompanyInfo } from '@/lib/api'

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
      .then(setCompany)
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
