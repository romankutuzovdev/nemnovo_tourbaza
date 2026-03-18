import { PageLayout } from '@/components/PageLayout'
import { AgenciesSection } from '@/components/AgenciesSection'
import { fetchAgenciesPage } from '@/lib/api'

export default async function AgenciesPage() {
  const content = await fetchAgenciesPage('ru')
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink moreTopPadding>
      <AgenciesSection content={content} />
    </PageLayout>
  )
}
