'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useEvents } from '@/contexts/LocaleContext'
import { getEventImageSrc } from '@/lib/api'

export default function EventsPage() {
  const locale = useLocale()
  const t = useTranslations()
  const events = useEvents()

  return (
    <div className="min-h-screen bg-primary">
      <header className="pt-44 md:pt-32 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6"></header>
      <section className="pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-2xl mb-8 md:mb-10">
            {t('eventsSection.title')}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {events.map((item) => (
              <div key={item.slug} className="min-w-0">
                <Link
                  href={`/${locale}/events/${item.slug}`}
                  className="group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
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
                    <div className="absolute inset-0 bg-primary/80" aria-hidden />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                      {item.short_desc}
                    </p>
                    <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                      {t('eventsSection.more')}
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
