import type { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Adicionar Produto - TheBuxx",
  description: "Adicione um novo produto à loja",
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Adicionar Produto</h1>
      <ProductForm />
    </div>
  )
}
