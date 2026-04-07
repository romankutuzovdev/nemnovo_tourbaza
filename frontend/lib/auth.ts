/**
 * API авторизации: регистрация, логин, сброс пароля, кабинет.
 */

import { getApiUrl } from './api'

const AUTH_STORAGE_KEY = 'nemnovo_auth'

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

export type AuthTokens = {
  access: string
  refresh: string
  user: User
}

export function getStoredAuth(): AuthTokens | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function setStoredAuth(data: AuthTokens): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAccessToken(): string | null {
  return getStoredAuth()?.access ?? null
}

export async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = getAccessToken()
  const headers = new Headers(init?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}

// ——— Регистрация ———
export type RegisterPayload = {
  email: string
  password: string
  password_confirm: string
}

export async function register(payload: RegisterPayload): Promise<{ ok: true; data: AuthTokens } | { error: string; errors?: Record<string, string[]> }> {
  const res = await fetch(`${getApiUrl()}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const errs = data as Record<string, unknown>
    const first = typeof errs.detail === 'string' ? errs.detail : null
    const fieldErrors = errs as Record<string, string[]>
    return { error: first || Object.values(fieldErrors).flat()[0] || `Ошибка ${res.status}`, errors: fieldErrors }
  }
  return { ok: true, data: data as AuthTokens }
}

// ——— Логин ———
export type LoginPayload = { username: string; password: string }

export async function login(payload: LoginPayload): Promise<{ ok: true; data: AuthTokens } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as { detail?: string }).detail
    return { error: typeof msg === 'string' ? msg : 'Неверный логин или пароль' }
  }
  return { ok: true, data: data as AuthTokens }
}

// ——— Обновление access по refresh ———
export async function refreshTokens(): Promise<AuthTokens | null> {
  const stored = getStoredAuth()
  if (!stored?.refresh) return null
  const res = await fetch(`${getApiUrl()}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: stored.refresh }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return null
  const { access } = data as { access: string }
  const next: AuthTokens = { ...stored, access }
  setStoredAuth(next)
  return next
}

// ——— Профиль ———
export async function fetchMe(): Promise<User | null> {
  const res = await authFetch(`${getApiUrl()}/api/auth/me/`)
  if (!res.ok) return null
  const data = await res.json()
  return data as User
}

export type UpdateProfilePayload = Partial<Pick<User, 'first_name' | 'last_name' | 'email'>>

export async function updateProfile(payload: UpdateProfilePayload): Promise<{ ok: true; user: User } | { error: string }> {
  const res = await authFetch(`${getApiUrl()}/api/auth/me/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { detail?: string }).detail || 'Ошибка сохранения' }
  return { ok: true, user: data as User }
}

// ——— Смена пароля ———
export type PasswordChangePayload = {
  old_password: string
  new_password: string
  new_password_confirm: string
}

export async function changePassword(payload: PasswordChangePayload): Promise<{ ok: true } | { error: string }> {
  const res = await authFetch(`${getApiUrl()}/api/auth/password/change/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = data as Record<string, string[]>
    const msg = err.old_password?.[0] || err.new_password?.[0] || err.new_password_confirm?.[0]
    return { error: msg || 'Ошибка' }
  }
  return { ok: true }
}

// ——— Сброс пароля (запрос) ———
export async function requestPasswordReset(email: string): Promise<{ ok: true } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/auth/password/reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { detail?: string }).detail || 'Ошибка' }
  return { ok: true }
}

// ——— Сброс пароля (подтверждение) ———
export type PasswordResetConfirmPayload = {
  uid: string
  token: string
  new_password: string
  new_password_confirm: string
}

export async function confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<{ ok: true } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/auth/password/reset/confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { detail?: string }).detail || 'Ошибка' }
  return { ok: true }
}
