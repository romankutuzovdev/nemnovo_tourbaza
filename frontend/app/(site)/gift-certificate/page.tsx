import { PageLayout } from '@/components/PageLayout'
import { LegalPageContent } from '@/components/LegalPageContent'
import { fetchCertificateContent, fetchLegalPage } from '@/lib/api'

export default async function GiftCertificatePage() {
  const [certContent, legalContent] = await Promise.all([
    fetchCertificateContent('ru'),
    fetchLegalPage('gift-certificate', 'ru'),
  ])

  const title = certContent?.title || legalContent?.title || 'Подарочный сертификат'
  const body = (certContent?.content?.trim() || legalContent?.content?.trim()) || ''

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight mb-8">
            {title}
          </h1>
          {body ? (
            <LegalPageContent content={body} />
          ) : (
            <p className="font-sans text-black/70">Описание подарочного сертификата будет добавлено.</p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
