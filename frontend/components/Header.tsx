'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { locales, localeNames } from '@/lib/i18n'

export function Header() {
  const locale = useLocale()
  const t = useTranslations()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const nav = [
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/portfolio`, label: t('nav.portfolio') },
    { href: `/${locale}/reviews`, label: t('nav.reviews') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
    { href: `/${locale}/promos`, label: t('nav.promos') },
    { href: `/${locale}/how-to-get`, label: t('nav.howToGet') },
    ...(isAuthenticated ? [{ href: `/${locale}/cabinet`, label: t('nav.cabinet') }] : [{ href: `/${locale}/login`, label: t('nav.login') }]),
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-secondary/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 font-serif text-2xl md:text-3xl font-medium text-black tracking-tight"
        >
          <Image
            src="/logo.png"
            alt={t('footer.copyright')}
            width={64}
            height={64}
            className="w-14 h-14 md:w-16 md:h-16 object-contain shrink-0"
          />
          {t('footer.copyright')}
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-6 flex-nowrap">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm tracking-wide text-black/80 hover:text-black transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="font-sans text-sm tracking-wide text-black/80 hover:text-black px-2 py-1 border border-secondary/30 rounded"
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              {localeNames[locale]}
            </button>
            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setLangOpen(false)}
                />
                <ul
                  className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-20 min-w-[140px]"
                  role="menu"
                >
                  {locales.map((loc) => (
                    <li key={loc} role="none">
                      <Link
                        href={`/${loc}`}
                        role="menuitem"
                        className={`block px-4 py-2 font-sans text-sm hover:bg-secondary/50 ${locale === loc ? 'text-black font-medium' : 'text-black/80'}`}
                        onClick={() => setLangOpen(false)}
                      >
                        {localeNames[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="font-sans text-xs text-black/80 px-2 py-1 border border-secondary/30 rounded"
            >
              {locale.toUpperCase()}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setLangOpen(false)} />
                <ul className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-20 min-w-[120px]">
                  {locales.map((loc) => (
                    <li key={loc}>
                      <Link
                        href={`/${loc}`}
                        className={`block px-3 py-2 font-sans text-sm ${locale === loc ? 'text-black font-medium' : 'text-black/80'}`}
                        onClick={() => setLangOpen(false)}
                      >
                        {localeNames[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
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
      {open && (
        <div className="md:hidden bg-white border-t border-secondary/10 py-6 px-6 flex flex-col gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-black/80 hover:text-black"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-secondary/10 flex flex-wrap gap-2">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}`}
                className={`font-sans text-sm px-3 py-1.5 rounded border ${locale === loc ? 'border-primary text-black' : 'border-secondary/30 text-black/80'}`}
                onClick={() => setOpen(false)}
              >
                {localeNames[loc]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
