import type React from "react"
import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AdminAuthCheck from "@/components/admin/admin-auth-check"

export const metadata: Metadata = {
  title: "Painel Administrativo - TheBuxx",
  description: "Gerencie sua loja de contas Roblox",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminAuthCheck>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4">
            <div className="container-custom py-4">{children}</div>
          </main>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
