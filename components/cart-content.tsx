"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

export default function CartContent() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = localStorage.getItem("products")
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts))
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Verificar se o carrinho está vazio
  const isEmpty = cartItems.length === 0

  // Obter produtos do carrinho com detalhes
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { ...item, product } : null
    })
    .filter(Boolean)

  // Lidar com mudança de quantidade
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  // Lidar com remoção do carrinho
  const handleRemove = (productId: string) => {
    removeFromCart(productId)
  }

  // Lidar com checkout
  const handleCheckout = () => {
    if (user) {
      router.push("/checkout")
    } else {
      router.push("/login?redirect=/checkout")
    }
  }

  if (loading) {
    return <CartSkeleton />
  }

  return (
    <>
      {isEmpty ? (
        <div className="bg-card rounded-lg p-6 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-3">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">
            Parece que você ainda não adicionou nenhum produto ao seu carrinho.
          </p>
          <Button asChild>
            <Link href="/produtos">Ver Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-6 gap-4 p-4 border-b border-border font-semibold">
                <div className="col-span-3">Produto</div>
                <div className="text-center">Preço</div>
                <div className="text-center">Quantidade</div>
                <div className="text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-border">
                {cartProducts.map((item) => (
                  <div key={item.productId} className="p-4">
                    <div className="sm:grid sm:grid-cols-6 gap-4 flex flex-col">
                      {/* Product */}
                      <div className="col-span-3 flex items-center mb-4 sm:mb-0">
                        <div className="relative w-16 h-16 mr-4">
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-sm">Remover</span>
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:text-center flex justify-between items-center mb-3 sm:mb-0">
                        <span className="sm:hidden">Preço:</span>
                        {formatCurrency(item.product.price)}
                      </div>

                      {/* Quantity */}
                      <div className="sm:text-center flex justify-between items-center mb-3 sm:mb-0">
                        <span className="sm:hidden">Quantidade:</span>
                        <div className="flex items-center border border-border rounded-md overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-center w-8">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-primary font-bold sm:text-right flex justify-between items-center">
                        <span className="sm:hidden">Subtotal:</span>
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-border">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxa de processamento</span>
                  <span className="text-foreground">Grátis</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {user ? "Finalizar Compra" : "Entrar para Finalizar"}
              </Button>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Os dados de acesso serão enviados para seu email após a confirmação do pagamento.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-full" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-border">
              <div className="flex items-center">
                <Skeleton className="h-16 w-16 rounded-md mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-24 ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-4">
          <Skeleton className="h-7 w-40 mb-4" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-6" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}
