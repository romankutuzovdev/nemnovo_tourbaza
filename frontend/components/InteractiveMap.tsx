'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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

const MAP_IMAGE = '/images/mapa-nemnovo.png'

// Фото с Unsplash (домики, природа, отдых). w=1200 — крупный размер для качества.
const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
  'https://images.unsplash.com/photo-1518837695004-712fe8e8f610?w=1200',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1200',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200',
]

// Домики и палатки — синие кружки с номерами (координаты из калибровки).
const MAP_AREAS: MapArea[] = [
  { id: 'berloga', name: '9 Берлога', number: '9', left: 42.1, top: 4.6, width: 10, height: 8, photos: [DEMO_PHOTOS[0], DEMO_PHOTOS[4], DEMO_PHOTOS[5]] },
  { id: 'paparats-kvetka', name: '10 Папараць-кветка', number: '10', left: 34.2, top: 14.3, width: 10, height: 8, photos: [DEMO_PHOTOS[1], DEMO_PHOTOS[6]] },
  { id: 'kolobok', name: '8 Колобок', number: '8', left: 43.8, top: 21.7, width: 10, height: 8, photos: [DEMO_PHOTOS[2], DEMO_PHOTOS[7]] },
  { id: 'ladya', name: '7 Ладья', number: '7', left: 43.2, top: 30.5, width: 10, height: 8, photos: [DEMO_PHOTOS[3], DEMO_PHOTOS[8]] },
  { id: 'cherny-voron', name: '11 Черный ворон', number: '11', left: 31.9, top: 32.9, width: 10, height: 8, photos: [DEMO_PHOTOS[4], DEMO_PHOTOS[9]] },
  { id: 'stolik-bobra', name: '12 Столик бобра', number: '12', left: 34.6, top: 42.4, width: 10, height: 8, photos: [DEMO_PHOTOS[5], DEMO_PHOTOS[10]] },
  { id: 'berezki', name: '6 Березки', number: '6', left: 42.3, top: 45.9, width: 10, height: 8, photos: [DEMO_PHOTOS[6], DEMO_PHOTOS[11]] },
  { id: 'ochag-bylin', name: '14 Очаг былин', number: '14', left: 28.2, top: 45.5, width: 10, height: 8, photos: [DEMO_PHOTOS[7], DEMO_PHOTOS[12]] },
  { id: 'ogon-peruna', name: '12+1 Огонь Перуна', number: '12+1', left: 21.6, top: 56.4, width: 10, height: 8, photos: [DEMO_PHOTOS[8], DEMO_PHOTOS[13]] },
  { id: 'tihaya-zatoka', name: '15 Тихая затока', number: '15', left: 28.6, top: 71.7, width: 10, height: 8, photos: [DEMO_PHOTOS[0], DEMO_PHOTOS[14]] },
  { id: 'zeleny-dyatel', name: '16 Зеленый дятел', number: '16', left: 16.1, top: 78.4, width: 10, height: 8, photos: [DEMO_PHOTOS[1], DEMO_PHOTOS[2]] },
  { id: 'buhta-gerodota', name: '18 Бухта Геродота', number: '18', left: 38.8, top: 60.1, width: 10, height: 8, photos: [DEMO_PHOTOS[2], DEMO_PHOTOS[3]] },
  { id: 'tent-23', name: 'Палатка 23', number: '23', left: 41.6, top: 52.1, width: 10, height: 8, photos: [DEMO_PHOTOS[3], DEMO_PHOTOS[4]] },
  { id: 'tent-22', name: 'Палатка 22', number: '22', left: 48.0, top: 45.6, width: 10, height: 8, photos: [DEMO_PHOTOS[4], DEMO_PHOTOS[5]] },
  { id: 'syabry', name: '5 Сябры', number: '5', left: 54.3, top: 54.7, width: 10, height: 8, photos: [DEMO_PHOTOS[5], DEMO_PHOTOS[6]] },
  { id: 'polka', name: '4 Полька', number: '4', left: 64.8, top: 57.0, width: 10, height: 8, photos: [DEMO_PHOTOS[6], DEMO_PHOTOS[7]] },
  { id: 'karchma', name: '3 Карчма', number: '3', left: 65.7, top: 73.6, width: 10, height: 8, photos: [DEMO_PHOTOS[7], DEMO_PHOTOS[8]] },
  { id: 'gavan', name: '2 Тихая гавань', number: '2', left: 65.3, top: 80.3, width: 10, height: 8, photos: [DEMO_PHOTOS[8], DEMO_PHOTOS[9]] },
  { id: 'mokry-kot', name: '19 Мокрый кот', number: '19', left: 58.5, top: 82.2, width: 10, height: 8, photos: [DEMO_PHOTOS[9], DEMO_PHOTOS[10]] },
  { id: 'uzhyk', name: '1 Ужик', number: '1', left: 90.5, top: 61.9, width: 10, height: 8, photos: [DEMO_PHOTOS[10], DEMO_PHOTOS[11]] },
  { id: 'melnitsa', name: '24 Мельница', number: '24', left: 83.3, top: 67.9, width: 10, height: 8, photos: [DEMO_PHOTOS[11], DEMO_PHOTOS[12]] },
]

type Props = {
  className?: string
}

export function InteractiveMap({ className = '' }: Props) {
  const searchParams = useSearchParams()
  const calibrate = searchParams.get('calibrate') === '1'

  const [activeArea, setActiveArea] = useState<MapArea | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [calibrationResults, setCalibrationResults] = useState<Array<{ name: string; left: number; top: number }>>([])
  const mapRef = useRef<HTMLDivElement>(null)

  const photos = activeArea?.photos ?? []
  const hasPhotos = photos.length > 0

  const handleCalibrationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || calibrationStep >= MAP_AREAS.length) return
    const rect = mapRef.current.getBoundingClientRect()
    const left = ((e.clientX - rect.left) / rect.width) * 100
    const top = ((e.clientY - rect.top) / rect.height) * 100
    const area = MAP_AREAS[calibrationStep]
    setCalibrationResults((prev) => [...prev, { name: area.name, left, top }])
    setCalibrationStep((s) => s + 1)
    console.log(`${area.id}: left: ${left.toFixed(1)}, top: ${top.toFixed(1)}, width: 10, height: 8`)
  }

  useEffect(() => {
    if (activeArea) setLightboxIndex(0)
  }, [activeArea])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveArea(null)
      else if (activeArea && hasPhotos) {
        if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1))
        if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(photos.length - 1, i + 1))
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
  }, [activeArea, hasPhotos, photos.length])

  return (
    <div className={`w-full ${className}`}>
      {calibrate && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded font-mono text-sm">
          <p className="font-sans font-bold text-amber-800 mb-2">Режим калибровки</p>
          {calibrationStep < MAP_AREAS.length ? (
            <p className="text-amber-900">
              Кликните на: <strong>{MAP_AREAS[calibrationStep].name}</strong> ({calibrationStep + 1}/{MAP_AREAS.length})
            </p>
          ) : (
            <p className="text-green-800 font-bold">Готово. Скопируйте координаты ниже и отправьте.</p>
          )}
          {calibrationResults.length > 0 && (
            <pre className="mt-3 overflow-x-auto text-xs bg-white p-2 rounded border border-amber-100">
              {calibrationResults.map((r, i) => `${MAP_AREAS[i].id}: left: ${r.left.toFixed(1)}, top: ${r.top.toFixed(1)}, width: 10, height: 8`).join('\n')}
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
        {!calibrate && MAP_AREAS.map((area) => {
          const size = 4.2
          const half = size / 2
          return (
            <button
              key={area.id}
              type="button"
              className="absolute rounded-full bg-primary/60 text-white border border-primary shadow-sm hover:bg-primary/75 focus:bg-primary/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-all duration-200 hover:scale-110 touch-manipulation origin-center flex items-center justify-center font-sans font-bold text-[9px] sm:text-[10px] leading-none"
              style={{
                left: `${area.left - half}%`,
                top: `${area.top - half}%`,
                width: `${size}%`,
                height: `${size}%`,
                minWidth: 20,
                minHeight: 20,
              }}
              onClick={() => setActiveArea(area)}
              aria-label={area.name}
              title={area.name}
            >
              {area.number}
            </button>
          )
        })}
      </div>

      {activeArea && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
          onClick={() => setActiveArea(null)}
          role="dialog"
          aria-modal
          aria-label={`${activeArea.name} — фотографии`}
        >
          <div
            className="flex flex-col items-center w-full max-w-6xl flex-1 min-h-0 px-4 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-xs font-sans mb-2">{activeArea.name}</p>

            {hasPhotos ? (
              <>
                <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
                  <Image
                    src={photos[lightboxIndex]}
                    alt={`${activeArea.name} — фото ${lightboxIndex + 1}`}
                    width={1600}
                    height={1200}
                    className="max-h-[88vh] w-auto h-auto object-contain"
                    sizes="(max-width: 1200px) 100vw, 1280px"
                  />
                </div>
                <div className="flex items-center justify-center gap-6 py-4">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                    disabled={lightboxIndex === 0}
                    className="text-white/60 hover:text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="text-white/50 text-xs tabular-nums">
                    {lightboxIndex + 1} / {photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((i) => Math.min(photos.length - 1, i + 1))}
                    disabled={lightboxIndex === photos.length - 1}
                    className="text-white/60 hover:text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </>
            ) : (
              <p className="font-sans text-white/60 text-sm py-8">Фотографии скоро появятся</p>
            )}

            <button
              type="button"
              onClick={() => setActiveArea(null)}
              className="text-white/50 hover:text-white/80 text-xs font-sans pb-4"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
