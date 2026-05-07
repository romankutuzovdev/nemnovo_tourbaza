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

type Props = {
  videoUrl?: string | null
  presentationPdfUrl?: string | null
}

export function VideoSection({ videoUrl, presentationPdfUrl }: Props) {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  return (
    <section className="app-section-lg bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">
            Презентация турбазы
          </h2>
        </AnimateOnScroll>
        {embedUrl && (
          <AnimateOnScroll variant="scale" delay={80}>
            <div className="app-section-body aspect-video bg-secondary/50 border border-secondary/10 rounded-sm overflow-hidden transition-all duration-300 hover:border-secondary/20 hover:shadow-lg">
              <iframe
                src={embedUrl}
                title="Презентация турбазы"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </AnimateOnScroll>
        )}
        {presentationPdfUrl && (
          <div className="mt-6">
            <a
              href={presentationPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M7 3h7l5 5v13H7z" />
                <path d="M14 3v5h5" />
                <path d="M9 12h6M9 16h6" />
              </svg>
              Скачать презентацию (PDF)
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
