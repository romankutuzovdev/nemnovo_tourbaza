import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchLegalPage } from '@/lib/api'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchLegalPage('payment', 'ru')
  return {
    title: content?.seo_title?.trim() || content?.title || 'Условия оплаты',
    description: content?.seo_description?.trim() || content?.title || 'Условия оплаты',
  }
}

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
