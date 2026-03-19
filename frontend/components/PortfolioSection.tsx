'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimateOnScroll } from './AnimateOnScroll'
import { useTranslations } from 'next-intl'
import { usePortfolio } from '@/contexts/LocaleContext'
import { getPortfolioImageSrc } from '@/lib/api'

/** Формат даты DD.MM.YYYY одинаково на сервере и клиенте (без hydration mismatch). */
function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

type Props = { hideTitle?: boolean }

export function PortfolioSection({ hideTitle }: Props = {}) {
  const t = useTranslations()
  const portfolio = usePortfolio()

  return (
    <section id="portfolio" className="pt-6 md:pt-10 pb-16 md:pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {!hideTitle && (
          <AnimateOnScroll variant="fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight max-w-2xl">
              {t('portfolioSection.title')}
            </h2>
          </AnimateOnScroll>
        )}
        <div className={`grid sm:grid-cols-2 md:grid-cols-3 gap-6 ${hideTitle ? '' : 'mt-12'}`}>
          {portfolio.map((item, i) => {
            const src = getPortfolioImageSrc(item)
            return (
              <AnimateOnScroll key={item.slug} variant="fade-up" delay={i * 100}>
                <Link href={`/portfolio/${item.slug}`} className="block">
                  <article className="rounded-sm overflow-hidden border border-secondary/10 transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
                    {src ? (
                      <div className="relative aspect-[4/3] bg-secondary/30">
                        <Image
                          src={src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                        {item.is_pinned && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white font-sans text-xs">
                            {t('portfolioSection.pinnedBadge')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center">
                        <span className="font-sans text-sm text-black/80">{item.title}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-medium text-black">{item.title}</h3>
                      {item.event_date && (
                        <time className="font-sans text-xs text-black/60 mt-1 block" dateTime={item.event_date}>
                          {formatEventDate(item.event_date)}
                        </time>
                      )}
                      {item.description && (
                        <p className="mt-2 font-sans text-sm text-primary line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </article>
                </Link>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
