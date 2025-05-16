import type { EfiBankSettings } from "@/types"

// Obter configurações do EFI Bank
export async function getEfiBankSettings(): Promise<EfiBankSettings> {
  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (typeof window !== "undefined") {
    const storedSettings = localStorage.getItem("efiBankSettings")

    if (storedSettings) {
      return JSON.parse(storedSettings)
    }

    // Configurações padrão
    const defaultSettings: EfiBankSettings = {
      merchantId: "",
      apiKey: "",
      pixKey: "",
      callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/api/webhook` : "",
      environment: "homologacao",
      enabled: false,
    }

    localStorage.setItem("efiBankSettings", JSON.stringify(defaultSettings))
    return defaultSettings
  }

  // Configurações padrão para SSR
  return {
    merchantId: "",
    apiKey: "",
    pixKey: "",
    callbackUrl: "",
    environment: "homologacao",
    enabled: false,
  }
}

// Atualizar configurações do EFI Bank
export async function updateEfiBankSettings(settings: Partial<EfiBankSettings>): Promise<EfiBankSettings> {
  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (typeof window !== "undefined") {
    const storedSettings = localStorage.getItem("efiBankSettings")
    const currentSettings = storedSettings ? JSON.parse(storedSettings) : {}

    const updatedSettings = { ...currentSettings, ...settings }
    localStorage.setItem("efiBankSettings", JSON.stringify(updatedSettings))

    return updatedSettings
  }

  throw new Error("Não foi possível atualizar as configurações do EFI Bank")
}

// Criar pagamento PIX
export async function createPixPayment(email: string, items: any[], orderId: string): Promise<any> {
  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Em um ambiente real, você faria uma chamada para a API do EFI Bank
  // Aqui estamos simulando a resposta

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Gerar QR Code simulado
  const qrCodeData = {
    id: orderId,
    qr_code_id: `pix-${Date.now()}`,
    pix_url: `pix://payment/${orderId}`,
    qr_code:
      "00020101021226880014br.gov.bcb.pix2566qrcodes-pix.efipay.com.br/v2/cobv/7d9f0335c7ab4d0a8f929e7e0b3acd295204000053039865802BR5925EMPRESA SIMULADA LTDA6009SAO PAULO62070503***63041D14",
    qr_image:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226880014br.gov.bcb.pix2566qrcodes-pix.efipay.com.br/v2/cobv/7d9f0335c7ab4d0a8f929e7e0b3acd295204000053039865802BR5925EMPRESA SIMULADA LTDA6009SAO PAULO62070503***63041D14",
    valor: total.toFixed(2),
    email: email,
  }

  return qrCodeData
}

// Verificar status do pagamento
export async function checkPaymentStatus(paymentId: string): Promise<{ status: string; isPaid: boolean }> {
  // Simular um atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Em um ambiente real, você faria uma chamada para a API do EFI Bank
  // Aqui estamos simulando a resposta

  // Simular uma chance de 30% de o pagamento ser confirmado a cada verificação
  const isPaid = Math.random() < 0.3

  return {
    status: isPaid ? "CONCLUIDA" : "ATIVA",
    isPaid,
  }
}
