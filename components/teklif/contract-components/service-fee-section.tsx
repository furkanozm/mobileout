"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServiceFeeSectionProps {
  entry: any
  onChange: (field: string, value: any) => void
}

export function ServiceFeeSection({ entry, onChange }: ServiceFeeSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Hizmet Bedeli Türü <span className="text-red-500">*</span>
        </Label>
        <Select value={entry.hizmetBedeliTuru} onValueChange={(value) => onChange("hizmetBedeliTuru", value)}>
          <SelectTrigger className="w-full h-11 bg-white">
            <SelectValue placeholder="Hizmet bedeli türü seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yuzde">Yüzde</SelectItem>
            <SelectItem value="sabit">Sabit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Hizmet Bedeli Değeri <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          placeholder="0.00"
          value={entry.hizmetBedeliDegeri}
          onChange={(e) => onChange("hizmetBedeliDegeri", e.target.value)}
          className="h-11 bg-white"
        />
      </div>
    </div>
  )
}

