'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, useNews } from '@/contexts/LocaleContext'
import { getNewsImageSrc } from '@/lib/api'

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

export default function NewsPage() {
  const locale = useLocale()
  const t = useTranslations()
  const news = useNews()

  return (
    <div className="min-h-screen bg-primary">
      <header className="pt-44 md:pt-24 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="lg:hidden inline-flex items-center gap-2 font-sans text-sm text-white/80 hover:text-white transition-colors"
        >
          ← {t('nav.home')}
        </Link>
      </header>
      <section className="pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-2xl mb-8 md:mb-10">
            {t('newsSection.title')}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {news.map((item) => (
              <div key={item.slug} className="min-w-0">
                <Link
                  href={`/${locale}/news/${item.slug}`}
                  className="group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
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
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 from-40% via-black/40 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 min-h-[50%] sm:min-h-0 flex flex-col justify-end p-4 pt-10 pb-4 sm:pt-5 sm:pb-5 md:p-6">
                    <time className="font-sans text-xs text-white/80 mb-1.5 shrink-0 whitespace-nowrap" dateTime={item.created_at}>
                      <span className="sm:hidden">{formatNewsDate(item.created_at, true)}</span>
                      <span className="hidden sm:inline">{formatNewsDate(item.created_at)}</span>
                    </time>
                    <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-medium text-white tracking-tight line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="mt-1 sm:mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                      {item.short_desc}
                    </p>
                    <span className="mt-2 sm:mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors shrink-0">
                      {t('newsSection.more')}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {news.length === 0 && (
            <p className="font-sans text-white/80 mt-8">
              {t('newsSection.noNews')}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
