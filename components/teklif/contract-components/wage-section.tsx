"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface WageSectionProps {
  entry: any
  onChange: (field: string, value: any) => void
  onMinimumWageChange: (checked: boolean) => void
  getMinimumWage: (ucretTipi: string, netBrut: string) => string
}

export function WageSection({ entry, onChange, onMinimumWageChange, getMinimumWage }: WageSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Ücret Tipi <span className="text-red-500">*</span>
        </Label>
        <Select value={entry.ucretTipi} onValueChange={(value) => onChange("ucretTipi", value)}>
          <SelectTrigger className="w-full h-11 bg-white">
            <SelectValue placeholder="Ücret tipi seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gun">Gün</SelectItem>
            <SelectItem value="saat">Saat</SelectItem>
            <SelectItem value="ay">Ay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Net/Brüt <span className="text-red-500">*</span>
        </Label>
        <Select value={entry.netBrut} onValueChange={(value) => onChange("netBrut", value)}>
          <SelectTrigger className="w-full h-11 bg-white">
            <SelectValue placeholder="Net/Brüt seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="net">Net</SelectItem>
            <SelectItem value="brut">Brüt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`isMinimumWage-${entry.id}`}
            checked={entry.isMinimumWage}
            onCheckedChange={(checked) => onMinimumWageChange(checked === true)}
            disabled={!entry.netBrut}
          />
          <Label htmlFor={`isMinimumWage-${entry.id}`} className="text-sm text-gray-600">
            Asgari ücretli mi? (2025)
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          Ücret <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          placeholder="0.00"
          value={entry.ucret}
          onChange={(e) => onChange("ucret", e.target.value)}
          className="h-11 bg-white"
          disabled={entry.isMinimumWage}
        />
      </div>
    </div>
  )
}

