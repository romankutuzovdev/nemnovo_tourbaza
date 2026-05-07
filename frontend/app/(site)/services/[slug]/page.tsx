import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchServiceBySlug, fetchServices, getServiceImageSrc, toAbsoluteMediaUrl } from '@/lib/api'
import { ServiceImageSlider } from '@/components/ServiceImageSlider'
import { ServiceQuestionnaireForm } from '@/components/ServiceQuestionnaireForm'
import { ServiceContent } from '@/components/ServiceContent'
import { ServicePurchasePanel } from '@/components/ServicePurchasePanel'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await fetchServiceBySlug(slug, 'ru')
  if (!service) return { title: 'Услуга не найдена' }
  return {
    title: service.seo_title?.trim() || service.title,
    description: service.seo_description?.trim() || service.short_desc,
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params

  const [service, servicesList] = await Promise.all([
    fetchServiceBySlug(slug, 'ru'),
    fetchServices('ru'),
  ])
  if (!service) notFound()

  const t = await getTranslations()
  const hasChildren = service.children && service.children.length > 0
  const children = service.children ?? []
  const serviceTitle = service.title
  const serviceShortDesc = service.short_desc
  const imageSrc = getServiceImageSrc(service)
  const images = service.images && service.images.length > 0 ? service.images : (imageSrc ? [imageSrc] : [])
  const price = service.price ? Number(service.price) : null

  if (hasChildren) {
    return (
      <div className="min-h-screen bg-white">
        <header className="pt-6 md:pt-8 pb-3 md:pb-4 max-w-6xl mx-auto px-3 sm:px-6">
          <Link
            href="/services"
            translate="no"
            className="notranslate inline-flex items-center gap-2 whitespace-nowrap font-sans text-sm text-black/80 hover:text-black transition-colors mb-4"
          >
            <span aria-hidden>←</span>
            <span>{t('common.allServices')}</span>
          </Link>
        </header>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-16 md:pb-16">
          <article className="pt-4">
            <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
              <Image
                src={imageSrc}
                alt={serviceTitle}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                priority
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                  {serviceTitle}
                </h1>
              </div>
            </div>

            {serviceShortDesc && (
              <p className="mt-8 font-sans text-base text-black/90 leading-relaxed">{serviceShortDesc}</p>
            )}

            {service.long_desc && (
              <div className="mt-12">
                <ServiceContent content={service.long_desc} />
              </div>
            )}

            {service.documents && service.documents.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-xl font-medium text-black/90 mb-4">{t('servicesSection.documents')}</h2>
                <ul className="space-y-2">
                  {service.documents.map((doc, i) => (
                    <li key={i}>
                      <a
                        href={doc.url.startsWith('http') ? doc.url : toAbsoluteMediaUrl(doc.url)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-sans text-primary hover:underline"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(service.needs_questionnaire || (service.questions && service.questions.length > 0)) && (
              <ServiceQuestionnaireForm serviceSlug={slug} questions={service.questions ?? []} />
            )}

            <div className="mt-12">
              <h2 className="font-serif text-xl font-medium text-black/90 mb-6">{t('servicesSection.inSection')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {children.map((item) => (
                  <div key={item.slug} className="min-w-0">
                    <Link
                      href={`/services/${item.slug}`}
                      className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/20 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-secondary/40"
                    >
                      <Image
                        src={getServiceImageSrc(item)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                          {item.short_desc}
                        </p>
                        <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('servicesSection.more')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="pt-6 md:pt-8 pb-3 md:pb-4 max-w-6xl mx-auto px-3 sm:px-6">
        <Link
          href="/services"
          translate="no"
          className="notranslate inline-flex items-center gap-2 whitespace-nowrap font-sans text-sm text-black/80 hover:text-black transition-colors mb-4"
        >
          <span aria-hidden>←</span>
          <span>{t('common.allServices')}</span>
        </Link>
      </header>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-16 md:pb-16">
        <article className="pt-4">
          <div className="relative">
            <ServiceImageSlider images={images} title={serviceTitle} />
          </div>

          <p className="mt-8 font-sans text-sm text-black/90 leading-relaxed">
            {serviceShortDesc}
          </p>

          <ServicePurchasePanel
            slug={service.slug}
            title={serviceTitle}
            basePrice={price}
            variants={service.variants ?? []}
          />

          {service.documents && service.documents.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-xl font-medium text-black/90 mb-4">{t('servicesSection.documents')}</h2>
              <ul className="space-y-2">
                {service.documents.map((doc, i) => (
                  <li key={i}>
                    <a
                      href={doc.url.startsWith('http') ? doc.url : toAbsoluteMediaUrl(doc.url)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-primary hover:underline"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(service.needs_questionnaire || (service.questions && service.questions.length > 0)) && (
            <ServiceQuestionnaireForm serviceSlug={slug} questions={service.questions ?? []} />
          )}

          {service.long_desc && (
            <div className="mt-12">
              <ServiceContent content={service.long_desc} />
            </div>
          )}
        </article>

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherServices')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {servicesList.map((item) => {
              const isCurrent = item.slug === slug
              return (
                <div key={item.slug} className="min-w-0">
                  <Link
                    href={`/services/${item.slug}`}
                    className={`group relative block aspect-square w-full rounded-lg overflow-hidden border bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isCurrent ? 'border-primary ring-2 ring-primary/50' : 'border-secondary/20 hover:border-secondary/40'
                    }`}
                  >
                    <Image
                      src={getServiceImageSrc(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                        {item.short_desc}
                      </p>
                      {!isCurrent && (
                        <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('servicesSection.more')}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
