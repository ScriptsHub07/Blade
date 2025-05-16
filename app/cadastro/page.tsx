import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import RegisterForm from "@/components/register-form"

export const metadata: Metadata = {
  title: "Cadastro - TheBuxx",
  description: "Crie sua conta na TheBuxx",
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="max-w-md mx-auto">
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
