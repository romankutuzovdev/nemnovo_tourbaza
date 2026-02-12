'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useServices } from '@/contexts/LocaleContext'
import { getApiUrl } from '@/lib/api'

function serviceImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image_url) return item.image_url
  if (item.image?.startsWith('http')) return item.image
  return item.image ? `${getApiUrl()}${item.image}` : ''
}

export default function ServicesPage() {
  const locale = useLocale()
  const t = useTranslations()
  const services = useServices()

  return (
    <div className="min-h-screen bg-primary">
      <header className="pt-24 pb-10 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 font-sans text-sm text-white/80 hover:text-white transition-colors"
        >
          ← {t('nav.home')}
        </Link>
      </header>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-white/80 mb-4">
            {t('servicesSection.badge')}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-2xl mb-8 md:mb-10">
            {t('servicesSection.title')}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((item) => (
            <div key={item.slug} className="min-w-0">
              <Link
                href={`/${locale}/services/${item.slug}`}
                className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Image
                  src={serviceImageSrc(item)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                    {item.short_desc}
                  </p>
                  <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                    {t('servicesSection.more')}
                  </span>
                </div>
              </Link>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  )
}
