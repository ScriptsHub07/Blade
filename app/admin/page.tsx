import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOrders } from "@/lib/orders"
import { getProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import LowStockTable from "@/components/admin/low-stock-table"

export default async function AdminDashboard() {
  const orders = await getOrders()
  const products = await getProducts()

  // Calcular estatísticas
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.paymentStatus === "pending" || o.deliveryStatus === "pending").length
  const completedOrders = orders.filter((o) => o.paymentStatus === "paid" && o.deliveryStatus === "delivered").length
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((total, order) => total + order.total, 0)
  const lowStockProducts = products.filter((p) => p.stock <= 2).length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pendentes, {completedOrders} concluídos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +
              {formatCurrency(
                orders
                  .filter((o) => o.paymentStatus === "paid")
                  .slice(-5)
                  .reduce((total, order) => total + order.total, 0),
              )}{" "}
              nos últimos 5 pedidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">{lowStockProducts} com estoque baixo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Disponíveis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.reduce((total, product) => total + product.stock, 0)}</div>
            <p className="text-xs text-muted-foreground">Em {products.filter((p) => p.stock > 0).length} produtos</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="recent-orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent-orders">Pedidos Recentes</TabsTrigger>
            <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
          </TabsList>
          <TabsContent value="recent-orders" className="space-y-4">
            <RecentOrdersTable orders={orders.slice(0, 5)} />
          </TabsContent>
          <TabsContent value="low-stock" className="space-y-4">
            <LowStockTable products={products.filter((p) => p.stock <= 2).slice(0, 5)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
