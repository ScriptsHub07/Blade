import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getOrderById } from "@/lib/orders"
import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pedido Confirmado - TheBuxx",
  description: "Seu pedido foi confirmado com sucesso",
}

export default async function SuccessPage({ params }: { params: { id: string } }) {
  let order

  try {
    order = await getOrderById(params.id)

    // Verificar se o pedido está pago
    if (order.paymentStatus !== "paid") {
      redirect("/checkout")
    }
  } catch (error) {
    redirect("/")
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Seu pedido foi processado com sucesso. Os dados de acesso foram enviados para o email cadastrado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Detalhes do Pedido</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-muted-foreground text-sm mb-1">Número do Pedido</h3>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm mb-1">Data</h3>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm mb-1">Status do Pagamento</h3>
                    <div className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      Pago
                    </div>
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm mb-1">Email de Entrega</h3>
                    <p className="font-medium">{order.email}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Itens do Pedido</h3>

                <div className="bg-secondary rounded-lg overflow-hidden mb-6">
                  <div className="divide-y divide-border">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-4 flex items-center">
                        <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center mr-4">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{item.productName}</h4>
                            <span className="text-primary font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                          <div className="flex justify-between text-muted-foreground text-sm">
                            <span>Quantidade: {item.quantity}</span>
                            <span>Preço unitário: {formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <h4 className="font-medium">Total</h4>
                  <div className="text-primary font-semibold">{formatCurrency(order.total)}</div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 mb-6 border border-green-500">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Entrega Realizada</h4>
                      <p className="text-muted-foreground text-sm">Os dados de acesso foram enviados para seu email.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/">
                      <Home className="h-5 w-5 mr-2" />
                      Voltar para Início
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/produtos">
                      <Package className="h-5 w-5 mr-2" />
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-border">Resumo do Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de processamento</span>
                    <span>Grátis</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 border border-primary">
                  <h3 className="font-semibold mb-2">Importante</h3>
                  <p className="text-sm">
                    Os dados de acesso foram enviados para o email {order.email}. Se não encontrar o email, verifique
                    sua pasta de spam ou lixo eletrônico.
                  </p>
                  <p className="text-sm mt-2">
                    Recomendamos alterar a senha da conta assim que recebê-la para garantir sua segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
