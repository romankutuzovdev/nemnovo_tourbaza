'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type Variant = 'fade-up' | 'fade-in' | 'left' | 'right' | 'scale'

type Props = {
  children: ReactNode
  variant?: Variant
  delay?: number
  className?: string
  once?: boolean
}

const variantClass: Record<Variant, string> = {
  'fade-up': 'animate-on-scroll',
  'fade-in': 'animate-on-scroll-fade',
  left: 'animate-on-scroll-left',
  right: 'animate-on-scroll-right',
  scale: 'animate-on-scroll-scale',
}

export function AnimateOnScroll({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const apply = () => setVisible(true)
            if (delay > 0) setTimeout(apply, delay)
            else apply()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delay, once])

  const style = delay > 0 && !visible ? { transitionDelay: `${delay}ms` } : undefined
  const visibleClass = visible ? 'is-visible' : ''

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${visibleClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
