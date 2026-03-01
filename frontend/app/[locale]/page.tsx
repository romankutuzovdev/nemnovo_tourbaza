import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { EventsSection } from '@/components/EventsSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { PromosSection } from '@/components/PromosSection'
import { PartnersSection } from '@/components/PartnersSection'
import { MapSection } from '@/components/MapSection'
import { fetchHeroContent, fetchAboutContent } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  const [heroContent, aboutContent] = await Promise.all([
    fetchHeroContent(locale),
    fetchAboutContent(locale),
  ])

  return (
    <>
      <Hero content={heroContent} />
      <AboutSection content={aboutContent} />
      <ReviewsSection />
      <PromosSection />
      <ServicesSection />
      <EventsSection />
      <MapSection />
      <PartnersSection />
    </>
  )
}
