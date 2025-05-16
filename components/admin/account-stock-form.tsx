"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { updateProductStock } from "@/lib/products"
import { Package, Save } from "lucide-react"

export default function AccountStockForm() {
  const [productId, setProductId] = useState("")
  const [quantityChange, setQuantityChange] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId || !quantityChange) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    const quantityChangeValue = Number.parseInt(quantityChange)
    if (isNaN(quantityChangeValue)) {
      toast({
        title: "Erro",
        description: "A alteração de estoque deve ser um número.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateProductStock(productId, quantityChangeValue)

      toast({
        title: "Estoque atualizado",
        description: "O estoque do produto foi atualizado com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o estoque. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle>Ajustar Estoque de Contas</CardTitle>
        </div>
        <CardDescription>Adicione ou remova contas do estoque de um produto existente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="productId">ID do Produto</Label>
              <Input
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Ex: product-123"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="quantityChange">Alteração de Estoque</Label>
              <Input
                id="quantityChange"
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(e.target.value)}
                placeholder="Ex: 1 ou -1"
              />
            </div>
          </div>
          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
