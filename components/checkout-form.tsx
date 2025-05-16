"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { formatCurrency } from "@/lib/utils"
import { createPixPayment, checkPaymentStatus } from "@/lib/efi-bank"
import { createOrder, updateOrderStatus } from "@/lib/orders"
import type { Product } from "@/types"

export default function CheckoutForm() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pixData, setPixData] = useState<any>(null)
  const [status, setStatus] = useState<"aguardando" | "pago" | "erro" | null>(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [checkingInterval, setCheckingInterval] = useState<NodeJS.Timeout | null>(null)
  const [copied, setCopied] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = localStorage.getItem("products")
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts))
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Preencher email com o email do usuário
    if (user) {
      setEmail(user.email)
    }
  }, [user])

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (checkingInterval) {
        clearInterval(checkingInterval)
      }
    }
  }, [checkingInterval])

  const validateEmail = () => {
    if (!email) {
      setEmailError("O email é obrigatório")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido")
      return false
    }
    setEmailError("")
    return true
  }

  const handlePayment = async () => {
    if (!validateEmail()) return
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para finalizar a compra",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setStatus(null)
    setStatusMessage("")

    // Limpar qualquer intervalo existente
    if (checkingInterval) {
      clearInterval(checkingInterval)
      setCheckingInterval(null)
    }

    try {
      // Criar itens do pedido
      const orderItems = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) {
          throw new Error(`Produto não encontrado: ${item.productId}`)
        }

        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        }
      })

      // Criar pedido
      const order = await createOrder(user.id, orderItems, getCartTotal(), email)

      // Criar itens para o pagamento
      const paymentItems = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          id: item.productId,
          name: product?.name || "Produto",
          price: product?.price || 0,
          quantity: item.quantity,
        }
      })

      // Criar pagamento PIX
      const pixPayment = await createPixPayment(email, paymentItems, order.id)
      setPixData(pixPayment)
      setStatus("aguardando")
      setStatusMessage("Aguardando confirmação do pagamento...")

      // Iniciar verificação periódica do status do pagamento
      const interval = setInterval(async () => {
        try {
          const paymentStatus = await checkPaymentStatus(order.id)

          if (paymentStatus.isPaid) {
            clearInterval(interval)
            setStatus("pago")
            setStatusMessage("Pagamento confirmado! Sua conta será entregue em instantes...")

            // Atualizar status do pedido
            await updateOrderStatus(order.id, "paid", "delivered")

            // Simular entrega da conta
            setTimeout(() => {
              // Limpar o carrinho
              clearCart()

              // Redirecionar para a página de sucesso
              router.push(`/sucesso/${order.id}`)
            }, 2000)
          }
        } catch (err) {
          console.error("Erro ao verificar status do pagamento:", err)
        }
      }, 5000) // Verificar a cada 5 segundos

      setCheckingInterval(interval)
    } catch (err) {
      console.error("Erro ao processar pagamento:", err)
      setStatus("erro")
      setStatusMessage("Erro ao processar pagamento. Tente novamente.")

      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    }

    setIsProcessing(false)
  }

  const copyPixCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code)
      setCopied(true)
      toast({
        title: "Código copiado",
        description: "O código PIX foi copiado para a área de transferência",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Obter produtos do carrinho com detalhes
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { ...item, product } : null
    })
    .filter(Boolean)

  if (loading) {
    return <CheckoutSkeleton />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg p-6">
          {!pixData ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>

              <div className="mb-4">
                <Label htmlFor="email">Email para receber a conta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="seu@email.com"
                />
                {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
                <p className="text-muted-foreground text-sm mt-1">
                  Você receberá os dados da conta neste email após a confirmação do pagamento.
                </p>
              </div>

              <Button onClick={handlePayment} disabled={isProcessing || cartItems.length === 0} className="w-full">
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Gerar QR Code PIX"
                )}
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Pagamento PIX</h2>

              <div className="bg-secondary p-6 rounded-lg mb-6 text-center">
                <div className="mb-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src={pixData.qr_image || "/placeholder.svg"}
                      alt="QR Code PIX"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-muted-foreground mb-2">Valor a pagar:</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(Number(pixData.valor))}</p>
                </div>

                <div className="mb-4">
                  <p className="text-muted-foreground mb-2">Ou copie o código PIX:</p>
                  <div className="relative">
                    <div className="bg-background p-3 rounded-lg text-sm break-all mb-2 max-h-24 overflow-y-auto">
                      {pixData.qr_code}
                    </div>
                    <Button size="icon" variant="outline" onClick={copyPixCode} className="absolute top-2 right-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && <p className="text-green-500 text-sm">Código copiado!</p>}
                </div>

                <div className="mt-6">
                  {status === "aguardando" && (
                    <div className="flex items-center justify-center text-yellow-500">
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      <span>{statusMessage || "Aguardando confirmação do pagamento..."}</span>
                    </div>
                  )}

                  {status === "pago" && (
                    <div className="flex items-center justify-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>{statusMessage || "Pagamento confirmado!"}</span>
                    </div>
                  )}

                  {status === "erro" && (
                    <div className="flex items-center justify-center text-destructive">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span>{statusMessage || "Erro ao processar pagamento."}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Instruções:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Escolha a opção de pagamento via PIX</li>
                  <li>Escaneie o QR code ou copie e cole o código PIX</li>
                  <li>Confirme as informações e finalize o pagamento</li>
                  <li>Aguarde a confirmação (pode levar alguns segundos)</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resumo do pedido */}
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Resumo do Pedido</h2>

          <div className="space-y-4 mb-6">
            {cartProducts.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <div>
                  <span>{item.product.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">x{item.quantity}</span>
                </div>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-muted-foreground mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </div>
            <div className="flex justify-between text-muted-foreground mb-4">
              <span>Taxa de processamento</span>
              <span>Grátis</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(getCartTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg p-6">
          <Skeleton className="h-7 w-60 mb-4" />
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6">
          <Skeleton className="h-7 w-40 mb-4" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full mb-6" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
}
