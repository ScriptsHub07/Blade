import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import CheckoutForm from "@/components/checkout-form"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Checkout - TheBuxx",
  description: "Finalize sua compra",
}

export default function CheckoutPage() {
  // Verificar se o usuário está logado (no lado do servidor)
  const userCookie = cookies().get("user")

  if (!userCookie) {
    redirect("/login?redirect=/checkout")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
