"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfessionOption {
  kod: string
  ad: string
}

interface ProfessionCodeSelectorProps {
  value: string
  onChange: (value: string) => void
  options: ProfessionOption[]
}

export function ProfessionCodeSelector({ value, onChange, options }: ProfessionCodeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-600">
        Meslek Kodu <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 bg-white">
          <SelectValue placeholder="Meslek kodu seçiniz" />
        </SelectTrigger>
        <SelectContent>
          {options.map((meslek) => (
            <SelectItem key={meslek.kod} value={meslek.kod}>
              {meslek.ad} - {meslek.kod}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

