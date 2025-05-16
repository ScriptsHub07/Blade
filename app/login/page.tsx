import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login - TheBuxx",
  description: "Faça login na sua conta",
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
