"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { updateEfiBankSettings } from "@/lib/efi-bank"
import type { EfiBankSettings } from "@/types"
import { CreditCard, Save } from "lucide-react"

interface EfiBankSettingsFormProps {
  settings: EfiBankSettings
}

export default function EfiBankSettingsForm({ settings }: EfiBankSettingsFormProps) {
  const [merchantId, setMerchantId] = useState(settings.merchantId)
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [pixKey, setPixKey] = useState(settings.pixKey)
  const [callbackUrl, setCallbackUrl] = useState(settings.callbackUrl)
  const [environment, setEnvironment] = useState(settings.environment)
  const [enabled, setEnabled] = useState(settings.enabled)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos
    if (!merchantId || !apiKey || !pixKey || !callbackUrl) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateEfiBankSettings({
        merchantId,
        apiKey,
        pixKey,
        callbackUrl,
        environment,
        enabled,
      })

      toast({
        title: "Configurações salvas",
        description: "As configurações do EFI Bank foram salvas com sucesso.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Configurações do EFI Bank</CardTitle>
        </div>
        <CardDescription>Configure a integração com o EFI Bank para processar pagamentos PIX.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="merchantId">ID do Comerciante (Client ID)</Label>
              <Input
                id="merchantId"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="Seu Client ID do EFI Bank"
              />
              <p className="text-sm text-muted-foreground">Encontre seu Client ID no painel do EFI Bank.</p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="apiKey">Chave API (Client Secret)</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua Client Secret do EFI Bank"
              />
              <p className="text-sm text-muted-foreground">
                Esta chave é usada para autenticar suas requisições ao EFI Bank.
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Sua Chave PIX"
              />
              <p className="text-sm text-muted-foreground">Esta chave é usada para processar pagamentos PIX.</p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="callbackUrl">URL de Callback</Label>
              <Input
                id="callbackUrl"
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
                placeholder="URL para receber notificações de pagamento"
              />
              <p className="text-sm text-muted-foreground">Configure a URL para receber notificações de pagamento.</p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="environment">Ambiente</Label>
              <Select id="environment" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Produção</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Selecione o ambiente de integração.</p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="enabled">Habilitado</Label>
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
              <p className="text-sm text-muted-foreground">Ative ou desative a integração com o EFI Bank.</p>
            </div>
          </div>
          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
