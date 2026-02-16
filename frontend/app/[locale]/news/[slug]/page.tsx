import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchNewsBySlug, fetchNews, getNewsImageSrc } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

function formatNewsDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return iso
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return { title: 'Немново' }
  const news = await fetchNewsBySlug(slug, locale as Locale)
  if (!news) return { title: 'Новость не найдена' }
  return { title: `${news.title} — Немново`, description: news.short_desc }
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const [newsItem, newsList] = await Promise.all([
    fetchNewsBySlug(slug, locale as Locale),
    fetchNews(locale as Locale),
  ])
  if (!newsItem) notFound()

  const t = await getTranslations()
  const imageSrc = getNewsImageSrc(newsItem)

  return (
    <div className="pt-24 pb-24 md:pb-32 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('common.allNews')}
        </Link>

        <article className="pt-16">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={newsItem.title}
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
              <time className="font-sans text-xs text-white/80 mb-2 block" dateTime={newsItem.created_at}>
                {formatNewsDate(newsItem.created_at)}
              </time>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-white/80 mb-2 block">
                {t('newsSection.badge')}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                {newsItem.title}
              </h1>
            </div>
          </div>

          <p className="mt-8 font-sans text-xl text-black/80 leading-relaxed">
            {newsItem.short_desc}
          </p>

          {newsItem.long_desc && (
            <div className="mt-10 font-sans text-black/85 leading-relaxed whitespace-pre-line">
              {newsItem.long_desc}
            </div>
          )}
        </article>

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherNews')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {newsList.map((item) => {
              const isCurrent = item.slug === slug
              return (
                <div key={item.slug} className="min-w-0">
                  <Link
                    href={`/${locale}/news/${item.slug}`}
                    className={`group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isCurrent ? 'border-primary ring-2 ring-primary/50' : 'border-secondary/20 hover:border-secondary/40'
                    }`}
                  >
                    {getNewsImageSrc(item) ? (
                      <Image
                        src={getNewsImageSrc(item)}
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
                      <time className="font-sans text-xs text-white/80" dateTime={item.created_at}>
                        {formatNewsDate(item.created_at)}
                      </time>
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2 mt-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                        {item.short_desc}
                      </p>
                      {!isCurrent && (
                        <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('newsSection.more')}
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
              href={`/${locale}/news`}
              className="inline-flex items-center font-sans text-sm text-black/80 hover:text-black"
            >
              {t('common.toNewsPage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
