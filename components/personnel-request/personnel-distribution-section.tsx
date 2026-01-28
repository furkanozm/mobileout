"use client"
import { FormField } from "./form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonnelDistributionSectionProps {
  isMixedGender: boolean
  numberOfPeople: string
  numberOfMale: string
  numberOfFemale: string
  onValueChange: (field: string, value: string | boolean) => void
}

export function PersonnelDistributionSection({
  isMixedGender,
  numberOfPeople,
  numberOfMale,
  numberOfFemale,
  onValueChange,
}: PersonnelDistributionSectionProps) {
  return (
    <div className="space-y-6">
      <FormField label="Dağılım" required>
        <Select
          value={isMixedGender ? "mixed" : "separate"}
          onValueChange={(value) => onValueChange("isMixedGender", value === "mixed")}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Personel dağılımını seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mixed">Erkek kadın beraber</SelectItem>
            <SelectItem value="separate">Erkek kadın ayrı</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {isMixedGender ? (
        <FormField label="Toplam Kişi" required>
          <Input
            type="number"
            id="numberOfPeople"
            placeholder="Toplam personel sayısı"
            value={numberOfPeople}
            onChange={(e) => onValueChange("numberOfPeople", e.target.value)}
            min="1"
            required
            className="w-full"
          />
        </FormField>
      ) : (
        <div className="flex items-center">
          <div className="w-1/3 pr-2">
            <Label className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
              Kişi Sayısı <span className="text-red-500">*</span>
            </Label>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Input
              type="number"
              id="numberOfMale"
              placeholder="Erkek sayısı"
              value={numberOfMale}
              onChange={(e) => onValueChange("numberOfMale", e.target.value)}
              min="0"
              required
              className="w-full"
            />
            <Input
              type="number"
              id="numberOfFemale"
              placeholder="Kadın sayısı"
              value={numberOfFemale}
              onChange={(e) => onValueChange("numberOfFemale", e.target.value)}
              min="0"
              required
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

