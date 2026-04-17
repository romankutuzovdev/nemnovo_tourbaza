import { PageLayout } from '@/components/PageLayout'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'
import { fetchAboutContent } from '@/lib/api'

export default async function AboutPage() {
  const content = await fetchAboutContent('ru', 'about')
  const title = content?.title || 'О нас'
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink title={title} titlePrimary>
      <AboutSection content={content} hideTitle />
      <VideoSection videoUrl={content?.video_url} />
    </PageLayout>
  )
}
