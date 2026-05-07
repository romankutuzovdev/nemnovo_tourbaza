import { PageLayout } from '@/components/PageLayout'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'
import { fetchAboutContent } from '@/lib/api'

export default async function AboutPage() {
  const content = await fetchAboutContent('ru', 'about')
  const hasVideo = Boolean(content?.video_url?.trim())
  const hasPresentationPdf = Boolean(content?.presentation_pdf?.trim())

  return (
    <PageLayout hideBreadcrumbs simpleHomeLink titlePrimary>
      <AboutSection content={content} />
      {(hasVideo || hasPresentationPdf) && (
        <VideoSection videoUrl={content?.video_url} presentationPdfUrl={content?.presentation_pdf} />
      )}
    </PageLayout>
  )
}
