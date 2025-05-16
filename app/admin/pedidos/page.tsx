import { getOrders } from "@/lib/orders"
import OrdersTable from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h1>
      <OrdersTable orders={orders} />
    </div>
  )
}
