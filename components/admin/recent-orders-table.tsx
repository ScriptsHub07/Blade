import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Order } from "@/types"

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
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
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
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
  )
}
