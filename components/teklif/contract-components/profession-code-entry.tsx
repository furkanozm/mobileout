"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"

// Import sub-components
import { ProfessionCodeSelector } from "./profession-code-selector"
import { WageSection } from "./wage-section"
import { ServiceFeeSection } from "./service-fee-section"
import { ConsultingServiceSection } from "./consulting-service-section"

interface ProfessionCodeEntryProps {
  entry: any
  index: number
  isDanismanlik: boolean
  onToggleExpand: (id: string) => void
  onRemove: (id: string) => void
  onChange: (id: string, field: string, value: any) => void
  onMinimumWageChange: (id: string, checked: boolean) => void
  canRemove: boolean
  getMinimumWage: (ucretTipi: string, netBrut: string) => string
}

export function ProfessionCodeEntry({
  entry,
  index,
  isDanismanlik,
  onToggleExpand,
  onRemove,
  onChange,
  onMinimumWageChange,
  canRemove,
  getMinimumWage,
}: ProfessionCodeEntryProps) {
  const MESLEK_KODLARI = [
    { kod: "9920-01", ad: "Beden İşçisi (Genel)" },
    { kod: "9321-01", ad: "Sera İşçisi" },
    { kod: "6111-03", ad: "Seracı" },
  ]

  const DANISMANLIK_MESLEK_KODLARI = [
    { kod: "2142.06", ad: "İş Güvenliği Uzmanı" },
    { kod: "2141.07", ad: "Üretim Planlama Uzmanı" },
    { kod: "2511.01", ad: "Yazılım Danışmanı" },
  ]

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <h3 className="font-medium text-blue-700">
          Meslek Kodu {index + 1}
          {entry.meslekKodu && `: ${entry.meslekKodu}`}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpand(entry.id)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-8 w-8"
          >
            {entry.isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(entry.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-8 w-8"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {entry.isExpanded && (
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <ProfessionCodeSelector
              value={entry.meslekKodu}
              onChange={(value) => onChange(entry.id, "meslekKodu", value)}
              options={isDanismanlik ? DANISMANLIK_MESLEK_KODLARI : MESLEK_KODLARI}
            />

            {isDanismanlik ? (
              <ConsultingServiceSection entry={entry} onChange={(field, value) => onChange(entry.id, field, value)} />
            ) : (
              <>
                <WageSection
                  entry={entry}
                  onChange={(field, value) => onChange(entry.id, field, value)}
                  onMinimumWageChange={(checked) => onMinimumWageChange(entry.id, checked)}
                  getMinimumWage={getMinimumWage}
                />
                <Separator />
                <ServiceFeeSection entry={entry} onChange={(field, value) => onChange(entry.id, field, value)} />
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

