import type { Order, OrderItem } from "@/types"
import { generateId } from "@/lib/utils"
import { updateProductStock } from "@/lib/products"

// Inicializar pedidos no localStorage se não existirem
const initializeOrders = () => {
  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders")
    if (!storedOrders) {
      localStorage.setItem("orders", JSON.stringify([]))
    }
  }
}

// Obter todos os pedidos
export async function getOrders(userId?: string): Promise<Order[]> {
  initializeOrders()

  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  let orders: Order[] = []

  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders")
    orders = storedOrders ? JSON.parse(storedOrders) : []
  }

  // Filtrar por usuário se especificado
  if (userId) {
    orders = orders.filter((order) => order.userId === userId)
  }

  return orders
}

// Obter um pedido pelo ID
export async function getOrderById(id: string): Promise<Order> {
  initializeOrders()

  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders")
    const orders = storedOrders ? JSON.parse(storedOrders) : []

    const order = orders.find((o: Order) => o.id === id)
    if (!order) {
      throw new Error("Pedido não encontrado")
    }

    return order
  }

  throw new Error("Não foi possível obter o pedido")
}

// Criar um novo pedido
export async function createOrder(userId: string, items: OrderItem[], total: number, email: string): Promise<Order> {
  initializeOrders()

  const newOrder: Order = {
    id: generateId(),
    userId,
    items,
    total,
    paymentStatus: "pending",
    deliveryStatus: "pending",
    createdAt: new Date().toISOString(),
    email,
  }

  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders")
    const orders = storedOrders ? JSON.parse(storedOrders) : []

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]))

    // Atualizar estoque dos produtos
    for (const item of items) {
      await updateProductStock(item.productId, -item.quantity)
    }
  }

  return newOrder
}

// Atualizar o status de um pedido
export async function updateOrderStatus(
  id: string,
  paymentStatus?: "pending" | "paid" | "failed",
  deliveryStatus?: "pending" | "delivered",
): Promise<Order> {
  initializeOrders()

  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders")
    const orders = storedOrders ? JSON.parse(storedOrders) : []

    const updatedOrders = orders.map((order: Order) => {
      if (order.id === id) {
        return {
          ...order,
          ...(paymentStatus && { paymentStatus }),
          ...(deliveryStatus && { deliveryStatus }),
        }
      }
      return order
    })

    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    const updatedOrder = updatedOrders.find((o: Order) => o.id === id)
    if (!updatedOrder) {
      throw new Error("Pedido não encontrado")
    }

    return updatedOrder
  }

  throw new Error("Não foi possível atualizar o status do pedido")
}
