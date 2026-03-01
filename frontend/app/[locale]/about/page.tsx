import { PageLayout } from '@/components/PageLayout'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'
import { fetchAboutContent } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  const content = await fetchAboutContent(locale)
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink>
      <AboutSection content={content} />
      <VideoSection />
    </PageLayout>
  )
}
