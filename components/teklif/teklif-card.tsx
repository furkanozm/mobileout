"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, MapPin, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Teklif } from "./types"
import { formatCurrency } from "@/lib/utils"

interface TeklifCardProps {
  teklif: Teklif
  onClick: () => void
  index: number
  isSelected: boolean
  onSelect: () => void
}

export function TeklifCard({ teklif, onClick, index, isSelected, onSelect }: TeklifCardProps) {
  const totalBirimMaliyet = teklif.meslekKodlari?.reduce((sum, meslek) => sum + meslek.birimMaliyet, 0) || 0
  const hasRevision = teklif.currentRevision && teklif.currentRevision > 0

  return (
    <Card className={cn("transition-none", isSelected ? "border-blue-200 bg-blue-50" : "")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
                className={cn(
                  "min-w-[32px] min-h-[32px] w-8 h-8 rounded-full flex items-center justify-center",
                  "transition-all duration-200 cursor-pointer select-none",
                  "border-2",
                  isSelected
                    ? "bg-blue-100 border-blue-600 text-blue-700 font-bold scale-110 shadow-sm"
                    : "bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300",
                )}
              >
                {index + 1}
              </button>
              <div className="flex items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium">{teklif.firmaAdi}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{teklif.firmaSehir}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5">
              <Badge
                className={cn(
                  "px-2.5 py-0.5 whitespace-nowrap",
                  teklif.durum === "onaylandi" && "border-green-500 bg-green-100 text-green-800",
                  teklif.durum === "reddedildi" && "border-red-500 bg-red-100 text-red-800",
                  teklif.durum === "beklemede" && "border-yellow-500 bg-yellow-100 text-yellow-800",
                )}
              >
                {teklif.durum === "onaylandi"
                  ? "Onaylandı"
                  : teklif.durum === "reddedildi"
                    ? "Reddedildi"
                    : "Beklemede"}
              </Badge>
              {hasRevision && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-blue-50 border-blue-500 font-medium">
                  R{teklif.currentRevision}
                </Badge>
              )}
            </div>
            <Badge
              variant="outline"
              className={cn(
                "whitespace-nowrap",
                teklif.sozlesmeTuru === "gecici_is_iliskisi"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-teal-50 text-teal-700 border-teal-200",
              )}
            >
              {teklif.sozlesmeTuru === "gecici_is_iliskisi" ? "Geçici İş İlişkisi" : "Danışmanlık"}
            </Badge>
            {teklif.selectedProfessionCodes && teklif.selectedProfessionCodes.length > 0 && (
              <div className="mt-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {teklif.selectedProfessionCodes.map((code: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {code.code} - {code.name.substring(0, 15)}
                      {code.name.length > 15 ? "..." : ""} ({code.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {teklif.meslekKodlari && (
            <div className="space-y-3">
              <span className="text-sm text-muted-foreground">Meslek Kodları:</span>
              <div className="grid gap-3">
                {teklif.meslekKodlari.map((meslek) => (
                  <div key={meslek.kod} className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className="justify-start whitespace-nowrap bg-white border-gray-900 text-gray-900"
                    >
                      {meslek.kod} - {meslek.meslek}
                    </Badge>
                    <span className="font-medium">{formatCurrency(meslek.birimMaliyet)}</span>
                  </div>
                ))}
                {teklif.meslekKodlari.length > 1 && (
                  <div className="flex justify-between items-center text-sm pl-1 pt-2 border-t">
                    <span className="text-muted-foreground">Toplam Birim Maliyet:</span>
                    <span className="font-medium">{formatCurrency(totalBirimMaliyet)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">#{teklif.teklifNo}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

