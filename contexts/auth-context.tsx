"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { User, AuthUser } from "@/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  initialized: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Initialize default admin user if no users exist in localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        if (users.length === 0) {
          const adminUser: User = {
            id: "admin-1",
            name: "Admin",
            email: "admin@thebuxx.com",
            password: "admin123",
            isAdmin: true,
          }
          localStorage.setItem("users", JSON.stringify([adminUser]))
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
      } finally {
        setInitialized(true)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        setError("Email ou senha incorretos")
        return false
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      }

      localStorage.setItem("user", JSON.stringify(authUser))
      setUser(authUser)

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${authUser.name}!`,
      })

      return true
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u) => u.email === email)

      if (existingUser) {
        setError("Email já está em uso")
        return false
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        isAdmin: false,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      }

      localStorage.setItem("user", JSON.stringify(authUser))
      setUser(authUser)

      toast({
        title: "Conta criada com sucesso",
        description: `Bem-vindo(a), ${authUser.name}!`,
      })

      return true
    } catch (error) {
      setError("Erro ao registrar. Tente novamente.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")

    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
