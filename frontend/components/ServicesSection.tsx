'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useServices } from '@/contexts/LocaleContext'
import { getServiceImageSrc } from '@/lib/api'
import type { ServiceItem } from '@/lib/api'

function ServiceCard({ item }: { item: ServiceItem }) {
  const t = useTranslations()
  const images = item.images && item.images.length > 0 ? item.images : [getServiceImageSrc(item)].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="min-w-0">
      <Link
        href={`/services/${item.slug}`}
        className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <Image
          key={idx}
          src={images[idx]}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end z-10">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">{item.title}</h3>
          <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">{item.short_desc}</p>
          <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">{t('servicesSection.more')}</span>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <span key={i} className={`block w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}

export function ServicesSection() {
  const t = useTranslations()
  const services = useServices().filter(s => s.category !== 'gazebo')
  return (
    <section id="services" className="scroll-mt-24 app-section bg-primary">
      <div className="app-container">
        <h2 className="section-title-main text-white">{t('servicesSection.title')}</h2>
        <div className="app-section-body grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((item) => (
            <ServiceCard key={item.slug} item={item} />
          ))}
        </div>
        <div className="app-section-cta">
          <Link href="/services" className="inline-flex items-center px-6 py-3 rounded-xl border border-secondary/50 text-white font-sans text-sm tracking-wide hover:bg-white/10 transition-colors">
            {t('servicesSection.allServices')}
          </Link>
        </div>
      </div>
    </section>
  )
}
