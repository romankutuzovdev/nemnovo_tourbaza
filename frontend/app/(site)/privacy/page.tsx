import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchLegalPage } from '@/lib/api'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchLegalPage('privacy', 'ru')
  return {
    title: content?.seo_title?.trim() || content?.title || 'Политика обработки персональных данных',
    description: content?.seo_description?.trim() || content?.title || 'Политика обработки персональных данных',
  }
}

export default async function PrivacyPage() {
  const content = await fetchLegalPage('privacy', 'ru')
  const title = content?.title || 'Политика обработки персональных данных'
  const body = content?.content?.trim() || ''

  return (
    <PageLayout title={title} titlePrimary simpleHomeLink hideBreadcrumbs>
      <section className="pt-4 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {body ? (
            <LegalPageContent content={body} />
          ) : (
            <p className="font-sans text-black/70">Содержание будет добавлено.</p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
