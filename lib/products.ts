import type { Product } from "@/types"

// Dados de exemplo para produtos
const sampleProducts: Product[] = [
  {
    id: "product-1",
    name: "Conta Roblox Básica",
    description: "Conta Roblox com 100 Robux e itens básicos. Ideal para iniciantes.",
    price: 19.9,
    features: ["100 Robux", "Itens Básicos", "Email Verificado"],
    imageUrl: "/images/roblox-1.jpg",
    stock: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "product-2",
    name: "Conta Roblox Premium",
    description: "Conta Roblox com 1000 Robux, Premium ativado e diversos itens raros.",
    price: 49.9,
    features: ["1000 Robux", "Premium Ativado", "Itens Raros", "Email Verificado"],
    imageUrl: "/images/roblox-2.jpg",
    stock: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "product-3",
    name: "Conta Roblox VIP",
    description: "Conta Roblox com 5000 Robux, Premium ativado, itens exclusivos e raros.",
    price: 99.9,
    features: ["5000 Robux", "Premium Ativado", "Itens Exclusivos", "Itens Raros", "Email Verificado"],
    imageUrl: "/images/roblox-3.jpg",
    stock: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "product-4",
    name: "Conta Roblox Ultimate",
    description: "Conta Roblox com 10000 Robux, Premium ativado, itens limitados e exclusivos.",
    price: 199.9,
    features: ["10000 Robux", "Premium Ativado", "Itens Limitados", "Itens Exclusivos", "Email Verificado"],
    imageUrl: "/images/roblox-4.jpg",
    stock: 1,
    createdAt: new Date().toISOString(),
  },
]

// Inicializar produtos no localStorage se não existirem
const initializeProducts = () => {
  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    if (!storedProducts) {
      localStorage.setItem("products", JSON.stringify(sampleProducts))
    }
  }
}

// Obter todos os produtos
export async function getProducts(options?: { featured?: boolean; limit?: number }): Promise<Product[]> {
  initializeProducts()

  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  let products: Product[] = []

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    products = storedProducts ? JSON.parse(storedProducts) : sampleProducts
  } else {
    products = sampleProducts
  }

  // Aplicar filtros
  if (options?.featured) {
    products = products.sort((a, b) => b.stock - a.stock)
  }

  // Aplicar limite
  if (options?.limit) {
    products = products.slice(0, options.limit)
  }

  return products
}

// Obter um produto pelo ID
export async function getProductById(id?: string): Promise<Product | Product[]> {
  initializeProducts()

  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  let products: Product[] = []

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    products = storedProducts ? JSON.parse(storedProducts) : sampleProducts
  } else {
    products = sampleProducts
  }

  if (id) {
    const product = products.find((p) => p.id === id)
    if (!product) {
      throw new Error("Produto não encontrado")
    }
    return product
  }

  return products
}

// Adicionar um novo produto
export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  initializeProducts()

  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    const products = storedProducts ? JSON.parse(storedProducts) : []

    localStorage.setItem("products", JSON.stringify([...products, newProduct]))
  }

  return newProduct
}

// Atualizar um produto existente
export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> {
  initializeProducts()

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    const products = storedProducts ? JSON.parse(storedProducts) : []

    const updatedProducts = products.map((product: Product) => {
      if (product.id === id) {
        return { ...product, ...updates }
      }
      return product
    })

    localStorage.setItem("products", JSON.stringify(updatedProducts))

    const updatedProduct = updatedProducts.find((p: Product) => p.id === id)
    if (!updatedProduct) {
      throw new Error("Produto não encontrado")
    }

    return updatedProduct
  }

  throw new Error("Não foi possível atualizar o produto")
}

// Excluir um produto
export async function deleteProduct(id: string): Promise<void> {
  initializeProducts()

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    const products = storedProducts ? JSON.parse(storedProducts) : []

    const filteredProducts = products.filter((product: Product) => product.id !== id)

    localStorage.setItem("products", JSON.stringify(filteredProducts))
  }
}

// Atualizar o estoque de um produto
export async function updateProductStock(id: string, quantityChange: number): Promise<Product> {
  initializeProducts()

  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    const products = storedProducts ? JSON.parse(storedProducts) : []

    const product = products.find((p: Product) => p.id === id)
    if (!product) {
      throw new Error("Produto não encontrado")
    }

    const newStock = Math.max(0, product.stock + quantityChange)

    return updateProduct(id, { stock: newStock })
  }

  throw new Error("Não foi possível atualizar o estoque do produto")
}
