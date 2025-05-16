"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { CartItem, Product } from "@/types"
import { getProductById } from "@/lib/products"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartItemsCount: () => 0,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Load products for price calculation
    const loadProducts = async () => {
      try {
        const allProducts = await getProductById()
        setProducts(allProducts)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      }
    }

    loadProducts()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Add product to cart
  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId)

    if (!product) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      })
      return
    }

    if (product.stock < quantity) {
      toast({
        title: "Erro",
        description: "Quantidade indisponível em estoque",
        variant: "destructive",
      })
      return
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId)

      if (existingItem) {
        // If total quantity would exceed stock, limit it
        const newQuantity = existingItem.quantity + quantity
        const finalQuantity = newQuantity <= product.stock ? newQuantity : product.stock

        if (finalQuantity === product.stock) {
          toast({
            title: "Aviso",
            description: "Quantidade máxima em estoque atingida",
          })
        }

        return prevItems.map((item) => (item.productId === productId ? { ...item, quantity: finalQuantity } : item))
      } else {
        toast({
          title: "Sucesso",
          description: "Produto adicionado ao carrinho",
        })
        return [...prevItems, { productId, quantity }]
      }
    })
  }

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho",
    })
  }

  // Update quantity for a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && quantity > product.stock) {
      toast({
        title: "Erro",
        description: "Quantidade indisponível em estoque",
        variant: "destructive",
      })
      quantity = product.stock
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  // Get total number of items in cart
  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
