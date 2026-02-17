import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchEventBySlug, fetchEvents, getEventImageSrc } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return { title: 'Немново' }
  const event = await fetchEventBySlug(slug, locale as Locale)
  if (!event) return { title: 'Мероприятие не найдено' }
  return { title: `${event.title} — Немново`, description: event.short_desc }
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const [event, eventsList] = await Promise.all([
    fetchEventBySlug(slug, locale as Locale),
    fetchEvents(locale as Locale),
  ])
  if (!event) notFound()

  const t = await getTranslations()
  const eventTitle = event.title
  const eventShortDesc = event.short_desc
  const eventLongDesc = event.long_desc || ''
  const imageSrc = getEventImageSrc(event)

  return (
    <div className="pt-32 pb-24 md:pb-32 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}/events`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('common.allEvents')}
        </Link>

        <article className="pt-16">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={eventTitle}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-primary/90" aria-hidden />
            )}
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                {eventTitle}
              </h1>
            </div>
          </div>

          <p className="mt-8 font-sans text-xl text-black/80 leading-relaxed">
            {eventShortDesc}
          </p>

          {eventLongDesc && (
            <div className="mt-10 font-sans text-black/85 leading-relaxed whitespace-pre-line">
              {eventLongDesc}
            </div>
          )}

        </article>

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherEvents')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {eventsList.map((item) => {
              const isCurrent = item.slug === slug
              return (
                <div key={item.slug} className="min-w-0">
                  <Link
                    href={`/${locale}/events/${item.slug}`}
                    className={`group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isCurrent ? 'border-primary ring-2 ring-primary/50' : 'border-secondary/20 hover:border-secondary/40'
                    }`}
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
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                        {item.short_desc}
                      </p>
                      {!isCurrent && (
                        <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('eventsSection.more')}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
