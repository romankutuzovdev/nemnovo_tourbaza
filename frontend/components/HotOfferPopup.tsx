'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchHotOffers, getHotOfferImageSrc, type HotOfferItem } from '@/lib/api'

const HOT_OFFER_SEEN_KEY = 'nemnovo-hot-offer-seen'
const DELAY_MS = 5000

export function HotOfferPopup() {
  const locale = useLocale()
  const t = useTranslations('hotOffer')
  const [offer, setOffer] = useState<HotOfferItem | null>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seen = sessionStorage.getItem(HOT_OFFER_SEEN_KEY)
    if (seen === '1') return

    let cancelled = false
    fetchHotOffers(locale).then((list) => {
      if (cancelled || list.length === 0) return
      setOffer(list[0])
      setLoaded(true)
      timerRef.current = setTimeout(() => {
        if (!cancelled) setVisible(true)
      }, DELAY_MS)
    })

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [locale])

  const close = () => {
    sessionStorage.setItem(HOT_OFFER_SEEN_KEY, '1')
    setVisible(false)
  }

  if (!loaded || !offer || !visible) return null

  const imageSrc = getHotOfferImageSrc(offer)
  const linkUrl = (offer.link_url || '').trim()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={offer.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-up">
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-black/70 flex items-center justify-center transition-colors"
          aria-label={t('closeAria')}
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {imageSrc ? (
          <div className="relative w-full aspect-[4/3] bg-secondary/10">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
              unoptimized={imageSrc.startsWith('http') && !imageSrc.includes(process.env.NEXT_PUBLIC_API_URL || '')}
            />
          </div>
        ) : null}

        <div className="p-6">
          <h3 className="font-serif text-xl md:text-2xl font-medium text-black mb-2">{offer.title}</h3>
          {offer.short_desc ? (
            <p className="font-sans text-sm text-black/80 mb-4 whitespace-pre-line">{offer.short_desc}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {linkUrl ? (
              linkUrl.startsWith('/') ? (
                <Link
                  href={linkUrl}
                  onClick={close}
                  className="inline-flex px-5 py-2.5 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-colors rounded"
                >
                  {offer.button_text || 'Подробнее'}
                </Link>
              ) : (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-5 py-2.5 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 transition-colors rounded"
                >
                  {offer.button_text || 'Подробнее'}
                </a>
              )
            ) : null}
            <button
              type="button"
              onClick={close}
              className="inline-flex px-5 py-2.5 border border-black/20 text-black/80 font-sans text-sm hover:bg-black/5 transition-colors rounded"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
