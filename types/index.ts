// Usuário
export interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

// Produto
export interface Product {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  imageUrl: string
  stock: number
  createdAt: string
}

// Carrinho
export interface CartItem {
  productId: string
  quantity: number
}

// Pedido
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  paymentStatus: "pending" | "paid" | "failed"
  deliveryStatus: "pending" | "delivered"
  createdAt: string
  email: string
  paymentId?: string
  accountData?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

// Configurações do EFI Bank
export interface EfiBankSettings {
  merchantId: string
  apiKey: string
  pixKey: string
  callbackUrl: string
  environment: "homologacao" | "producao"
  enabled: boolean
}
