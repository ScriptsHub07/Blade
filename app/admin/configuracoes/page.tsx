import { getEfiBankSettings } from "@/lib/efi-bank"
import EfiBankSettingsForm from "@/components/admin/efi-bank-settings-form"
import AccountStockForm from "@/components/admin/account-stock-form"

export default async function AdminSettingsPage() {
  const efiBankSettings = await getEfiBankSettings()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="space-y-6">
        <EfiBankSettingsForm settings={efiBankSettings} />
        <AccountStockForm />
      </div>
    </div>
  )
}
