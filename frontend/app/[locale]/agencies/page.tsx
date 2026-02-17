'use client'

import { PageLayout } from '@/components/PageLayout'
import { AgenciesSection } from '@/components/AgenciesSection'

export default function AgenciesPage() {
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink moreTopPadding>
      <AgenciesSection />
    </PageLayout>
  )
}
