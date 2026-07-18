import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const ADMIN_EMAIL = 'admin@mail.com'
const ADMIN_PASSWORD = 'Pa55word'
const STORAGE_KEY = 'stayfinder_admin_auth'

interface AuthContextValue {
  isAdminAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  )

  useEffect(() => {
    if (isAdminAuthenticated) {
      localStorage.setItem(STORAGE_KEY, 'true')
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isAdminAuthenticated])

  function login(email: string, password: string) {
    const success = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
    if (success) {
      setIsAdminAuthenticated(true)
    }
    return success
  }

  function logout() {
    setIsAdminAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
