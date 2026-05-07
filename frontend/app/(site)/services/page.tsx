'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useServices, useEvents } from '@/contexts/LocaleContext'
import { useCart } from '@/contexts/CartContext'
import { getServiceImageSrc, getEventImageSrc } from '@/lib/api'
import type { ServiceItem } from '@/lib/api'

function ServiceCard({ item, moreLabel }: { item: ServiceItem; moreLabel: string }) {
  const images = item.images && item.images.length > 0 ? item.images : [getServiceImageSrc(item)].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const [quantityInput, setQuantityInput] = useState('1')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const price = item.price ? Number(item.price) : null
  const showServicePrice = !item.has_variants && price !== null

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000)
    return () => clearInterval(timer)
  }, [images.length])

  function handleAdd() {
    const quantity = Math.max(1, Number(quantityInput) || 1)
    addItem({ slug: item.slug, title: item.title, price: price as number }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <div className="min-w-0">
      <Link
        href={`/services/${item.slug}`}
        className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        {images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end z-10">
          <h2 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
            {item.title}
          </h2>
          <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">
            {item.short_desc}
          </p>
          <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
            {moreLabel}
          </span>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <span key={i} className={`block w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </Link>
      {item.has_variants ? (
        <div className="mt-3">
          <p className="font-sans text-sm text-white/80">Цена по вариантам</p>
        </div>
      ) : showServicePrice ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-serif text-lg text-white">{price.toFixed(2)} BYN</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantityInput}
              onChange={(e) => {
                const next = e.target.value
                if (next === '' || /^\d+$/.test(next)) setQuantityInput(next)
              }}
              onBlur={() => {
                if (!quantityInput || Number(quantityInput) < 1) setQuantityInput('1')
              }}
              className="w-14 border border-secondary/30 bg-white/10 text-white px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-1.5 text-xs transition-all duration-300 ${
                added
                  ? 'bg-green-500 text-white scale-105 shadow-md shadow-green-600/40'
                  : 'bg-white text-primary hover:bg-white/90'
              }`}
            >
              {added ? 'Добавлено' : 'В корзину'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ServicesPage() {
  const t = useTranslations()
  const services = useServices()
  const events = useEvents()

  const generalServices = services.filter((s) => s.category !== 'gazebo')

  return (
    <div className="min-h-screen bg-primary">
      <header className="pt-6 md:pt-8 pb-3 md:pb-4 max-w-6xl mx-auto px-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-white/80 hover:text-white transition-colors mb-4"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-2xl">
          {t('servicesSection.title')}
        </h1>
      </header>
      <section className="pt-6 md:pt-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {generalServices.map((item) => (
              <ServiceCard key={item.slug} item={item} moreLabel={t('servicesSection.more')} />
            ))}
          </div>

          {events.length > 0 && (
            <div className="mt-16 md:mt-20 border-t border-secondary/30 pt-10 md:pt-12">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight max-w-2xl mb-6 md:mb-8">
                {t('eventsSection.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {events.map((item) => (
                  <div key={item.slug} className="min-w-0">
                    <Link
                      href={`/events/${item.slug}`}
                      className="group relative block aspect-[16/6] w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    >
                      {getEventImageSrc(item) ? (
                        <Image
                          src={getEventImageSrc(item)}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary/80" aria-hidden />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                        <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                          {item.short_desc}
                        </p>
                        <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('eventsSection.more')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
