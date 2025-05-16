"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")

  const { register, loading, error } = useAuth()
  const router = useRouter()

  const validateName = () => {
    if (!name) {
      setNameError("O nome é obrigatório")
      return false
    } else if (name.length < 3) {
      setNameError("O nome deve ter pelo menos 3 caracteres")
      return false
    }
    setNameError("")
    return true
  }

  const validateEmail = () => {
    if (!email) {
      setEmailError("O email é obrigatório")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = () => {
    if (!password) {
      setPasswordError("A senha é obrigatória")
      return false
    } else if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmError("Confirme sua senha")
      return false
    } else if (confirmPassword !== password) {
      setConfirmError("As senhas não coincidem")
      return false
    }
    setConfirmError("")
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const isNameValid = validateName()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()
    const isConfirmValid = validateConfirmPassword()

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return
    }

    const success = await register(name, email, password)
    if (success) {
      router.push("/")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>Crie sua conta para começar a comprar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
              />
              {nameError && <p className="text-destructive text-sm">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              {emailError && <p className="text-destructive text-sm">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
              {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
              />
              {confirmError && <p className="text-destructive text-sm">{confirmError}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entre aqui
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
