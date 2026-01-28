"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { REQUEST_REASONS } from "./mock-data"
import type { StepComponentProps } from "./types"

interface PurchaseStep4FormProps extends StepComponentProps {
  requestType: "internal" | "contractor"
  includeInCurrentBillingPeriod: boolean
  setIncludeInCurrentBillingPeriod: (value: boolean) => void
  separateInvoice: boolean
  setSeparateInvoice: (value: boolean) => void
}

export function PurchaseStep4Form({
  onNext,
  onBack,
  requestType,
  includeInCurrentBillingPeriod,
  setIncludeInCurrentBillingPeriod,
  separateInvoice,
  setSeparateInvoice,
}: PurchaseStep4FormProps) {
  const [reason, setReason] = useState("")

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Talep Nedeni</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Talep nedeni seçin" />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {requestType === "contractor" && (
        <Card className="p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Fatura Seçenekleri</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-billing" className="text-base font-medium">
                  Cari dönem faturasına dahil et
                </Label>
                <input
                  type="checkbox"
                  id="include-billing"
                  checked={includeInCurrentBillingPeriod}
                  onChange={(e) => setIncludeInCurrentBillingPeriod(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Taşeron firmanın cari dönem faturasına dahil edilmesini istiyorsanız bu seçeneği işaretleyin.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="separate-invoice" className="text-base font-medium">
                  Ayrı fatura kesilsin
                </Label>
                <input
                  type="checkbox"
                  id="separate-invoice"
                  checked={separateInvoice}
                  onChange={(e) => setSeparateInvoice(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Bu satın alma için ayrı bir fatura kesilmesini istiyorsanız bu seçeneği işaretleyin.
              </p>
            </div>
          </div>
        </Card>
      )}

      {requestType === "internal" && (
        <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-medium text-blue-700">Kurum İçi Talep</h3>
              <p className="text-sm text-blue-600">
                Kurum içi talepler için fatura seçenekleri bulunmamaktadır. Bu talep iç muhasebe sisteminde
                işlenecektir.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

