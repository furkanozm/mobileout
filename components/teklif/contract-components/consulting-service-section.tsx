"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ConsultingServiceSectionProps {
  entry: any
  onChange: (field: string, value: any) => void
}

export function ConsultingServiceSection({ entry, onChange }: ConsultingServiceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Hizmet Satış Fiyatı <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          placeholder="0.00"
          value={entry.ucret}
          onChange={(e) => onChange("ucret", e.target.value)}
          className="h-11 bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Adet <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          min="1"
          value={entry.hizmetBedeliDegeri}
          onChange={(e) => onChange("hizmetBedeliDegeri", e.target.value)}
          className="h-11 bg-white"
        />
      </div>
    </div>
  )
}

