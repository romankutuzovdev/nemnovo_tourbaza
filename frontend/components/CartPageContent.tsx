'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { createServiceOrder } from '@/lib/api'

type Props = {
  servicesHref: string
}

export function CartPageContent({ servicesHref }: Props) {
  const router = useRouter()
  const { items, total, updateQuantity, removeItem, clear } = useCart()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')

  const canCheckout = isAuthenticated && items.length > 0
  const itemsPayload = useMemo(
    () => items.map((it) => ({ service_slug: it.slug, variant_name: it.variantName, quantity: it.quantity })),
    [items]
  )

  async function submitOrder() {
    setMessage('')
    if (!isAuthenticated) {
      setMessage('Для оформления заказа войдите или зарегистрируйтесь.')
      return
    }
    if (!canCheckout) return
    const res = await createServiceOrder({ name, email, phone, comment, items: itemsPayload })
    if ('error' in res) {
      if (res.unauthorized) {
        router.push('/login')
        return
      }
      setMessage(res.error)
      return
    }
    clear()
    router.push('/cabinet')
  }

  return (
    <div className="min-h-screen bg-white pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl text-primary">Корзина</h1>
        {items.length === 0 ? (
          <div className="mt-8">
            <p className="font-sans text-black/80">Корзина пуста.</p>
            <Link href={servicesHref} className="inline-block mt-4 font-sans text-primary hover:underline">Перейти к услугам</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((it) => (
              <div key={it.slug} className="border border-secondary/20 rounded-lg p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{it.title}{it.variantName ? ` (${it.variantName})` : ''}</p>
                  <p className="text-sm text-black/70">{it.price.toFixed(2)} BYN</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(it.slug, Number(e.target.value) || 1, it.variantName)} className="w-16 border border-secondary/20 px-2 py-1" />
                  <button type="button" onClick={() => removeItem(it.slug, it.variantName)} className="text-sm text-red-600">Удалить</button>
                </div>
              </div>
            ))}
            <p className="font-serif text-2xl">Итого: {total.toFixed(2)} BYN</p>
          </div>
        )}

        <section className="mt-10 border-t border-secondary/20 pt-8">
          <h2 className="font-serif text-2xl">
            {isLoading ? 'Оформление заказа' : isAuthenticated ? 'Оформление заказа' : 'Для оформления заказа нужно войти'}
          </h2>
          {isLoading ? (
            <p className="mt-4 font-sans text-sm text-black/60">Проверяем авторизацию...</p>
          ) : !isAuthenticated ? (
            <p className="mt-4 font-sans text-sm text-black/70">
              Для оформления заказа нужно <Link href="/login" className="text-primary hover:underline">войти</Link> или <Link href="/register" className="text-primary hover:underline">зарегистрироваться</Link>.
            </p>
          ) : (
            <>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.first_name ? user.first_name : 'Имя'} className="border border-secondary/20 px-3 py-2" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="border border-secondary/20 px-3 py-2" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={user?.email || 'Email'} className="border border-secondary/20 px-3 py-2 sm:col-span-2" />
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий" className="border border-secondary/20 px-3 py-2 sm:col-span-2 min-h-24" />
              </div>
              <button type="button" disabled={!canCheckout} onClick={submitOrder} className="mt-4 px-6 py-3 bg-primary text-white disabled:opacity-50">Оформить заказ</button>
            </>
          )}
          {message && <p className="mt-3 text-sm">{message}</p>}
        </section>
      </div>
    </div>
  )
}
