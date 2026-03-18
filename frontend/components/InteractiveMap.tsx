'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { MapAreaItem } from '@/lib/api'
import { fetchMapAreas, getApiUrl } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export type MapArea = {
  id: string
  name: string
  number: string
  left: number
  top: number
  width: number
  height: number
  photos?: string[]
}

const MAP_IMAGE = '/map.png'

// Статические области карты (домики, палатки) без привязки к услуге.
// Беседки добавляются через админку Django → Области карты.
const STATIC_MAP_AREAS: MapArea[] = [
  { id: 'berloga', name: '9 Берлога', number: '9', left: 42.1, top: 7.1, width: 10, height: 8 },
  { id: 'paparats-kvetka', name: '10 Папараць-кветка', number: '10', left: 35.9, top: 16.1, width: 10, height: 8 },
  { id: 'kolobok', name: '8 Колобок', number: '8', left: 44.0, top: 24.1, width: 10, height: 8 },
  { id: 'ladya', name: '7 Ладья', number: '7', left: 43.3, top: 32.4, width: 10, height: 8 },
  { id: 'cherny-voron', name: '11 Черный ворон', number: '11', left: 32.9, top: 34.6, width: 10, height: 8 },
  { id: 'stolik-bobra', name: '12 Столик бобра', number: '12', left: 34.9, top: 44.7, width: 10, height: 8 },
  { id: 'berezki', name: '6 Березки', number: '6', left: 42.4, top: 47.8, width: 10, height: 8 },
  { id: 'ochag-bylin', name: '14 Очаг былин', number: '14', left: 28.3, top: 47.3, width: 10, height: 8 },
  { id: 'ogon-peruna', name: '12+1 Огонь Перуна', number: '12+1', left: 22.0, top: 57.8, width: 10, height: 8 },
  { id: 'tihaya-zatoka', name: '15 Тихая затока', number: '15', left: 28.5, top: 73.7, width: 10, height: 8 },
  { id: 'zeleny-dyatel', name: '16 Зеленый дятел', number: '16', left: 16.7, top: 80.3, width: 10, height: 8 },
  { id: 'buhta-gerodota', name: '18 Бухта Геродота', number: '18', left: 38.5, top: 60.9, width: 10, height: 8 },
  { id: 'tent-23', name: 'Палатка 23', number: '23', left: 42.2, top: 54.4, width: 10, height: 8 },
  { id: 'tent-22', name: 'Палатка 22', number: '22', left: 48.5, top: 47.9, width: 10, height: 8 },
  { id: 'syabry', name: '5 Сябры', number: '5', left: 53.5, top: 57.0, width: 10, height: 8 },
  { id: 'polka', name: '4 Полька', number: '4', left: 64.3, top: 59.4, width: 10, height: 8 },
  { id: 'karchma', name: '3 Карчма', number: '3', left: 65.3, top: 75.8, width: 10, height: 8 },
  { id: 'gavan', name: '2 Тихая гавань', number: '2', left: 65.6, top: 82.5, width: 10, height: 8 },
  { id: 'mokry-kot', name: '19 Мокрый кот', number: '19', left: 59.3, top: 84.7, width: 10, height: 8 },
  { id: 'uzhyk', name: '1 Ужик', number: '1', left: 89.8, top: 64.6, width: 10, height: 8 },
  { id: 'melnitsa', name: '24 Мельница', number: '24', left: 83.6, top: 69.1, width: 10, height: 8 },
]

type ActiveArea =
  | { kind: 'static'; area: MapArea }
  | { kind: 'service'; area: MapAreaItem }

type Props = {
  className?: string
  locale?: Locale
}

function toAbsoluteImageUrl(value: string): string {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  const base = getApiUrl()
  return base ? `${base}${value}` : value
}

export function InteractiveMap({ className = '', locale = 'ru' }: Props) {
  const searchParams = useSearchParams()
  const calibrate = searchParams.get('calibrate') === '1'

  const [activeArea, setActiveArea] = useState<ActiveArea | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [sliderIdx, setSliderIdx] = useState(0)
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [calibrationResults, setCalibrationResults] = useState<Array<{ name: string; left: number; top: number }>>([])
  const [apiAreas, setApiAreas] = useState<MapAreaItem[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMapAreas(locale).then(setApiAreas)
  }, [locale])

  const staticPhotos = activeArea?.kind === 'static' ? (activeArea.area.photos ?? []) : []
  const hasPhotos = staticPhotos.length > 0

  const handleCalibrationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || calibrationStep >= STATIC_MAP_AREAS.length) return
    const rect = mapRef.current.getBoundingClientRect()
    const left = ((e.clientX - rect.left) / rect.width) * 100
    const top = ((e.clientY - rect.top) / rect.height) * 100
    const area = STATIC_MAP_AREAS[calibrationStep]
    setCalibrationResults((prev) => [...prev, { name: area.name, left, top }])
    setCalibrationStep((s) => s + 1)
    console.log(`${area.id}: left: ${left.toFixed(1)}, top: ${top.toFixed(1)}, width: 10, height: 8`)
  }

  useEffect(() => {
    if (activeArea) {
      setLightboxIndex(0)
      setSliderIdx(0)
    }
  }, [activeArea])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveArea(null)
      else if (activeArea?.kind === 'static' && hasPhotos) {
        if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1))
        if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(staticPhotos.length - 1, i + 1))
      }
    }
    if (activeArea) {
      document.addEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeArea, hasPhotos, staticPhotos.length])

  const baseW = 5.6
  function getWidth(id: string) {
    if (id === 'ogon-peruna') return baseW * 1.56
    if (id === 'zeleny-dyatel') return baseW * 1.2
    if (id === 'paparats-kvetka') return baseW * 1.573
    if (id === 'cherny-voron') return baseW * 1.1
    if (id === 'stolik-bobra') return baseW * 1.15
    if (id === 'buhta-gerodota') return baseW * 1.2
    if (id === 'tihaya-zatoka') return baseW * 1.15
    if (['gavan', 'karchma', 'mokry-kot'].includes(id)) return baseW * 1.15
    return baseW
  }
  function getTransform(id: string) {
    if (id === 'zeleny-dyatel') return 'translate(-50%, calc(-50% - 3px))'
    if (['ogon-peruna', 'gavan', 'karchma', 'mokry-kot'].includes(id)) return 'translate(-50%, calc(-50% - 2px))'
    return 'translate(-50%, -50%)'
  }

  return (
    <div className={`w-full ${className}`}>
      {calibrate && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded font-mono text-sm">
          <p className="font-sans font-bold text-amber-800 mb-2">Режим калибровки</p>
          {calibrationStep < STATIC_MAP_AREAS.length ? (
            <p className="text-amber-900">
              Кликните на: <strong>{STATIC_MAP_AREAS[calibrationStep].name}</strong> ({calibrationStep + 1}/{STATIC_MAP_AREAS.length})
            </p>
          ) : (
            <p className="text-green-800 font-bold">Готово. Скопируйте координаты ниже и отправьте.</p>
          )}
          {calibrationResults.length > 0 && (
            <pre className="mt-3 overflow-x-auto text-xs bg-white p-2 rounded border border-amber-100">
              {calibrationResults.map((r, i) => `${STATIC_MAP_AREAS[i].id}: left: ${r.left.toFixed(1)}, top: ${r.top.toFixed(1)}, width: 10, height: 8`).join('\n')}
            </pre>
          )}
        </div>
      )}
      <div
        ref={mapRef}
        className="relative w-full"
        style={{ aspectRatio: '1024/724' }}
        onClick={calibrate ? handleCalibrationClick : undefined}
        role={calibrate ? 'button' : undefined}
        tabIndex={calibrate ? 0 : undefined}
      >
        <Image
          src={MAP_IMAGE}
          alt="Карта турбазы Немново"
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-contain select-none"
          priority
          draggable={false}
        />
        {!calibrate && (
          <>
            {/* Области из базы данных — красные */}
            {apiAreas.map((area) => (
              <div
                key={area.area_id}
                className="absolute"
                style={{
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  width: `${baseW * 1.2}%`,
                  height: `2.56%`,
                  minWidth: 35,
                  minHeight: 22,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button
                  type="button"
                  className="w-full h-full rounded-[50%] bg-red-600 text-white border border-red-700 shadow-sm hover:bg-red-500 focus:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1 transition-all duration-200 hover:scale-110 touch-manipulation flex items-center justify-center font-sans font-bold text-[8px] sm:text-[9px] leading-none origin-center"
                  onClick={() => setActiveArea({ kind: 'service', area })}
                  aria-label={area.name}
                  title={area.name}
                >
                  {area.number}
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Попап для статических областей (фото-лайтбокс) */}
      {activeArea?.kind === 'static' && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
          onClick={() => setActiveArea(null)}
          role="dialog"
          aria-modal
          aria-label={`${activeArea.area.name} — фотографии`}
        >
          <div
            className="flex flex-col items-center w-full max-w-6xl flex-1 min-h-0 px-4 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-xs font-sans mb-2">{activeArea.area.name}</p>
            {hasPhotos ? (
              <>
                <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
                  <Image
                    src={staticPhotos[lightboxIndex]}
                    alt={`${activeArea.area.name} — фото ${lightboxIndex + 1}`}
                    width={1600}
                    height={1200}
                    className="max-h-[88vh] w-auto h-auto object-contain"
                    sizes="(max-width: 1200px) 100vw, 1280px"
                  />
                </div>
                <div className="flex items-center justify-center gap-6 py-4">
                  <button type="button" onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))} disabled={lightboxIndex === 0} className="text-white/60 hover:text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed">←</button>
                  <span className="text-white/50 text-xs tabular-nums">{lightboxIndex + 1} / {staticPhotos.length}</span>
                  <button type="button" onClick={() => setLightboxIndex((i) => Math.min(staticPhotos.length - 1, i + 1))} disabled={lightboxIndex === staticPhotos.length - 1} className="text-white/60 hover:text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed">→</button>
                </div>
              </>
            ) : (
              <p className="font-sans text-white/60 text-sm py-8">Фотографии скоро появятся</p>
            )}
            <button type="button" onClick={() => setActiveArea(null)} className="text-white/50 hover:text-white/80 text-xs font-sans pb-4">Закрыть</button>
          </div>
        </div>
      )}

      {/* Попап для областей с услугой (беседки) — карточка с фото и описанием */}
      {activeArea?.kind === 'service' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveArea(null)}
          role="dialog"
          aria-modal
          aria-label={activeArea.area.name}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const imgs = (activeArea.area.service_images?.length
                ? activeArea.area.service_images
                : activeArea.area.service_image
                  ? [activeArea.area.service_image]
                  : []
              ).map(toAbsoluteImageUrl)
              if (imgs.length === 0) return null
              return (
                <div className="relative aspect-[16/9] w-full bg-black">
                  <Image
                    key={sliderIdx}
                    src={imgs[sliderIdx]}
                    alt={activeArea.area.service_title ?? activeArea.area.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover"
                  />
                  {imgs.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSliderIdx((i) => Math.max(0, i - 1)) }}
                        disabled={sliderIdx === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                        aria-label="Предыдущее фото"
                      >‹</button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSliderIdx((i) => Math.min(imgs.length - 1, i + 1)) }}
                        disabled={sliderIdx === imgs.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                        aria-label="Следующее фото"
                      >›</button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                        {imgs.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSliderIdx(i) }}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === sliderIdx ? 'bg-white' : 'bg-white/40'}`}
                            aria-label={`Фото ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })()}
            <div className="p-5">
              <p className="font-sans text-xs text-black/40 mb-1">{activeArea.area.name}</p>
              <h3 className="font-serif text-xl font-medium text-black tracking-tight mb-2">
                {activeArea.area.service_title ?? activeArea.area.name}
              </h3>
              {activeArea.area.service_short_desc && (
                <p className="font-sans text-sm text-black/70 leading-relaxed mb-4">
                  {activeArea.area.service_short_desc}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                {activeArea.area.service_slug && (
                  <Link
                    href={`/services/${activeArea.area.service_slug}`}
                    className="font-sans text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setActiveArea(null)}
                  >
                    Подробнее →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveArea(null)}
                  className="font-sans text-sm text-black/50 hover:text-black transition-colors ml-auto"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
