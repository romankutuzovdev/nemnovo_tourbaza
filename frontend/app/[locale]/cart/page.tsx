import { CartPageContent } from '@/components/CartPageContent'

type Props = { params: Promise<{ locale: string }> }

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  return <CartPageContent servicesHref={`/${locale}/services`} />
}
