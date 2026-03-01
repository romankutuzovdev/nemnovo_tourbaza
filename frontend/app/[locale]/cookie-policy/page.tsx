import { PageLayout } from '@/components/PageLayout'
import { fetchLegalPage } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export default async function CookiePolicyPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  const content = await fetchLegalPage('cookie-policy', locale)

  const title = content?.title || ''
  const paragraphs = content?.content
    ? content.content.split('\n\n').filter(p => p.trim())
    : []

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight mb-8">
            {title}
          </h1>
          <div className="font-sans text-black/80 leading-relaxed space-y-6">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
