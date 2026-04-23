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
    <PageLayout title={title} titlePrimary simpleHomeLink hideBreadcrumbs>
      <section className="pt-4 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
