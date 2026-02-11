'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthTokens } from '@/lib/auth'
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  refreshTokens,
  fetchMe,
} from '@/lib/auth'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (u: User | null) => void
  loginSuccess: (data: AuthTokens) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setUser = (u: User | null) => {
    setUserState(u)
  }

  const loginSuccess = (data: AuthTokens) => {
    setStoredAuth(data)
    setUserState(data.user)
  }

  const logout = () => {
    clearStoredAuth()
    setUserState(null)
  }

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const stored = getStoredAuth()
      if (!stored) {
        setIsLoading(false)
        return
      }
      setUserState(stored.user)
      const refreshed = await refreshTokens()
      if (!mounted) return
      if (refreshed) {
        setStoredAuth(refreshed)
        setUserState(refreshed.user)
      } else {
        const me = await fetchMe()
        if (!mounted) return
        if (me) setUserState(me)
        else logout()
      }
      setIsLoading(false)
    }
    init()
    return () => { mounted = false }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
