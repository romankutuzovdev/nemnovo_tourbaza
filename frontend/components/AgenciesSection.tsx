'use client'

import { useTranslations } from 'next-intl'
import type { AgenciesPageContent } from '@/lib/api'

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0 text-primary">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

type Props = {
  content?: AgenciesPageContent | null
  hideTitle?: boolean
}

export function AgenciesSection({ content, hideTitle = false }: Props) {
  const t = useTranslations('agencies')

  const title = content?.title || t('title')
  const intro = content?.intro || t('intro')
  const whyTitle = content?.why_title || t('whyTitle')
  const whyItems = content?.why_items?.length
    ? content.why_items
    : [t('why1'), t('why2'), t('why3'), t('why4'), t('why5'), t('why6')]
  const howTitle = content?.how_title || t('howTitle')
  const howIntro = content?.how_intro || t('howIntro')
  const howSteps = content?.how_steps?.length
    ? content.how_steps
    : [t('howStep1'), t('howStep2')]
  const howOutro = content?.how_outro || t('howOutro')
  const ctaTitle = content?.cta_title || t('ctaTitle')

  const contact1Label = content?.contact1_label || 'Специалист по туризму'
  const contact1Phone = content?.contact1_phone || '+375297801304'
  const contact2Label = content?.contact2_label || 'Директор'
  const contact2Phone = content?.contact2_phone || '+375296525903'

  const fmt = (phone: string) =>
    phone.replace(/[^\d+]/g, '').replace(/^(\+?\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')

  return (
    <section id="agencies" className="app-section bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {!hideTitle && (
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight max-w-2xl">
            {title}
          </h2>
        )}
        <p className="mt-4 font-sans text-primary max-w-xl">
          {intro}
        </p>
        <hr className="mt-10 md:mt-12 mb-10 md:mb-14 border-t border-secondary/20" />

        {/* Почему выбирают нас */}
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-primary tracking-tight mb-6 md:mb-8">
          {whyTitle}
        </h2>
        <ul className="space-y-4 md:space-y-5">
          {whyItems.map((text, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-0.5" aria-hidden>{CHECK_ICON}</span>
              <span className="font-sans text-primary leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        <hr className="my-10 md:my-14 border-t border-secondary/20" />

        {/* Как начать сотрудничество */}
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-primary tracking-tight mb-4 md:mb-6">
          {howTitle}
        </h2>
        <p className="font-sans text-primary mb-4">{howIntro}</p>
        <ol className="list-decimal list-inside font-sans text-primary space-y-2 mb-4">
          {howSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        <p className="font-sans text-primary">{howOutro}</p>

        {/* CTA блок */}
        <div className="mt-14 md:mt-16 p-6 md:p-8 bg-secondary/10 border border-secondary/20">
          <p className="font-serif text-xl font-medium text-black mb-4">{ctaTitle}</p>
          <div className="space-y-3">
            <p className="font-sans text-sm text-black/80">
              <span className="font-medium text-black">{contact1Label}:</span>{' '}
              <a href={`tel:${contact1Phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                {fmt(contact1Phone)}
              </a>
            </p>
            <p className="font-sans text-sm text-black/80">
              <span className="font-medium text-black">{contact2Label}:</span>{' '}
              <a href={`tel:${contact2Phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                {fmt(contact2Phone)}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
