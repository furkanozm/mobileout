"use client"
import { FormField } from "./form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface DurationSectionProps {
  durationType: string
  durationMethod: string
  startDate: string
  endDate: string
  workingDays: string
  onValueChange: (field: string, value: string) => void
}

export function DurationSection({
  durationType,
  durationMethod,
  startDate,
  endDate,
  workingDays,
  onValueChange,
}: DurationSectionProps) {
  return (
    <div className="space-y-6">
      <FormField label="Çalışma Süresi" required>
        <Select value={durationType} onValueChange={(value) => onValueChange("durationType", value)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Çalışma süresi seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unlimited">Süresiz</SelectItem>
            <SelectItem value="limited">Süreli</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {durationType === "limited" && (
        <FormField label="Süre Belirleme" required>
          <Select value={durationMethod} onValueChange={(value) => onValueChange("durationMethod", value)} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Süre belirleme yöntemi seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateRange">Tarih Aralığı</SelectItem>
              <SelectItem value="workingDays">Çalışma Günü</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}

      {durationType === "limited" && durationMethod === "dateRange" && (
        <FormField label="Süre" required>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="gg.aa.yyyy"
              value={startDate || ""}
              onChange={(e) => onValueChange("startDate", e.target.value)}
              className="w-full"
              required
            />
            <Input
              type="date"
              placeholder="gg.aa.yyyy"
              value={endDate || ""}
              onChange={(e) => onValueChange("endDate", e.target.value)}
              className="w-full"
              required
            />
          </div>
        </FormField>
      )}

      {durationType === "limited" && durationMethod === "workingDays" && (
        <div className="space-y-6">
          <FormField label="Başlangıç" required>
            <Input
              type="date"
              placeholder="gg.aa.yyyy"
              value={startDate || ""}
              onChange={(e) => onValueChange("startDate", e.target.value)}
              className="w-full"
              required
            />
          </FormField>
          <FormField label="Çalışma Günü" required>
            <Input
              type="number"
              min="1"
              placeholder="Çalışma günü sayısı"
              value={workingDays || ""}
              onChange={(e) => onValueChange("workingDays", e.target.value)}
              className="w-full"
              required
            />
          </FormField>
        </div>
      )}
    </div>
  )
}

