"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FirmaSelectionCard({ company, onRemove }: { company: any; onRemove: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 relative bg-white">
      <button onClick={onRemove} className="absolute right-2 top-2 text-gray-400 hover:text-red-500">
        <X className="h-5 w-5" />
      </button>

      <h3 className="font-semibold text-lg">{company.companyName}</h3>
      <p className="text-sm text-gray-600">Vergi No: {company.taxId}</p>
      <p className="text-sm text-gray-600">{company.city}, Türkiye</p>

      {company.selectedServices && company.selectedServices.length > 0 && (
        <div className="mt-2 text-blue-600">
          Seçilen Sözleşme Tipi:{" "}
          {company.selectedServices
            .map((service: string) => {
              switch (service) {
                case "gecici-is-gucu":
                  return "Geçici İş İlişkisi"
                case "danismanlik":
                  return "Danışmanlık"
                default:
                  return service
              }
            })
            .join(", ")}
        </div>
      )}

      {company.selectedProfessionCodes && company.selectedProfessionCodes.length > 0 && (
        <div className="mt-1.5">
          <div className="flex flex-wrap gap-1.5">
            {company.selectedProfessionCodes.map((code: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {code.code} - {code.name.substring(0, 15)}
                {code.name.length > 15 ? "..." : ""} ({code.count})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

