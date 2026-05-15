import { createContext, useContext, useState, type ReactNode } from 'react'
import { getToken, getRole, getUserId } from '../utils/token'

interface AuthContextValue {
  isAuthenticated: boolean
  userRole: string | null
  userId: number | null
  signIn: (token: string, role?: string, userId?: number) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken())
  const [userRole, setUserRole] = useState<string | null>(() => getRole())
  const [userId, setUserId] = useState<number | null>(() => getUserId())

  function signIn(token: string, role?: string, id?: number) {
    setIsAuthenticated(!!token)
    setUserRole(role ?? getRole())
    setUserId(id ?? getUserId())
  }

  function signOut() {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
