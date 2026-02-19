'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchHowToGet, type HowToGetResponse, type HowToGetCityItem } from '@/lib/api'

const DEFAULT_ADDRESS = 'Республика Беларусь, Гродненская область, Гродненский район, Сопоцкинский сельский совет, деревня Немново, 15'
const DEFAULT_GPS = { lat: 53.863078, lon: 23.762146 }

function formatGpsDisplay(lat: number, lon: number) {
  const latD = Math.floor(lat)
  const latM = Math.floor((lat - latD) * 60)
  const latS = ((lat - latD) * 60 - latM) * 60
  const lonD = Math.floor(lon)
  const lonM = Math.floor((lon - lonD) * 60)
  const lonS = ((lon - lonD) * 60 - lonM) * 60
  return `${latD}°${latM}'${latS.toFixed(0)}″N, ${lonD}°${lonM}'${lonS.toFixed(0)}″E`
}

const mapsUrl = (lat: number, lon: number, provider: 'yandex' | 'google') => {
  if (provider === 'yandex') return `https://yandex.ru/maps/?pt=${lon},${lat}&z=16`
  return `https://www.google.com/maps?q=${lat},${lon}`
}

export function HowToGetThereSection() {
  const t = useTranslations()
  const locale = useLocale()
  const [data, setData] = useState<HowToGetResponse | null>(null)
  const [originSlug, setOriginSlug] = useState<string>('')
  const [openBlockId, setOpenBlockId] = useState<string | null>(null)

  useEffect(() => {
    fetchHowToGet(locale).then(setData).catch(() => setData(null))
  }, [locale])

  const address = (data?.address?.trim() || DEFAULT_ADDRESS)
  const gpsLat = data?.gps_lat ?? DEFAULT_GPS.lat
  const gpsLon = data?.gps_lon ?? DEFAULT_GPS.lon
  const gpsDisplay = formatGpsDisplay(gpsLat, gpsLon)
  const gpsDisplayNum = `широта ${gpsLat}, долгота ${gpsLon}`

  const cities: HowToGetCityItem[] = data?.cities ?? []
  const selectedCity = cities.find((c) => c.slug === originSlug) ?? cities[0]
  const blocks = selectedCity?.blocks ?? []

  useEffect(() => {
    if (cities.length && !originSlug) setOriginSlug(cities[0].slug)
  }, [cities, originSlug])

  useEffect(() => {
    if (blocks.length && !openBlockId) setOpenBlockId(blocks[0].transport_type)
  }, [blocks, openBlockId])

  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(`${address}\nGPS: ${gpsDisplay}; ${gpsDisplayNum}`)
  }, [address, gpsDisplay, gpsDisplayNum])

  return (
    <section id="how-to-get" className="pt-6 md:pt-8 pb-3 md:pb-4 bg-secondary/40 border-t border-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight shrink-0">
            {t('howToGet.title')}
          </h2>
          {!data ? (
            <p className="font-sans text-sm text-black/60">Загрузка…</p>
          ) : (
            <div className="shrink-0 text-left sm:text-left lg:text-right max-w-full lg:max-w-md">
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-black/80 mb-1">{t('howToGet.addressLabel')}</p>
              <div className="flex items-start justify-start lg:justify-end gap-2">
                <span className="font-sans text-sm font-semibold text-black leading-snug">{address}</span>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="p-1.5 text-black/80/70 hover:text-black transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={t('howToGet.copy')}
                  title={t('howToGet.copy')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              <p className="font-sans text-xs text-black/80 mt-2">
                GPS: {gpsDisplay}; {gpsDisplayNum}
              </p>
            </div>
          )}
        </div>

        {data && (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mapsUrl(gpsLat, gpsLon, 'yandex')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-md border border-secondary/30 bg-white text-black font-sans text-sm font-medium tracking-wide hover:border-primary/30 transition-colors"
              >
                {t('howToGet.yandex')}
              </a>
              <a
                href={mapsUrl(gpsLat, gpsLon, 'google')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-md border border-secondary/30 bg-white text-black font-sans text-sm font-medium tracking-wide hover:border-primary/30 transition-colors"
              >
                {t('howToGet.google')}
              </a>
            </div>

            {cities.length > 0 ? (
            <>
            <div className="mt-6 sm:mt-8 flex overflow-x-auto sm:overflow-visible border border-secondary/20 rounded-md overflow-hidden bg-white">
              {cities.map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => setOriginSlug(city.slug)}
                  className={`shrink-0 min-w-[100px] sm:shrink sm:min-w-0 sm:flex-1 px-3 sm:px-4 py-2.5 font-sans text-xs sm:text-sm tracking-wide transition-colors border-r border-secondary/20 last:border-r-0 ${
                    originSlug === city.slug
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-black hover:bg-secondary/50'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-secondary/20 pt-2">
              {blocks.map((block, index) => {
                const isOpen = openBlockId === block.transport_type
                const num = index + 1
                const heading = `${selectedCity.name} — ${block.title}`
                return (
                  <div
                    key={block.transport_type}
                    className="border-b border-secondary/20 last:border-b-0 transition-colors duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenBlockId(isOpen ? null : block.transport_type)}
                      className="w-full flex items-center gap-2 sm:gap-4 py-4 sm:py-5 text-left font-sans text-black hover:opacity-90 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      aria-expanded={isOpen}
                      aria-controls={`route-${selectedCity.slug}-${block.transport_type}`}
                      id={`route-heading-${selectedCity.slug}-${block.transport_type}`}
                    >
                      <span className="font-bold text-black shrink-0 w-5 sm:w-6 text-sm sm:text-base">{num}</span>
                      <span className="font-bold tracking-wide text-sm sm:text-base min-w-0 break-words">{heading}</span>
                      <span className="flex-1 min-w-0" />
                      <span
                        className="shrink-0 w-5 h-5 flex items-center justify-center text-black/70 font-mono text-lg leading-none"
                        aria-hidden
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      id={`route-${selectedCity.slug}-${block.transport_type}`}
                      role="region"
                      aria-labelledby={`route-heading-${selectedCity.slug}-${block.transport_type}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="flex gap-4 pb-5 pl-10 min-h-0 overflow-hidden">
                        <p className="flex-1 font-sans text-black/80 leading-relaxed text-sm md:text-base whitespace-pre-line break-words">
                          {block.content || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            </>
            ) : (
              <p className="mt-6 font-sans text-black/70">{t('howToGet.empty')}</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
