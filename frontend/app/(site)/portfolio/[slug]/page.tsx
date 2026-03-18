import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchPortfolioItem, getPortfolioDownloadUrl } from '@/lib/api'
import { PortfolioGallery } from '@/components/PortfolioGallery'

function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

type Props = { params: Promise<{ slug: string }> }

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params

  const item = await fetchPortfolioItem(slug, 'ru')
  if (!item) notFound()

  const t = await getTranslations()
  const images = item.images || []

  return (
    <div className="pt-32 pb-16 md:pb-16 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/portfolio"
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
            <PortfolioGallery
              images={images}
              title={item.title}
              photosLabel={t('portfolioSection.photos')}
              closeLabel={t('portfolioSection.close')}
            />

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
