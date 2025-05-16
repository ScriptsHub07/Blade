"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { updateOrderStatus } from "@/lib/orders"
import type { Order } from "@/types"
import { Search, Mail, Package, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

  // Filtrar pedidos
  const filteredOrders = orders.filter((order) => {
    // Filtrar por termo de busca
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por status
    let matchesStatus = true
    if (statusFilter === "pending") {
      matchesStatus = order.paymentStatus === "pending" || order.deliveryStatus === "pending"
    } else if (statusFilter === "completed") {
      matchesStatus = order.paymentStatus === "paid" && order.deliveryStatus === "delivered"
    } else if (statusFilter === "failed") {
      matchesStatus = order.paymentStatus === "failed"
    }

    return matchesSearch && matchesStatus
  })

  // Ordenar pedidos por data (mais recentes primeiro)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Abrir detalhes do pedido
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  // Atualizar status do pedido
  const handleUpdateStatus = async (
    orderId: string,
    field: "paymentStatus" | "deliveryStatus",
    status: "pending" | "paid" | "failed" | "delivered",
  ) => {
    try {
      let updatedOrder

      if (field === "paymentStatus") {
        updatedOrder = await updateOrderStatus(orderId, status as any)
      } else {
        updatedOrder = await updateOrderStatus(orderId, undefined, status as any)
      }

      // Atualizar a lista de pedidos
      setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))

      // Atualizar o pedido selecionado
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder)
      }

      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Obter badge para status de pagamento
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Pago</Badge>
      case "pending":
        return <Badge variant="warning">Pendente</Badge>
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Obter badge para status de entrega
  const getDeliveryBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Entregue</Badge>
      case "pending":
        return <Badge variant="warning">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID ou email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pedidos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="failed">Falhos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOrderClick(order)}
                >
                  <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell>{getDeliveryBadge(order.deliveryStatus)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detalhes do Pedido */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Pedido</SheetTitle>
            <SheetDescription>{selectedOrder && `ID: ${selectedOrder.id}`}</SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Data</h4>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-primary mr-1" />
                    <span>{selectedOrder.email}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Itens do Pedido</h4>
                <div className="bg-muted rounded-md p-3 space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">Quantidade: {item.quantity}</div>
                      </div>
                      <div className="text-primary font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium">Total</span>
                <span className="text-primary font-bold">{formatCurrency(selectedOrder.total)}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status do Pagamento</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedOrder.paymentStatus === "pending" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "paymentStatus", "pending")}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Pendente
                    </Button>
                    <Button
                      variant={selectedOrder.paymentStatus === "paid" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "paymentStatus", "paid")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Pago
                    </Button>
                    <Button
                      variant={selectedOrder.paymentStatus === "failed" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "paymentStatus", "failed")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Falhou
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Status da Entrega</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedOrder.deliveryStatus === "pending" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "deliveryStatus", "pending")}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Pendente
                    </Button>
                    <Button
                      variant={selectedOrder.deliveryStatus === "delivered" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "deliveryStatus", "delivered")}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Entregue
                    </Button>
                  </div>
                </div>

                {selectedOrder.accountData && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Dados da Conta</h4>
                    <div className="bg-muted rounded-md p-3">
                      <pre className="text-xs whitespace-pre-wrap">{selectedOrder.accountData}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
