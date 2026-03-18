'use client'

import { PageLayout } from '@/components/PageLayout'
import { ContactSection } from '@/components/ContactSection'

export default function ContactPage() {
  return (
    <PageLayout simpleHomeLink hideBreadcrumbs>
      <ContactSection />
    </PageLayout>
  )
}
