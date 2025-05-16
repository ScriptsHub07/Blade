import { Button } from "@/components/ui/button"
import { ShoppingCart, Shield, CreditCard, Package } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/products"

export default async function Home() {
  const products = await getProducts({ featured: true, limit: 4 })

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-b from-black to-transparent">
          <div className="absolute inset-0 bg-[url('/images/roblox-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        <div className="container-custom relative z-10 text-center py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contas <span className="text-primary">Roblox</span> Premium
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Adquira contas Roblox verificadas com Robux, itens raros e muito mais. Entrega automática após o pagamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/cadastro">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a TheBuxx?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos as melhores contas Roblox com segurança, rapidez e garantia para sua diversão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Contas Premium</h3>
              <p className="text-muted-foreground">Contas Roblox com Robux, itens raros e perfis de alto nível.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Pagamento Seguro</h3>
              <p className="text-muted-foreground">Transações protegidas com PIX via EFI Bank para sua segurança.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <ShoppingCart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Entrega Imediata</h3>
              <p className="text-muted-foreground">Receba os dados da sua conta instantaneamente após o pagamento.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Garantia Total</h3>
              <p className="text-muted-foreground">
                Garantimos a entrega e funcionamento de todos os produtos vendidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Contas em Destaque</h2>
              <p className="text-muted-foreground max-w-2xl">
                Confira nossas contas mais populares com os melhores itens e preços.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0">
              <Link href="/produtos">Ver Todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para começar a jogar?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Adquira agora mesmo uma conta Roblox premium e desfrute de todos os recursos exclusivos que oferecemos.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/produtos">Comprar Agora</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
