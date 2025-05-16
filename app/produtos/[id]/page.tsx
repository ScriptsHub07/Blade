import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronLeft, Check, AlertTriangle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductById } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"
import AddToCartButton from "@/components/add-to-cart-button"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await getProductById(params.id)

    return {
      title: `${product.name} - TheBuxx`,
      description: product.description,
    }
  } catch (error) {
    return {
      title: "Produto não encontrado - TheBuxx",
      description: "O produto que você está procurando não foi encontrado.",
    }
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product

  try {
    product = await getProductById(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          {/* Back Button */}
          <Link
            href="/produtos"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Voltar para Produtos
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
              <div className="bg-card rounded-lg overflow-hidden">
                <div className="relative h-[400px]">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </Suspense>

            {/* Product Details */}
            <div className="bg-card rounded-lg p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-500">
                    <Check className="h-5 w-5 mr-2" />
                    <span>
                      Em estoque - {product.stock} {product.stock === 1 ? "disponível" : "disponíveis"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-destructive">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>Esgotado</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart */}
              <AddToCartButton product={product} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Informações Importantes</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Todas as nossas contas são verificadas e garantidas. Após a compra, você receberá os dados de acesso por
                email.
              </p>
              <p>
                <strong className="text-foreground">Importante:</strong> Recomendamos que você altere a senha da conta
                após recebê-la para garantir segurança.
              </p>
              <p>
                Em caso de problemas ou dúvidas, entre em contato com nosso suporte através do email
                contato@thebuxx.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
