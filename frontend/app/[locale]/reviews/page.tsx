'use client'

import { PageLayout } from '@/components/PageLayout'
import { ReviewsListSection } from '@/components/ReviewsListSection'
import { ComplaintFormSection } from '@/components/ComplaintFormSection'

export default function ReviewsPage() {
  return (
    <PageLayout>
      <ReviewsListSection />
      <ComplaintFormSection />
    </PageLayout>
  )
}
