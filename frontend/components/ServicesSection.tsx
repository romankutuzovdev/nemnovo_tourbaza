'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useServices } from '@/contexts/LocaleContext'
import { getServiceImageSrc } from '@/lib/api'

export function ServicesSection() {
  const locale = useLocale()
  const t = useTranslations()
  const services = useServices()
  return (
    <section id="services" className="scroll-mt-24 pt-12 md:pt-16 pb-6 md:pb-8 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-title-main text-white">{t('servicesSection.title')}</h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((item) => (
            <div key={item.slug} className="min-w-0">
              <Link
                href={`/${locale}/services/${item.slug}`}
                className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Image
                  src={getServiceImageSrc(item)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">{item.title}</h3>
                  <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">{item.short_desc}</p>
                  <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">{t('servicesSection.more')}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href={`/${locale}/services`} className="inline-flex items-center px-6 py-3 border border-secondary/50 text-white font-sans text-sm tracking-wide hover:bg-white/10 transition-colors">
            {t('servicesSection.allServices')}
          </Link>
        </div>
      </div>
    </section>
  )
}
