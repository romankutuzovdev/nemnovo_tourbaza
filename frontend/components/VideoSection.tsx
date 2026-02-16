'use client'

import { AnimateOnScroll } from './AnimateOnScroll'

export function VideoSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">
            Презентация турбазы
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll variant="scale" delay={80}>
          <div className="mt-10 aspect-video bg-secondary/50 border border-secondary/10 rounded-sm flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-secondary/20 hover:shadow-lg">
            <span className="font-sans text-sm text-black/80">Видео-презентация</span>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
