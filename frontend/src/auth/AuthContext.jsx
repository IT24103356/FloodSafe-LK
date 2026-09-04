import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'floodsafe-admin-session'
const AuthContext = createContext(null)

function readSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    if (!value?.token || new Date(value.expiresAt) <= new Date()) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return value
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  useEffect(() => {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(STORAGE_KEY)
  }, [session])

  useEffect(() => {
    const clear = () => setSession(null)
    window.addEventListener('floodsafe-session-expired', clear)
    return () => window.removeEventListener('floodsafe-session-expired', clear)
  }, [])

  const value = useMemo(() => ({
    token: session?.token ?? null,
    email: session?.email ?? null,
    isAdmin: Boolean(session?.token),
    login: setSession,
    logout: () => setSession(null),
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

export function getStoredToken() {
  return readSession()?.token ?? null
}

export function clearStoredSession() {
  sessionStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('floodsafe-session-expired'))
}
