"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const pathname = usePathname()

  // Detect scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when changing route
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled || isOpen || pathname !== "/" ? "bg-background/95 backdrop-blur-sm shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-xl">TheBuxx</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={cn("transition-colors", pathname === "/" ? "text-primary" : "hover:text-primary")}
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className={cn("transition-colors", pathname === "/produtos" ? "text-primary" : "hover:text-primary")}
            >
              Produtos
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "transition-colors",
                  pathname.startsWith("/admin") ? "text-primary" : "hover:text-primary",
                )}
              >
                Painel Admin
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/carrinho" className="relative">
              <ShoppingCart className="h-6 w-6 hover:text-primary transition-colors" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="font-medium">{user.name}</span>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Painel Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link href="/carrinho" className="relative mr-4">
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full left-0 transition-all duration-300 overflow-hidden bg-background/95 backdrop-blur-sm",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-custom py-4">
          <div className="flex flex-col space-y-3 pb-4">
            <Link href="/" className={cn("py-2", pathname === "/" ? "text-primary" : "")}>
              Início
            </Link>
            <Link href="/produtos" className={cn("py-2", pathname === "/produtos" ? "text-primary" : "")}>
              Produtos
            </Link>
            {user?.isAdmin && (
              <Link href="/admin" className={cn("py-2", pathname.startsWith("/admin") ? "text-primary" : "")}>
                Painel Admin
              </Link>
            )}
            <div className="border-t border-border my-2"></div>
            {user ? (
              <>
                <div className="flex items-center py-2">
                  <User className="h-5 w-5 mr-2" />
                  <span>{user.name}</span>
                </div>
                <Button variant="ghost" className="justify-start px-0" onClick={() => logout()}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
