import { PageLayout } from '@/components/PageLayout'
import { AboutSection } from '@/components/AboutSection'
import { VideoSection } from '@/components/VideoSection'
import { fetchAboutContent } from '@/lib/api'

export default async function AboutPage() {
  const content = await fetchAboutContent('ru', 'about')
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink>
      <AboutSection content={content} />
      <VideoSection videoUrl={content?.video_url} />
    </PageLayout>
  )
}
