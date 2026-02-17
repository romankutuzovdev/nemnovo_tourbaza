'use client'

import { PageLayout } from '@/components/PageLayout'
import { PromosSection } from '@/components/PromosSection'

export default function PromosPage() {
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink moreTopPadding>
      <PromosSection />
    </PageLayout>
  )
}
