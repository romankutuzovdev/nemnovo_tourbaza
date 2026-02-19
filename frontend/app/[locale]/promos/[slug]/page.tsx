import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchPromoBySlug, getPromoImageSrc } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return { title: 'Немново' }
  const promo = await fetchPromoBySlug(slug, locale as Locale)
  if (!promo) return { title: 'Акция не найдена' }
  return { title: `${promo.title} — Немново`, description: promo.short_desc }
}

export default async function PromoPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const promo = await fetchPromoBySlug(slug, locale as Locale)
  if (!promo) notFound()

  const t = await getTranslations()
  const imageSrc = getPromoImageSrc(promo)
  const hasImage = Boolean(imageSrc)

  return (
    <div className="pt-36 md:pt-24 pb-12 md:pb-16 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}/promos`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('nav.promos')}
        </Link>

        <article className="pt-16 bg-secondary/30 border border-secondary/10 rounded-sm overflow-hidden">
          {hasImage && (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={imageSrc}
                alt={promo.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-4 sm:p-6 md:p-10">
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-black tracking-tight">
              {promo.title}
            </h1>
            {(promo.short_desc || promo.long_desc) && (
              <div className="mt-6 font-sans text-black/80 leading-relaxed whitespace-pre-line break-words min-w-0">
                {[promo.short_desc, promo.long_desc].filter(Boolean).join('\n\n')}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
