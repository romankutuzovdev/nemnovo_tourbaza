import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchPortfolioItem, getPortfolioDownloadUrl } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'

function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function PortfolioItemPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const item = await fetchPortfolioItem(slug, locale as Locale)
  if (!item) notFound()

  const t = await getTranslations()
  const images = item.images || []

  return (
    <div className="pt-32 pb-24 md:pb-32 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('portfolioSection.backToPortfolio')}
        </Link>

        <div className="pt-16">
        <header className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-black tracking-tight">
            {item.title}
          </h1>
          {item.event_date && (
            <time className="mt-2 block font-sans text-base text-black/60" dateTime={item.event_date}>
              {formatEventDate(item.event_date)}
            </time>
          )}
          {item.description && (
            <p className="mt-4 font-sans text-black/80 max-w-2xl">{item.description}</p>
          )}
        </header>

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-square rounded-lg overflow-hidden bg-secondary/30 border border-secondary/10 hover:border-primary/40 transition-colors group"
                >
                  <Image
                    src={url}
                    alt={`${item.title} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white font-sans text-xs rounded">
                    {i + 1} / {images.length}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={getPortfolioDownloadUrl(slug)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors rounded"
                download
              >
                {t('portfolioSection.button')}
              </a>
              <span className="font-sans text-sm text-black/60">
                {images.length} {t('portfolioSection.photos')}
              </span>
            </div>
          </>
        )}

        {images.length === 0 && (
          <p className="font-sans text-black/60">{t('portfolioSection.description')}</p>
        )}
        </div>
      </div>
    </div>
  )
}
