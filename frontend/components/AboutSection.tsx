'use client'

import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations()
  return (
    <section id="about" className="pt-8 md:pt-12 pb-4 md:pb-6 bg-secondary/40 border-y border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
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
