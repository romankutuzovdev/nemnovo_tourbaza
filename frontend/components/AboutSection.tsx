'use client'

import { useTranslations } from 'next-intl'
import type { AboutContent } from '@/lib/api'

type Props = { content?: AboutContent | null }

export function AboutSection({ content }: Props) {
  const t = useTranslations()

  const title = content?.title || t('about.title')
  const paragraphs = content?.paragraphs?.length
    ? content.paragraphs
    : [t('about.p1'), t('about.p2')]

  return (
    <section id="about" className="pt-8 md:pt-12 pb-4 md:pb-6 bg-secondary/40 border-y border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">{title}</h2>
          </div>
          <div className="font-sans text-primary leading-relaxed space-y-4">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
    </section>
  )
}
