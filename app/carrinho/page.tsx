import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import CartContent from "@/components/cart-content"

export const metadata: Metadata = {
  title: "Carrinho - TheBuxx",
  description: "Seu carrinho de compras",
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Carrinho</h1>
          <CartContent />
        </div>
      </main>
      <Footer />
    </>
  )
}
