'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { GoogleTranslateWidget } from './GoogleTranslateWidget'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.326.015.094.034.308.019.475z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  vk: (
    <Image src="/vklogo.png" alt="VK" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  max: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M5 4v16h2v-7l4 5 4-5v7h2V4h-2l-4 6-4-6H5z" />
    </svg>
  ),
}

/** Ссылка на карточку турбазы в Яндекс.Картах */
const YANDEX_MAPS_URL = 'https://yandex.by/maps/?ll=23.762146%2C53.863078&mode=poi&poi%5Bpoint%5D=23.762041%2C53.863286&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D192681682562&pt=23.762146%2C53.863078&z=16'

const SOCIAL_LINKS: { href: string; label: string; icon: keyof typeof SOCIAL_ICONS }[] = [
  { href: 'https://t.me/nemnovo', label: 'Telegram', icon: 'telegram' },
  { href: 'https://instagram.com/nemnovotour', label: 'Instagram', icon: 'instagram' },
  { href: 'https://vk.com/nemnovotour', label: 'VK', icon: 'vk' },
  { href: 'https://facebook.com/nemnovotour', label: 'Facebook', icon: 'facebook' },
  { href: 'https://max.ru/', label: 'MAX', icon: 'max' },
]

const SCROLL_THRESHOLD = 60

/** Текущий путь без сегмента локали (например, /services/foo). */
function pathWithoutLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`
  if (pathname === prefix || pathname.startsWith(prefix + '/')) {
    return pathname.slice(prefix.length) || '/'
  }
  return '/'
}

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  const pathForLocale = (loc: string) => `/${loc}${pathWithoutLocale(pathname ?? '', locale)}`

  const handleSelectRussian = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'googtrans=; path=/; max-age=0'
      window.location.href = pathForLocale('ru')
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted])

  useEffect(() => {
    if (!moreOpen) return
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [moreOpen])

  const nav = [
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/portfolio`, label: t('nav.portfolio') },
    { href: `/${locale}/promos`, label: t('nav.promos') },
    { href: `/${locale}/how-to-get`, label: t('nav.howToGet') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ]

  const moreNav = [
    { href: `/${locale}/news`, label: t('nav.news') },
    { href: `/${locale}/reviews`, label: t('nav.reviews') },
    { href: `/${locale}/agencies`, label: t('nav.agencies') },
    { href: `/${locale}/payment`, label: t('nav.payment') },
  ]

  const authLink = isAuthenticated
    ? { href: `/${locale}/cabinet`, label: t('nav.cabinet') }
    : { href: `/${locale}/login`, label: t('nav.login') }

  const socialLinksNoMax = SOCIAL_LINKS.filter(({ icon }) => icon !== 'max')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Полоса: слева адрес с иконкой карты, справа соцсети — скрывается при скролле */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'
        }`}
      >
        <div className="w-full bg-primary flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
        <a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 min-w-0 shrink text-white/95 hover:text-white transition-colors"
          title={t('howToGet.yandex')}
        >
          <span className="shrink-0" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </span>
          <span className="font-sans text-[10px] sm:text-xs leading-tight truncate max-w-[180px] sm:max-w-[240px] md:max-w-none">
            {t('footer.addressShort')}
          </span>

        </a>
        <div className="flex items-center gap-3 shrink-0">
          {socialLinksNoMax.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors"
              aria-label={label}
              title={label}
            >
              {SOCIAL_ICONS[icon]}
            </a>
          ))}
        </div>
        </div>
      </div>
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-secondary/10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 min-h-14 h-14 sm:h-16 md:h-[4.25rem] lg:h-20 flex items-center overflow-visible">
        {/* Слева: лого + Немново */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 shrink-0 min-w-0 border-b border-secondary/10 md:border-b-0 pr-2 sm:pr-3 md:pr-4 lg:pr-5 h-full">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 font-serif-legacy text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary tracking-tight shrink-0 min-w-0"
          >
            <Image
              src="/logo.png"
              alt={t('footer.copyright')}
              width={64}
              height={64}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 object-contain shrink-0"
            />
            <span className="truncate">{t('footer.copyright')}</span>
          </Link>
        </div>
        {/* Десктоп (≥1580px): все пункты меню в один ряд; уже — бургер */}
        <div className="flex-1 min-w-0 hidden min-[1580px]:flex items-center justify-end gap-2 xl:gap-3 2xl:gap-4 h-full">
          {/* Обычные пункты — в scroll-контейнере */}
          <div className="flex items-center min-w-0 overflow-x-auto scrollbar-none">
            <nav className="flex items-center gap-2 xl:gap-3 2xl:gap-4 flex-nowrap shrink-0 min-w-max">
              {nav.map((item) =>
                (item as { external?: boolean }).external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs xl:text-sm font-semibold tracking-wide text-black/80 hover:text-black transition-colors whitespace-nowrap py-0.5 shrink-0"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-sans text-xs xl:text-sm font-semibold tracking-wide text-black/80 hover:text-black transition-colors whitespace-nowrap py-0.5 shrink-0"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Выпадающее меню «Ещё» — вне overflow-контейнера, чтобы не обрезалось */}
          <div className="relative shrink-0" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 font-sans text-xs xl:text-sm font-semibold tracking-wide text-black/80 hover:text-black transition-colors whitespace-nowrap py-0.5"
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              {t('nav.more')}
              <svg
                viewBox="0 0 12 12"
                fill="currentColor"
                className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 8L1 3h10L6 8z" />
              </svg>
            </button>
            {moreOpen && (
              <ul className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-50 min-w-[160px]">
                {moreNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2.5 font-sans text-sm font-semibold text-black/80 hover:text-black hover:bg-secondary/30 transition-colors whitespace-nowrap"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Свёрнутое меню (<1580px): лого + язык + гамбургер */}
        <div className="flex-1 min-w-0 flex min-[1580px]:hidden items-center justify-end">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <GoogleTranslateWidget variant="mobile" onSelectRussian={handleSelectRussian} russianPath={pathForLocale('ru')} />
              <button
                type="button"
                aria-label={t('nav.menuOpen')}
                className="p-2 text-black"
                onClick={() => setOpen(!open)}
              >
                <span className="block w-6 h-px bg-primary mb-1.5" />
                <span className="block w-6 h-px bg-primary mb-1.5" />
                <span className="block w-5 h-px bg-primary" />
              </button>
            </div>
        </div>
        {/* Справа: Войти, язык, ТУРФИРМА (при ≥1580px) */}
        <div className="hidden min-[1580px]:flex items-center gap-2 min-[1580px]:gap-3 2xl:gap-4 shrink-0 pl-4 min-[1580px]:pl-5 2xl:pl-6">
          <Link
            href={authLink.href}
            className="font-sans text-[10px] sm:text-xs lg:text-sm font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
          >
            {authLink.label}
          </Link>
          <GoogleTranslateWidget variant="desktop" onSelectRussian={handleSelectRussian} russianPath={pathForLocale('ru')} />
          <a
            href="https://nemnovotour.by/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] sm:text-xs lg:text-sm font-bold tracking-wide text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            {t('nav.tourfirm')}
          </a>
        </div>
      </div>
      {open && (
        <div className="min-[1580px]:hidden bg-white border-t border-secondary/10 py-6 px-6 flex flex-col gap-4">
            {nav.map((item) =>
              (item as { external?: boolean }).external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-black/80 hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-sans font-semibold text-black/80 hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            {moreNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans font-semibold text-black/80 hover:text-black"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={authLink.href}
              className="font-sans font-semibold px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-center"
              onClick={() => setOpen(false)}
            >
              {authLink.label}
            </Link>
            <div className="pt-2 border-t border-secondary/10">
              <GoogleTranslateWidget variant="mobile" onSelectRussian={handleSelectRussian} russianPath={pathForLocale('ru')} />
            </div>
            <a
              href="https://nemnovotour.by/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-bold text-primary hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              {t('nav.tourfirm')}
            </a>
        </div>
      )}
    </header>
  )
}
