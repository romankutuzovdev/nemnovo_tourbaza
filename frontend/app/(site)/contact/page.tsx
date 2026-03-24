'use client'

import { PageLayout } from '@/components/PageLayout'
import { ContactSection } from '@/components/ContactSection'

export default function ContactPage() {
  return (
    <PageLayout simpleHomeLink hideBreadcrumbs headerClassName="!pt-24 md:!pt-20 !pb-4 md:!pb-6">
      <ContactSection />
    </PageLayout>
  )
}
