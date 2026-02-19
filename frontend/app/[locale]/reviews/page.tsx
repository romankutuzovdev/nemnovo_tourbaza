'use client'

import { PageLayout } from '@/components/PageLayout'
import { ReviewsListSection } from '@/components/ReviewsListSection'
import { ComplaintFormSection } from '@/components/ComplaintFormSection'

export default function ReviewsPage() {
  return (
    <PageLayout simpleHomeLink hideBreadcrumbs>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-8 pb-3 md:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <aside className="lg:sticky lg:top-24">
            <ComplaintFormSection />
          </aside>
          <div className="min-w-0">
            <ReviewsListSection scrollable />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
