'use client'

import { useCallback } from 'react'

// Клиентский shim для `next-intl`.
// Проект работает на русском, а перевод делается Google Translate виджетом.
// Для любых недостающих ключей возвращаем пустую строку, чтобы не светить raw key.
const RU: Record<string, string> = {
  // nav
  'nav.home': 'Главная',
  'nav.menuOpen': 'Меню',
  'nav.services': 'Услуги',
  'nav.events': 'Мероприятия',
  'nav.about': 'О нас',
  'nav.portfolio': 'Портфолио',
  'nav.reviews': 'Отзывы',
  'nav.contact': 'Контакты',
  'nav.agencies': 'Агентствам',
  'nav.promos': 'Акции',
  'nav.news': 'Новости',
  'nav.howToGet': 'Как добраться',
  'nav.cabinet': 'Личный кабинет',
  'nav.more': 'Ещё',
  'nav.payment': 'Оплата',
  'nav.tourfirm': 'ТУРФИРМА',
  'nav.login': 'Войти',
  'nav.logout': 'Выйти',
  'nav.register': 'Регистрация',
  'nav.translateLabel': 'Язык страницы',

  // cookie
  'cookie.text': 'Мы используем cookies для работы сайта и аналитики. Продолжая, вы соглашаетесь с',
  'cookie.link': 'политикой конфиденциальности',
  'cookie.accept': 'Принять',

  // common/services
  'servicesSection.title': 'Услуги',
  'servicesSection.more': 'Подробнее →',
  'servicesSection.inSection': 'В этом разделе',
  'common.allServices': 'Все услуги',
  'common.otherServices': 'Другие услуги',
}

export function useTranslations(namespace?: string) {
  return useCallback(
    (key: string) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return RU[fullKey] ?? ''
    },
    [namespace]
  )
}

