'use client'

import { AnimateOnScroll } from './AnimateOnScroll'

function getEmbedUrl(url: string): string | null {
  try {
    const u = url.trim()
    if (u.includes('youtube.com/watch') || u.includes('youtu.be/')) {
      const match = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
      return match ? `https://www.youtube.com/embed/${match[1]}` : null
    }
    if (u.includes('vimeo.com/')) {
      const match = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
      return match ? `https://player.vimeo.com/video/${match[1]}` : null
    }
    return null
  } catch {
    return null
  }
}

type Props = { videoUrl?: string | null }

export function VideoSection({ videoUrl }: Props) {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">
            Презентация турбазы
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll variant="scale" delay={80}>
          <div className="mt-10 aspect-video bg-secondary/50 border border-secondary/10 rounded-sm overflow-hidden transition-all duration-300 hover:border-secondary/20 hover:shadow-lg">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Презентация турбазы"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-sans text-sm text-black/80">Видео-презентация</span>
              </div>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
