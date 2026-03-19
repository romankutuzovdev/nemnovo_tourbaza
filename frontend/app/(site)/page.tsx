import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { EventsSection } from '@/components/EventsSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { PromosSection } from '@/components/PromosSection'
import { CertificateSection } from '@/components/CertificateSection'
import { PartnersSection } from '@/components/PartnersSection'
import { MapSection } from '@/components/MapSection'
import { fetchHeroContent, fetchAboutContent, fetchReviewsStatsContent } from '@/lib/api'

export default async function HomePage() {
  const [heroContent, aboutContent, reviewsStatsContent] = await Promise.all([
    fetchHeroContent('ru'),
    fetchAboutContent('ru', 'main'),
    fetchReviewsStatsContent('ru'),
  ])

  return (
    <>
      <Hero content={heroContent} />
      <AboutSection content={aboutContent} />
      <ReviewsSection statsContent={reviewsStatsContent} />
      <PromosSection />
      <ServicesSection />
      <EventsSection />
      <CertificateSection />
      <MapSection />
      <PartnersSection />
    </>
  )
}
