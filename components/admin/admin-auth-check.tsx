"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader } from "lucide-react"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (initialized && (!user || !user.isAdmin)) {
      router.push("/login")
    }
  }, [user, initialized, router])

  if (!initialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null
  }

  return <>{children}</>
}
