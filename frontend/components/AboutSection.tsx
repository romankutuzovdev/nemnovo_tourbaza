'use client'

import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations()
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/40 border-y border-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-black/80 mb-4">{t('about.badge')}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('about.title')}</h2>
          </div>
          <div className="font-sans text-black/80 leading-relaxed space-y-4">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
