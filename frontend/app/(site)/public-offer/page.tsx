import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchLegalPage } from '@/lib/api'

export default async function PublicOfferPage() {
  const content = await fetchLegalPage('public-offer', 'ru')
  const title = content?.title || 'Публичная оферта'
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
