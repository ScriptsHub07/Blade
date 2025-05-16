"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addToCart(product.id)
    setTimeout(() => setIsAdding(false), 1500)
  }

  return (
    <Link href={`/produtos/${product.id}`} className="block group">
      <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group-hover:scale-[1.02]">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-medium">
                Esgotado
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex-1">
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>

            {/* Features Preview */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {product.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{product.features.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price and Cart */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl">{formatCurrency(product.price)}</span>

              <Button
                size="icon"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                variant={isAdding ? "secondary" : "default"}
                className="rounded-full"
              >
                {isAdding ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              </Button>
            </div>

            {/* Stock Indicator */}
            <div className="mt-2 text-xs text-muted-foreground">
              {product.stock > 0 ? (
                <span>
                  Estoque: {product.stock} {product.stock === 1 ? "conta" : "contas"}
                </span>
              ) : (
                <span className="text-destructive">Sem estoque</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
