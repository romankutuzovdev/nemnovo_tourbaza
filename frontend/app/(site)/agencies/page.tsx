import { PageLayout } from '@/components/PageLayout'
import { AgenciesSection } from '@/components/AgenciesSection'
import { fetchAgenciesPage } from '@/lib/api'
import { getTranslations } from 'next-intl/server'

export default async function AgenciesPage() {
  const t = await getTranslations()
  const content = await fetchAgenciesPage('ru')
  const title = t('nav.agencies')
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink title={title} titlePrimary>
      <AgenciesSection content={content} hideTitle />
    </PageLayout>
  )
}
