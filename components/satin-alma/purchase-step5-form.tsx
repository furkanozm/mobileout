"use client"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { StepComponentProps } from "./types"

interface PurchaseStep5FormProps extends StepComponentProps {
  includeInCurrentBilling: boolean
  setIncludeInCurrentBilling: (value: boolean) => void
  issueSeparateInvoice: boolean
  setIssueSeparateInvoice: (value: boolean) => void
}

export function PurchaseStep5Form({
  onNext,
  onBack,
  includeInCurrentBilling,
  setIncludeInCurrentBilling,
  issueSeparateInvoice,
  setIssueSeparateInvoice,
}: PurchaseStep5FormProps) {
  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Fatura Seçenekleri</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="current-billing">Cari dönem faturasına dahil et</Label>
                <p className="text-sm text-muted-foreground">Bu talep mevcut fatura dönemine dahil edilecek</p>
              </div>
              <Switch
                id="current-billing"
                checked={includeInCurrentBilling}
                onCheckedChange={setIncludeInCurrentBilling}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="separate-invoice">Ayrı fatura kesilsin</Label>
                <p className="text-sm text-muted-foreground">Bu talep için ayrı bir fatura kesilecek</p>
              </div>
              <Switch id="separate-invoice" checked={issueSeparateInvoice} onCheckedChange={setIssueSeparateInvoice} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

