'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { fetchCertificateContent, getCertificateImageSrc, type CertificateContent } from '@/lib/api'
import { useLocale } from '@/contexts/LocaleContext'

export function CertificateSection() {
  const t = useTranslations()
  const locale = useLocale()
  const [content, setContent] = useState<CertificateContent | null>(null)

  useEffect(() => {
    fetchCertificateContent(locale).then(setContent).catch(() => setContent(null))
  }, [locale])

  const imageSrc = content ? getCertificateImageSrc(content) : ''

  return (
    <section id="certificate" className="app-section bg-primary">
      <div className="app-container">
        <h2 className="section-title-main text-white">
          {t('certificateSection.title')}
        </h2>
        <div className="app-section-body flex justify-center">
          <Link
            href="/gift-certificate"
            className="block max-w-md w-full group"
            aria-label={t('certificateSection.link')}
          >
            <article className="rounded-none overflow-hidden border border-white/15 bg-white shadow-sm hover:shadow-lg hover:border-white/30 transition-all duration-300">
              <div className="relative aspect-[9/4] w-full bg-secondary/20">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={t('certificateSection.title')}
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-4xl text-primary/50">🎁</span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <span className="font-sans text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                  {t('certificateSection.more')} →
                </span>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </section>
  )
}
