"use client"

import { useState } from "react"
import { ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product.stock))
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      setIsAdding(true)
      addToCart(product.id, quantity)
      setTimeout(() => setIsAdding(false), 1500)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {product.stock > 0 && (
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="h-10 rounded-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 text-center w-12">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="h-10 rounded-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={product.stock <= 0 || isAdding}
        variant={isAdding ? "secondary" : "default"}
        className="flex-1"
      >
        {isAdding ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            Adicionado
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
          </>
        )}
      </Button>
    </div>
  )
}
