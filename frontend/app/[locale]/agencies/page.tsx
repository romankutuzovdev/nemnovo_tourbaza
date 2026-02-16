'use client'

import { useTranslations } from 'next-intl'
import { PageLayout } from '@/components/PageLayout'
import { AgenciesSection } from '@/components/AgenciesSection'

export default function AgenciesPage() {
  const t = useTranslations('agencies')
  return (
    <PageLayout
      badge={t('badge')}
      title={t('title')}
      description={t('intro')}
      titlePrimary
    >
      <AgenciesSection />
    </PageLayout>
  )
}
