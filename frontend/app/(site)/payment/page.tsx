import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchLegalPage } from '@/lib/api'

export default async function PaymentPage() {
  const content = await fetchLegalPage('payment', 'ru')
  const title = content?.title || 'Условия оплаты'

  return (
    <PageLayout simpleHomeLink hideBreadcrumbs title={title} titlePrimary>
      <section className="pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <LegalPageContent content={content?.content || ''} />
        </div>
      </section>
    </PageLayout>
  )
}
