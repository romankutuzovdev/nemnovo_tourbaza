'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { ContactFormModal } from '@/components/ContactFormModal'

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 via-white to-secondary/40 pt-28 md:pt-32 pb-16">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(120deg, var(--primary) 0%, transparent 50%, var(--secondary) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center relative w-full">
        <p className="font-sans text-base md:text-lg tracking-[0.2em] uppercase text-black/80 mb-6 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          {t('hero.badge')}
        </p>
        <h1 className="font-serif-legacy text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-[1.15] tracking-tight animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          {t('hero.title1')}
          <br />
          <span className="text-black/90">{t('hero.title2')}</span>
        </h1>
        <p className="mt-8 font-sans text-xl md:text-2xl text-black/80 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
          {t('hero.subtitle')}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <Link href="#services" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            {t('hero.cta1')}
          </Link>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 border border-secondary/30 text-black font-sans text-sm tracking-wide hover:border-secondary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('hero.cta2')}
          </button>
        </div>
      </div>
      <ContactFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
