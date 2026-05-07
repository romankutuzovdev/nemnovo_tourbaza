'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile, changePassword } from '@/lib/auth'
import { fetchServiceOrders, type ServiceOrder } from '@/lib/api'

export default function CabinetPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')
  const { user, isLoading, logout } = useAuth()
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' })
  useEffect(() => {
    if (user) setProfile({ first_name: user.first_name ?? '', last_name: user.last_name ?? '', email: user.email ?? '' })
  }, [user])
  const [pwd, setPwd] = useState({ old_password: '', new_password: '', new_password_confirm: '' })
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [orders, setOrders] = useState<ServiceOrder[]>([])

  useEffect(() => {
    let mounted = true
    const loadOrders = async () => {
      try {
        const list = await fetchServiceOrders()
        if (mounted) setOrders(list)
      } catch (e) {
        if (e instanceof Error && e.message === 'UNAUTHORIZED') {
          router.replace('/login')
        }
      }
    }
    if (user) loadOrders()
    return () => {
      mounted = false
    }
  }, [user])

  if (isLoading) return <div className="pt-6 md:pt-8 pb-24 min-h-screen bg-white flex items-center justify-center">Загрузка…</div>
  if (!user) {
    router.replace('/login')
    return null
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)
    setProfileLoading(true)
    const result = await updateProfile(profile)
    setProfileLoading(false)
    if ('ok' in result && result.ok) {
      setProfileMsg(t('successProfile'))
    } else setProfileMsg(('error' in result ? result.error : null) ?? 'Ошибка')
  }

  async function handlePwdSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg(null)
    setPwdLoading(true)
    const result = await changePassword(pwd)
    setPwdLoading(false)
    if ('ok' in result && result.ok) {
      setPwdMsg(t('successChange'))
      setPwd({ old_password: '', new_password: '', new_password_confirm: '' })
    } else setPwdMsg(('error' in result ? result.error : null) ?? 'Ошибка')
  }

  return (
    <div className="pt-6 md:pt-8 pb-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="font-sans text-sm text-black/80 hover:text-black">← {tNav('home')}</Link>
          <button type="button" onClick={logout} className="font-sans text-sm text-black/80 hover:text-black">
            {tNav('logout')}
          </button>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black tracking-tight">{t('cabinetTitle')}</h1>

        <section className="mt-12">
          <h2 className="font-serif text-xl font-medium text-black">{t('profile')}</h2>
          <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block font-sans text-sm text-black/80 mb-1">{t('username')}</label>
              <p className="font-sans text-black">{user.username}</p>
            </div>
            <div>
              <label htmlFor="email" className="block font-sans text-sm text-black/80 mb-1">{t('email')}</label>
              <input id="email" type="email" required value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block font-sans text-sm text-black/80 mb-1">{t('firstName')}</label>
                <input id="first_name" type="text" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
              </div>
              <div>
                <label htmlFor="last_name" className="block font-sans text-sm text-black/80 mb-1">{t('lastName')}</label>
                <input id="last_name" type="text" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
              </div>
            </div>
            {profileMsg && <p className="font-sans text-sm text-green-600">{profileMsg}</p>}
            <button type="submit" disabled={profileLoading} className="px-6 py-3 bg-primary text-white font-sans text-sm tracking-wide hover:bg-primary/90 disabled:opacity-60">{t('submitChange')}</button>
          </form>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-xl font-medium text-black">{t('changePassword')}</h2>
          <form onSubmit={handlePwdSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="old_password" className="block font-sans text-sm text-black/80 mb-1">{t('oldPassword')}</label>
              <input id="old_password" type="password" required value={pwd.old_password} onChange={(e) => setPwd({ ...pwd, old_password: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
            </div>
            <div>
              <label htmlFor="new_password" className="block font-sans text-sm text-black/80 mb-1">{t('newPassword')}</label>
              <input id="new_password" type="password" required minLength={8} value={pwd.new_password} onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
            </div>
            <div>
              <label htmlFor="new_password_confirm" className="block font-sans text-sm text-black/80 mb-1">{t('passwordConfirm')}</label>
              <input id="new_password_confirm" type="password" required value={pwd.new_password_confirm} onChange={(e) => setPwd({ ...pwd, new_password_confirm: e.target.value })} className="w-full px-4 py-3 bg-transparent border border-secondary/30 font-sans text-black focus:outline-none focus:border-secondary/50" />
            </div>
            {pwdMsg && <p className="font-sans text-sm text-green-600">{pwdMsg}</p>}
            <button type="submit" disabled={pwdLoading} className="px-6 py-3 border border-secondary/30 text-black font-sans text-sm tracking-wide hover:border-secondary/50 disabled:opacity-60">{t('submitChange')}</button>
          </form>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-xl font-medium text-black">Мои заказы</h2>
          <div className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <p className="font-sans text-sm text-black/60">Заказов пока нет.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-secondary/20 rounded-lg p-4">
                  <p className="font-medium">Заказ #{order.id}</p>
                  <p className="font-sans text-sm text-black/80">Статус: {order.status}</p>
                  <p className="font-sans text-sm text-black/80">
                    Дата: {new Date(order.created_at).toLocaleString('ru-RU')}
                  </p>
                  <p className="font-sans text-sm text-black/80">Сумма: {order.total_amount} BYN</p>
                  <div className="mt-3 text-sm text-black/80">
                    <p>Имя: {order.customer_name || '-'}</p>
                    <p>Email: {order.customer_email || '-'}</p>
                    <p>Телефон: {order.customer_phone || '-'}</p>
                    <p>Комментарий: {order.comment || '-'}</p>
                  </div>
                  <div className="mt-3">
                    <p className="font-sans text-xs text-black/60 mb-1">Состав заказа:</p>
                    <p className="font-sans text-xs text-black/60">
                      {order.items.map((x) => `${x.service_title}${x.variant_name ? ` (${x.variant_name})` : ''} x${x.quantity}`).join(', ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
