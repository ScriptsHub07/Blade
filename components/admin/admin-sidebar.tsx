"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    {
      path: "/admin",
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/admin/produtos",
      name: "Produtos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/admin/pedidos",
      name: "Pedidos",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      path: "/admin/configuracoes",
      name: "Configurações",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="bg-card w-64 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center">
          <ShoppingCart className="h-8 w-8 text-primary mr-2" />
          <span className="font-bold text-xl">TheBuxx</span>
        </Link>
        <div className="mt-2 text-muted-foreground text-sm">Painel Administrativo</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span>Ver Loja</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-muted-foreground hover:text-destructive transition-colors"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  )
}
