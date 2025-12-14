import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { DEMO_MODE, DEMO_USER } from '../config'

interface User {
  id: number
  username: string
  email: string
  monthly_income: string
  currency: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
    } else {
      const token = localStorage.getItem('access_token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        fetchProfile()
      } else {
        setLoading(false)
      }
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile/')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('access_token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    if (DEMO_MODE) {
      const demoUser = { ...DEMO_USER, username }
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return
    }

    const response = await axios.post('/api/auth/login/', { username, password })
    const { access, user: userData } = response.data
    localStorage.setItem('access_token', access)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`
    setUser(userData)
  }

  const register = async (username: string, email: string, password: string) => {
    if (DEMO_MODE) {
      const demoUser = { ...DEMO_USER, username, email }
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return
    }

    const response = await axios.post('/api/auth/register/', {
      username,
      email,
      password,
      password2: password,
      monthly_income: 0,
      currency: 'USD'
    })
    const { access, user: userData } = response.data
    localStorage.setItem('access_token', access)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`
    setUser(userData)
  }

  const logout = () => {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_transactions')
      localStorage.removeItem('demo_budgets')
      localStorage.removeItem('demo_goals')
    } else {
      localStorage.removeItem('access_token')
      delete axios.defaults.headers.common['Authorization']
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
