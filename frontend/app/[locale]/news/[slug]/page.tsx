import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchNewsBySlug, getNewsImageSrc } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

function formatNewsDate(iso: string, short = false) {
  try {
    const d = new Date(iso)
    if (short) {
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      return `${day}.${month}.${d.getFullYear()}`
    }
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

  const newsItem = await fetchNewsBySlug(slug, locale as Locale)
  if (!newsItem) notFound()

  const t = await getTranslations()
  const imageSrc = getNewsImageSrc(newsItem)

  return (
    <div className="pt-36 md:pt-24 pb-24 md:pb-32 min-h-screen bg-white">
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
            <div className="absolute inset-x-0 bottom-0 min-h-[45%] sm:min-h-0 flex flex-col justify-end p-4 pt-8 pb-4 sm:p-6 md:p-10">
              <time className="font-sans text-xs text-white/80 mb-1.5 sm:mb-2 block shrink-0 whitespace-nowrap" dateTime={newsItem.created_at}>
                <span className="sm:hidden">{formatNewsDate(newsItem.created_at, true)}</span>
                <span className="hidden sm:inline">{formatNewsDate(newsItem.created_at)}</span>
              </time>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
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

        <div className="mt-12">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center font-sans text-sm text-black/80 hover:text-black"
          >
            ← {t('common.allNews')}
          </Link>
        </div>
      </div>
    </div>
  )
}
