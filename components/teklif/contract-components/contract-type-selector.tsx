"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContractTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  isPreRegistered?: boolean
  contractType?: "gecici_is_iliskisi" | "danismanlik"
}

export function ContractTypeSelector({
  value,
  onChange,
  isPreRegistered = false,
  contractType = "gecici_is_iliskisi",
}: ContractTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="sozlesmeTipi" className="text-sm text-gray-600">
        Sözleşme Tipi <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 bg-white">
          <SelectValue placeholder="Sözleşme tipi seçiniz" />
        </SelectTrigger>
        <SelectContent>
          {isPreRegistered ? (
            // If pre-registered, only show the selected contract type
            contractType === "gecici_is_iliskisi" ? (
              <SelectItem value="gecici_is_iliskisi">Geçici İş İlişkisi</SelectItem>
            ) : (
              <SelectItem value="danismanlik">Danışmanlık</SelectItem>
            )
          ) : (
            // If not pre-registered, show both options
            <>
              <SelectItem value="gecici_is_iliskisi">Geçici İş İlişkisi</SelectItem>
              <SelectItem value="danismanlik">Danışmanlık</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

