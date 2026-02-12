'use client'

import { PageLayout } from '@/components/PageLayout'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutSection />
      <VideoSection />
    </PageLayout>
  )
}
