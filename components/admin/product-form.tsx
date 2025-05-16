"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X, Save, ArrowLeft } from "lucide-react"
import { addProduct, updateProduct } from "@/lib/products"
import type { Product } from "@/types"
import Link from "next/link"

interface ProductFormProps {
  product?: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price.toString() || "")
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "")
  const [stock, setStock] = useState(product?.stock.toString() || "")
  const [features, setFeatures] = useState<string[]>(product?.features || [""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const isEditing = !!product

  // Adicionar nova característica
  const handleAddFeature = () => {
    setFeatures([...features, ""])
  }

  // Atualizar característica
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features]
    updatedFeatures[index] = value
    setFeatures(updatedFeatures)
  }

  // Remover característica
  const handleRemoveFeature = (index: number) => {
    if (features.length === 1) return
    const updatedFeatures = features.filter((_, i) => i !== index)
    setFeatures(updatedFeatures)
  }

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos
    if (!name || !description || !price || !imageUrl || !stock) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Validar preço
    const priceValue = Number.parseFloat(price)
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser um número positivo.",
        variant: "destructive",
      })
      return
    }

    // Validar estoque
    const stockValue = Number.parseInt(stock)
    if (isNaN(stockValue) || stockValue < 0) {
      toast({
        title: "Erro",
        description: "O estoque deve ser um número não negativo.",
        variant: "destructive",
      })
      return
    }

    // Filtrar características vazias
    const filteredFeatures = features.filter((f) => f.trim() !== "")
    if (filteredFeatures.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma característica.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing) {
        // Atualizar produto existente
        await updateProduct(product.id, {
          name,
          description,
          price: priceValue,
          imageUrl,
          stock: stockValue,
          features: filteredFeatures,
        })

        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        })
      } else {
        // Adicionar novo produto
        await addProduct({
          name,
          description,
          price: priceValue,
          imageUrl,
          stock: stockValue,
          features: filteredFeatures,
        })

        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso.",
        })
      }

      // Redirecionar para a lista de produtos
      router.push("/admin/produtos")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível ${isEditing ? "atualizar" : "adicionar"} o produto. Tente novamente.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/produtos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Produtos
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome do Produto*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Conta Roblox Premium"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o produto com detalhes relevantes..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="price">Preço (R$)*</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 99.90"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="stock">Estoque*</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Ex: 5"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="imageUrl">URL da Imagem*</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
                <p className="text-sm text-muted-foreground">Insira a URL de uma imagem para representar o produto.</p>
              </div>

              <div className="grid gap-3">
                <Label>Características*</Label>
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Ex: 1000 Robux"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={features.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Característica
                </Button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/admin/produtos">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Atualizar Produto" : "Salvar Produto"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
