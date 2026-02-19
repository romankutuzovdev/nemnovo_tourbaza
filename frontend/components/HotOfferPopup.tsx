'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchHotOffers, getHotOfferImageSrc, sendContactForm, type HotOfferItem } from '@/lib/api'

const HOT_OFFER_SEEN_KEY = 'nemnovo-hot-offer-seen'

function useCountdown(validUntil: string | null): { days: number; hours: number; minutes: number; seconds: number; expired: boolean } {
  const [left, setLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; expired: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true,
  })

  useEffect(() => {
    if (!validUntil) {
      setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
      return
    }
    const end = new Date(validUntil).getTime()
    const update = () => {
      const now = Date.now()
      const diff = Math.max(0, end - now)
      if (diff === 0) {
        setLeft((p) => (p.expired ? p : { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }))
        return
      }
      const d = Math.floor(diff / (24 * 60 * 60 * 1000))
      const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
      const s = Math.floor((diff % (60 * 1000)) / 1000)
      setLeft({ days: d, hours: h, minutes: m, seconds: s, expired: false })
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [validUntil])

  return left
}

export function HotOfferPopup() {
  const locale = useLocale()
  const t = useTranslations('hotOffer')
  const tContact = useTranslations('contact')
  const [offer, setOffer] = useState<HotOfferItem | null>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const timerRef = useRef<number | null>(null)
  const countdown = useCountdown(offer?.valid_until ?? null)

  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formSending, setFormSending] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const cancelledRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seen = sessionStorage.getItem(HOT_OFFER_SEEN_KEY)
    if (seen === '1') return

    cancelledRef.current = false
    fetchHotOffers(locale)
      .then((list) => {
        if (cancelledRef.current || !mountedRef.current || list.length === 0) return
        const first = list[0]
        setOffer(first)
        setLoaded(true)
        const delayMs = Math.max(0, (first.delay_seconds ?? 5)) * 1000
        timerRef.current = window.setTimeout(() => {
          if (!cancelledRef.current && mountedRef.current) setVisible(true)
        }, delayMs)
      })
      .catch(() => {
        // сеть или API недоступен — попап не показываем
      })

    return () => {
      cancelledRef.current = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [locale])

  const close = () => {
    sessionStorage.setItem(HOT_OFFER_SEEN_KEY, '1')
    setVisible(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSending(true)
    const result = await sendContactForm('hot_offer', {
      name: formName.trim(),
      email: formEmail.trim(),
      message: formMessage.trim(),
    })
    setFormSending(false)
    if ('error' in result) {
      setFormError(result.error)
      return
    }
    setFormSent(true)
    setFormName('')
    setFormEmail('')
    setFormMessage('')
  }

  if (!loaded || !offer || !visible) return null

  const imageSrc = getHotOfferImageSrc(offer)
  const showTimer = offer.valid_until && !countdown.expired

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={offer.title}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in pb-[env(safe-area-inset-bottom,0)]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {/* Широкий баннер: десктоп — ряд (картинка слева, форма справа), мобильный — колонка */}
      <div
        className="relative w-full max-w-6xl h-[94vh] max-h-[94vh] sm:h-[85vh] sm:max-h-[88vh] sm:min-h-[480px] bg-white shadow-xl animate-fade-up flex flex-col sm:flex-row rounded-t-2xl sm:rounded-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/95 hover:bg-white text-black/70 border border-black/10 shadow-sm transition-colors rounded-none"
          aria-label={t('closeAria')}
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        {/* Слева 70% — картинка; на мобильном фиксированная высота, на десктопе — на всю высоту */}
        <div className="w-full sm:w-[70%] flex-shrink-0 relative h-[40vh] min-h-[200px] max-h-[320px] sm:h-full sm:min-h-[400px] sm:max-h-none aspect-[4/3] sm:aspect-auto bg-secondary/10">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-black/30 font-sans text-sm px-4">
              {offer.title}
            </div>
          )}
        </div>

        {/* Справа 30% — таймер, описание, кнопка и форма заявки; на мобильном — прокручиваемая область */}
        <div className="w-full sm:w-[30%] flex-1 sm:flex-shrink-0 flex flex-col min-h-0 p-4 sm:p-5 overflow-y-auto overflow-x-hidden border-t sm:border-t-0 sm:border-l border-black/10">
          <h3 className="font-serif text-lg sm:text-xl font-medium text-black mb-2 pr-10">{offer.title}</h3>

          {showTimer ? (
            <div className="mb-3 p-2.5 sm:p-3 bg-primary/10 border border-primary/20">
              <p className="font-sans text-xs text-black/70 mb-1.5">{t('timerEndsIn')}</p>
              <div className="flex gap-1.5 flex-wrap font-mono text-xs sm:text-sm">
                {countdown.days > 0 && (
                  <span className="inline-flex min-w-[2rem] justify-center px-1.5 py-1 bg-white border border-black/15 font-semibold">
                    {countdown.days}
                    <span className="ml-0.5 font-sans text-[10px] sm:text-xs font-normal opacity-80">{t('dayShort')}</span>
                  </span>
                )}
                <span className="inline-flex min-w-[2rem] justify-center px-1.5 py-1 bg-white border border-black/15 font-semibold">
                  {String(countdown.hours).padStart(2, '0')}
                  <span className="ml-0.5 font-sans text-[10px] sm:text-xs font-normal opacity-80">{t('hourShort')}</span>
                </span>
                <span className="inline-flex min-w-[2rem] justify-center px-1.5 py-1 bg-white border border-black/15 font-semibold">
                  {String(countdown.minutes).padStart(2, '0')}
                  <span className="ml-0.5 font-sans text-[10px] sm:text-xs font-normal opacity-80">{t('minShort')}</span>
                </span>
                <span className="inline-flex min-w-[2rem] justify-center px-1.5 py-1 bg-white border border-black/15 font-semibold">
                  {String(countdown.seconds).padStart(2, '0')}
                  <span className="ml-0.5 font-sans text-[10px] sm:text-xs font-normal opacity-80">{t('secShort')}</span>
                </span>
              </div>
            </div>
          ) : null}

          {offer.short_desc ? (
            <p className="font-sans text-xs sm:text-sm text-black/80 mb-0 whitespace-pre-line">{offer.short_desc}</p>
          ) : null}

          <div className="border-t border-black/10 pt-2 mt-2">
            <h4 className="font-sans text-xs sm:text-sm font-medium text-black mb-2">{t('formTitle')}</h4>
            {formSent ? (
              <p className="font-sans text-xs sm:text-sm text-black/80">{tContact('thanks')}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
                <div>
                  <label htmlFor="ho-name" className="block font-sans text-[10px] sm:text-xs text-black/70 mb-0.5">
                    {tContact('nameLabel')}
                  </label>
                  <input
                    id="ho-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={tContact('namePlaceholder')}
                    className="w-full min-h-[40px] sm:min-h-[44px] px-2.5 py-1.5 sm:py-2 border border-black/20 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ho-email" className="block font-sans text-[10px] sm:text-xs text-black/70 mb-0.5">
                    {tContact('emailLabel')}
                  </label>
                  <input
                    id="ho-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder={tContact('emailPlaceholder')}
                    className="w-full min-h-[40px] sm:min-h-[44px] px-2.5 py-1.5 sm:py-2 border border-black/20 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ho-message" className="block font-sans text-[10px] sm:text-xs text-black/70 mb-0.5">
                    {tContact('messageLabel')}
                  </label>
                  <textarea
                    id="ho-message"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder={tContact('messagePlaceholder')}
                    rows={2}
                    className="w-full min-h-[64px] sm:min-h-[72px] px-2.5 py-1.5 sm:py-2 border border-black/20 font-sans text-sm resize-none"
                    required
                  />
                </div>
                {formError && (
                  <p className="font-sans text-[10px] sm:text-xs text-red-600">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={formSending}
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3 py-2 bg-primary text-white font-sans text-xs sm:text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {formSending ? tContact('sending') : t('formTitle')}
                </button>
              </form>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-2 sm:mt-3 font-sans text-xs sm:text-sm text-black/60 hover:text-black underline"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}
