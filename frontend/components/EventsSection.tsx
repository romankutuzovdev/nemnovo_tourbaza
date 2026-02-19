'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useEvents } from '@/contexts/LocaleContext'
import { getEventImageSrc } from '@/lib/api'

export function EventsSection() {
  const locale = useLocale()
  const t = useTranslations()
  const events = useEvents()

  return (
    <section id="events" className="pt-12 md:pt-16 pb-6 md:pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-title-main text-primary">{t('eventsSection.title')}</h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {events.length === 0 ? null : events.map((item) => (
            <div key={item.slug} className="min-w-0">
              <Link
                href={`/${locale}/events/${item.slug}`}
                className="group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border border-emerald-800/50 bg-emerald-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
              >
                {getEventImageSrc(item) ? (
                  <Image
                    src={getEventImageSrc(item)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-emerald-900/70" aria-hidden />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-1">{item.title}</h3>
                  {item.short_desc && (
                    <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-1">{item.short_desc}</p>
                  )}
                  <span className="mt-2 font-sans text-xs sm:text-sm text-white transition-colors">{t('eventsSection.more')}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href={`/${locale}/events`} className="inline-flex items-center px-6 py-3 border border-black text-black font-sans text-sm tracking-wide hover:bg-black/10 transition-colors">
            {t('eventsSection.allEvents')}
          </Link>
        </div>
      </div>
    </section>
  )
}
