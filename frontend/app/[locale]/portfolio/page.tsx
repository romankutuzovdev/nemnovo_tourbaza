'use client'

import { PageLayout } from '@/components/PageLayout'
import { PortfolioSection } from '@/components/PortfolioSection'

export default function PortfolioPage() {
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink moreTopPadding>
      <PortfolioSection />
    </PageLayout>
  )
}
