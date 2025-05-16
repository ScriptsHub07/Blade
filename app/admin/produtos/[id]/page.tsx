import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { getProductById } from "@/lib/products"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await getProductById(params.id)

    return {
      title: `Editar ${product.name} - TheBuxx`,
      description: `Editar produto ${product.name}`,
    }
  } catch (error) {
    return {
      title: "Produto não encontrado - TheBuxx",
      description: "O produto que você está procurando não foi encontrado.",
    }
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product

  try {
    product = await getProductById(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm product={product} />
    </div>
  )
}
