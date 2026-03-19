'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ContactFormModal } from '@/components/ContactFormModal'
import type { HeroContent } from '@/lib/api'

interface HeroProps {
  content?: HeroContent | null
}

export function Hero({ content }: HeroProps) {
  const t = useTranslations()
  const [modalOpen, setModalOpen] = useState(false)

  const image = content?.image || null
  const badge = content?.badge || t('hero.badge')
  const title1 = content?.title1 || t('hero.title1')
  const title2 = content?.title2 || t('hero.title2')
  const subtitle = content?.subtitle || t('hero.subtitle')

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-32 pb-14 md:pb-16 ${!image ? 'bg-gradient-to-b from-secondary/60 via-white to-secondary/40' : ''}`}
      style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
    >
      {image && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 18%, rgba(60,60,60,0.35) 30%, rgba(60,60,60,0.5) 50%, rgba(60,60,60,0.35) 70%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.35) 100%)',
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(120deg, var(--primary) 0%, transparent 50%, var(--secondary) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center relative w-full">
        <p className={`font-sans text-base md:text-lg tracking-[0.2em] uppercase mb-6 animate-fade-up ${image ? 'text-white/90' : 'text-black/80'}`} style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          {badge}
        </p>
        <h1 className={`font-serif-legacy text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.15] tracking-tight animate-fade-up ${image ? 'text-white' : 'text-black'}`} style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          {title1}
          <br />
          <span className={image ? 'text-white' : 'text-black/90'}>{title2}</span>
        </h1>
        <p className={`mt-8 font-sans text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed animate-fade-up ${image ? 'text-white/90' : 'text-black/80'}`} style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
          {subtitle}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <Link href="#services" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            {t('hero.cta1')}
          </Link>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={`inline-flex items-center justify-center px-8 py-4 border-[3px] font-sans text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${image ? 'border-white/60 text-white hover:bg-white/20' : 'border-secondary/30 text-black hover:border-secondary/50'}`}
          >
            {t('hero.cta2')}
          </button>
        </div>
      </div>
      <ContactFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
