import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { PromosSection } from '@/components/PromosSection'
import { PartnersSection } from '@/components/PartnersSection'
import { MapSection } from '@/components/MapSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ReviewsSection />
      <PromosSection />
      <ServicesSection />
      <MapSection />
      <PartnersSection />
    </>
  )
}
