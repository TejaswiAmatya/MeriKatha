import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthUser { userId: string; email: string }

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const API = import.meta.env.VITE_API_URL ?? ''

async function parseApiResponse(response: Response) {
  const raw = await response.text()
  if (!raw) {
    return { success: false, data: null, error: `Request failed (${response.status})` }
  }

  try {
    return JSON.parse(raw)
  } catch {
    return { success: false, data: null, error: `Unexpected response from server (${response.status})` }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(parseApiResponse)
      .then(res => { if (res.success) setUser(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function signup(email: string, password: string) {
    const response = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const res = await parseApiResponse(response)
    if (!res.success) throw new Error(res.error)
    setUser(res.data)
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const res = await parseApiResponse(response)
    if (!res.success) throw new Error(res.error)
    setUser(res.data)
  }

  async function logout() {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch {
      // ignore network errors — clear local state regardless
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
