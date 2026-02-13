'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useEvents } from '@/contexts/LocaleContext'
import { getApiUrl } from '@/lib/api'

function eventImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image_url) return item.image_url
  if (item.image?.startsWith('http')) return item.image
  return item.image ? `${getApiUrl()}${item.image}` : ''
}

export function EventsSection() {
  const locale = useLocale()
  const t = useTranslations()
  const events = useEvents()

  if (events.length === 0) return null

  return (
    <section id="events" className="py-24 md:py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="font-sans text-sm tracking-[0.2em] uppercase text-white/80 mb-4">{t('eventsSection.badge')}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-white tracking-tight max-w-2xl">{t('eventsSection.title')}</h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {events.map((item) => (
            <div key={item.slug} className="min-w-0">
              <Link
                href={`/${locale}/portfolio`}
                className="group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {eventImageSrc(item) ? (
                <Image
                  src={eventImageSrc(item)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                ) : (
                  <div className="absolute inset-0 bg-secondary/50" aria-hidden />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-1">{item.title}</h3>
                  {item.short_desc && (
                    <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-1">{item.short_desc}</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
