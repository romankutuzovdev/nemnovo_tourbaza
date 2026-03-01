import { PageLayout } from '@/components/PageLayout'
import { AgenciesSection } from '@/components/AgenciesSection'
import { fetchAgenciesPage } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export default async function AgenciesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  const content = await fetchAgenciesPage(locale)
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink moreTopPadding>
      <AgenciesSection content={content} />
    </PageLayout>
  )
}
