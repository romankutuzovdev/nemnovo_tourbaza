'use client'

import { useTranslations } from 'next-intl'

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0 text-primary">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export function AgenciesSection() {
  const t = useTranslations('agencies')
  const whyItems = [t('why1'), t('why2'), t('why3'), t('why4'), t('why5'), t('why6')]

  return (
    <section id="agencies" className="pt-6 md:pt-8 pb-16 md:pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight max-w-2xl">
          {t('title')}
        </h2>
        <p className="mt-4 font-sans text-black/80 max-w-xl">
          {t('intro')}
        </p>
        <hr className="mt-10 md:mt-12 mb-10 md:mb-14 border-t border-secondary/20" />

        {/* Почему выбирают нас */}
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight mb-6 md:mb-8">
          {t('whyTitle')}
        </h2>
        <ul className="space-y-4 md:space-y-5">
          {whyItems.map((text, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-0.5" aria-hidden>{CHECK_ICON}</span>
              <span className="font-sans text-black/80 leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        <hr className="my-10 md:my-14 border-t border-secondary/20" />

        {/* Как начать сотрудничество */}
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight mb-4 md:mb-6">
          {t('howTitle')}
        </h2>
        <p className="font-sans text-black/80 mb-4">{t('howIntro')}</p>
        <ol className="list-decimal list-inside font-sans text-black/80 space-y-2 mb-4">
          <li>{t('howStep1')}</li>
          <li>{t('howStep2')}</li>
        </ol>
        <p className="font-sans text-black/80">{t('howOutro')}</p>

        {/* CTA блок: контакты внизу страницы, как на Gastinia */}
        <div className="mt-14 md:mt-16 p-6 md:p-8 bg-secondary/10 border border-secondary/20">
          <p className="font-serif text-xl font-medium text-black mb-4">{t('ctaTitle')}</p>
          <p className="font-sans text-sm text-black/80 mb-2">
            <span className="font-medium text-black">{t('ctaPhone')}</span>{' '}
            <a href={`tel:${t('phoneValue').replace(/\s/g, '')}`} className="text-primary hover:underline">
              {t('phoneValue')}
            </a>
          </p>
          <p className="font-sans text-sm text-black/80">
            <span className="font-medium text-black">{t('ctaEmail')}</span>{' '}
            <a href={`mailto:${t('emailValue')}`} className="text-primary hover:underline">
              {t('emailValue')}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
