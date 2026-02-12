'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimateOnScroll } from './AnimateOnScroll'
import { useLocale, usePromos } from '@/contexts/LocaleContext'
import { useTranslations } from 'next-intl'
import { getApiUrl } from '@/lib/api'
import type { PromoItem } from '@/lib/api'

function promoImageSrc(promo: PromoItem): string {
  if (promo.image_url) return promo.image_url
  if (promo.image && promo.image.startsWith('http')) return promo.image
  if (promo.image) return `${getApiUrl()}${promo.image}`
  return ''
}

export function PromosSection() {
  const t = useTranslations()
  const locale = useLocale()
  const promos = usePromos()

  if (promos.length === 0) return null

  return (
    <section id="promos" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-black/80 mb-4">
            {t('promosSection.badge')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight max-w-2xl">
            {t('promosSection.title')}
          </h2>
        </AnimateOnScroll>
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {promos.map((p, i) => {
            const src = promoImageSrc(p)
            return (
              <AnimateOnScroll key={p.slug} variant="fade-up" delay={i * 100}>
                <Link
                  href={`/${locale}/promos/${p.slug}`}
                  className="block group"
                  aria-label={p.title}
                >
                  <article className="h-full bg-secondary/50 border border-secondary/10 rounded-sm flex flex-col md:flex-row gap-4 overflow-hidden transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
                    {src && (
                      <div className="relative w-full md:w-40 h-40 shrink-0">
                        <Image
                          src={src}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 160px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center min-w-0">
                      <h3 className="font-serif text-xl font-medium text-black group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm text-black/80 line-clamp-3 break-words">
                        {p.short_desc.length > 120 ? `${p.short_desc.slice(0, 120).trim()}…` : p.short_desc}
                      </p>
                      <span className="mt-2 font-sans text-xs text-black/60 group-hover:text-primary transition-colors">
                        {t('servicesSection.more')}
                      </span>
                    </div>
                  </article>
                </Link>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
