import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, FileImage, FileIcon as FilePdf } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Evrak } from "./types"

const evrakTuruIkonlari: { [key: string]: React.ReactNode } = {
  pdf: <FilePdf className="h-5 w-5 text-red-500" />,
  jpg: <FileImage className="h-5 w-5 text-blue-500" />,
}

interface DocumentCardProps {
  evrak: Evrak
  index: number
  isSelected: boolean
  onSelect: (id: string) => void
  onClick: (evrak: Evrak) => void
}

export function DocumentCard({ evrak, index, isSelected, onSelect, onClick }: DocumentCardProps) {
  return (
    <Card className="transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200",
                isSelected
                  ? "bg-blue-100 border-2 border-blue-600 text-blue-700 font-bold scale-110 shadow-sm"
                  : "bg-blue-50 border-2 border-blue-200 text-blue-700 hover:border-blue-300",
              )}
              onClick={() => onSelect(evrak.id)}
            >
              {index + 1}
            </div>
            <div>
              <h3 className="text-base font-medium">{evrak.personelAdi}</h3>
              <p className="text-sm text-muted-foreground">
                {evrak.firma} • {evrak.projeGrubu}
              </p>
            </div>
          </div>
          <Badge
            className={cn(
              "px-2.5 py-0.5",
              evrak.durum === "onaylandı" && "bg-green-100 text-green-800 border-green-200",
              evrak.durum === "reddedildi" && "bg-red-100 text-red-800 border-red-200",
              evrak.durum === "beklemede" && "bg-yellow-100 text-yellow-800 border-yellow-200",
            )}
          >
            {evrak.durum === "onaylandı"
              ? "Onaylandı"
              : evrak.durum === "reddedildi"
                ? "Reddedildi"
                : evrak.durum === "indirildi"
                  ? "İndirildi, inceleniyor"
                  : "Beklemede"}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {evrakTuruIkonlari[evrak.dosyaTuru]}
            <span className="text-sm">{evrak.evrakTuru}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">{evrak.tarih}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClick(evrak)}
              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

