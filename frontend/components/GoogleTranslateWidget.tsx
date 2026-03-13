'use client'

import { useState, useEffect, useRef } from 'react'

/** Языки для Google Translate (виджет) */
const TRANSLATE_LANGS = ['ru', 'be', 'en', 'pl', 'zh'] as const
type TranslateLang = (typeof TRANSLATE_LANGS)[number]

const GOOGLE_LANG_MAP: Record<TranslateLang, string> = {
  ru: 'ru',
  be: 'be',
  en: 'en',
  pl: 'pl',
  zh: 'zh-CN',
}

const TRANSLATE_LANG_NAMES: Record<TranslateLang, string> = {
  ru: 'Русский',
  be: 'Беларуская',
  en: 'English',
  pl: 'Polski',
  zh: '中文',
}

const SCRIPT_URL = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'

type Variant = 'mobile' | 'desktop'

const buttonClass = {
  mobile: 'font-sans text-[10px] sm:text-xs text-black/80 px-1.5 sm:px-2 py-1 border-2 border-primary rounded hover:text-black transition-colors',
  desktop: 'font-sans text-[10px] sm:text-xs lg:text-sm font-semibold tracking-wide text-black/80 hover:text-black px-1.5 sm:px-2 py-1 border-2 border-primary rounded transition-colors',
}

type Props = {
  variant?: Variant
  /** При выборе русского — переход на /ru/... вместо cookie+reload */
  onSelectRussian?: () => void
  /** URL русской версии; при выборе другого языка сначала переход сюда (контент должен быть на русском для Google Translate) */
  russianPath?: string
}

export function GoogleTranslateWidget({ variant = 'desktop', onSelectRussian, russianPath }: Props) {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('ru')
  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const init = () => {
      const g = (window as Window & { google?: { translate: { TranslateElement: { InlineLayout: { SIMPLE: number } } } } }).google
      if (!g?.translate || !containerRef.current) return
      new (g.translate as any).TranslateElement(
        {
          pageLanguage: 'ru',
          includedLanguages: 'ru,en,be,pl,zh-CN',
          layout: g.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    ;(window as Window & { googleTranslateElementInit?: () => void }).googleTranslateElementInit = init

    const sel = document.querySelector<HTMLSelectElement>('#google_translate_element select')
    if (sel) {
      setReady(true)
      setCurrent(sel.value || 'ru')
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      const check = () => {
        const s = document.querySelector<HTMLSelectElement>('#google_translate_element select')
        if (s) {
          setReady(true)
          setCurrent(s.value || 'ru')
        } else {
          setTimeout(check, 50)
        }
      }
      setTimeout(check, 100)
    }
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  const handleSelect = (code: TranslateLang) => {
    const googleCode = GOOGLE_LANG_MAP[code]
    setOpen(false)
    setCurrent(googleCode)

    if (code === 'ru') {
      if (onSelectRussian) {
        onSelectRussian()
        return
      }
      document.cookie = 'googtrans=; path=/; max-age=0'
      location.reload()
      return
    }
    document.cookie = `googtrans=/ru/${googleCode}; path=/; max-age=31536000`
    if (russianPath && typeof window !== 'undefined' && !window.location.pathname.startsWith('/ru')) {
      window.location.href = russianPath
    } else {
      location.reload()
    }
  }

  return (
    <div ref={ref} className="google-translate-widget relative shrink-0">
      <div
        ref={containerRef}
        id="google_translate_element"
        className="absolute w-[120px] h-[32px] opacity-0 pointer-events-none overflow-hidden"
        style={{ left: 0, top: 0 }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 ${buttonClass[variant]}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>
          {ready
            ? TRANSLATE_LANG_NAMES[(Object.entries(GOOGLE_LANG_MAP).find(([, v]) => v === current)?.[0] ?? 'ru') as TranslateLang]
            : 'Язык'}
        </span>
        <svg viewBox="0 0 12 12" className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path fill="currentColor" d="M6 8L1 3h10L6 8z" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-[100] min-w-[120px] min-[1580px]:min-w-[140px]"
          role="listbox"
        >
          {TRANSLATE_LANGS.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                className={`block w-full text-left px-3 py-2 min-[1580px]:px-4 font-sans text-sm hover:bg-secondary/50 transition-colors ${
                  GOOGLE_LANG_MAP[loc] === current ? 'text-black font-medium' : 'text-black/80'
                }`}
                onClick={() => handleSelect(loc)}
              >
                {TRANSLATE_LANG_NAMES[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
