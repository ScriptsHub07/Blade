import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"
import { Plus } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"
import Link from "next/link"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
