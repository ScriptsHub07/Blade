"use client"

import { useAuth } from "@/hooks/use-auth"

export default function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-card py-4 px-6 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Painel Administrativo</h1>

        <div className="flex items-center">
          <div>
            <span className="text-muted-foreground mr-2">Olá,</span>
            <span className="font-medium">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
