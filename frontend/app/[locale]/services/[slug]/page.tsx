import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchServiceBySlug, fetchServices, getServiceImageSrc } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return { title: 'Немново' }
  const service = await fetchServiceBySlug(slug, locale as Locale)
  if (!service) return { title: 'Услуга не найдена' }
  return { title: `${service.title} — Немново`, description: service.short_desc }
}

function parseServiceItems(text: string): { section?: string; items: string[] }[] {
  const blocks: { section?: string; items: string[] }[] = []
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  let current: { section?: string; items: string[] } = { items: [] }
  for (const line of lines) {
    if (line.startsWith('• ')) {
      current.items.push(line.slice(2).trim())
    } else {
      if (current.items.length > 0 || current.section) {
        blocks.push(current)
        current = { items: [] }
      }
      current.section = line.endsWith(':') ? line.slice(0, -1).trim() : line
    }
  }
  if (current.items.length > 0 || current.section) blocks.push(current)
  return blocks
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const [service, servicesList] = await Promise.all([
    fetchServiceBySlug(slug, locale as Locale),
    fetchServices(locale as Locale),
  ])
  if (!service) notFound()

  const t = await getTranslations()
  const blocks = parseServiceItems(service.long_desc)
  const serviceTitle = service.title
  const serviceShortDesc = service.short_desc
  const imageSrc = getServiceImageSrc(service)

  return (
    <div className="pt-32 pb-16 md:pb-16 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('common.allServices')}
        </Link>

        <article className="pt-16">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
            <Image
              src={imageSrc}
              alt={serviceTitle}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                {serviceTitle}
              </h1>
            </div>
          </div>

          <p className="mt-8 font-sans text-xl text-black/80 leading-relaxed">
            {serviceShortDesc}
          </p>

          <div className="mt-12 space-y-10">
            {blocks.map((block, i) => (
              <div key={i}>
                {block.section && (
                  <h2 className="font-serif text-2xl font-medium text-black mb-4">
                    {block.section}
                  </h2>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 p-4 md:p-5 bg-secondary/50 border border-secondary/10 rounded-lg font-sans text-black"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherServices')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {servicesList.map((item) => {
              const isCurrent = item.slug === slug
              return (
                <div key={item.slug} className="min-w-0">
                  <Link
                    href={`/${locale}/services/${item.slug}`}
                    className={`group relative block aspect-square w-full rounded-lg overflow-hidden border bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isCurrent ? 'border-primary ring-2 ring-primary/50' : 'border-secondary/20 hover:border-secondary/40'
                    }`}
                  >
                    <Image
                      src={getServiceImageSrc(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
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
                          {t('servicesSection.more')}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="mt-8">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center font-sans text-sm text-black/80 hover:text-black"
            >
              {t('common.toServicesPage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
