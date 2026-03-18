import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchLegalPage } from '@/lib/api'

export default async function PaymentPage() {
  const content = await fetchLegalPage('payment', 'ru')
  const title = content?.title || 'Условия оплаты'

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight mb-8">
            {title}
          </h1>
          <LegalPageContent content={content?.content || ''} />
        </div>
      </section>
    </PageLayout>
  )
}
