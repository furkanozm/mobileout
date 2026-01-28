"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterProps {
  onFilterChange: (filters: any) => void
  initialFilters?: any
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TeklifFilter({ onFilterChange, initialFilters = {}, isOpen, onOpenChange }: FilterProps) {
  const [filters, setFilters] = useState({
    durum: initialFilters.durum || "all",
    sozlesmeTuru: initialFilters.sozlesmeTuru || "all",
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    minTutar: initialFilters.minTutar || "",
    maxTutar: initialFilters.maxTutar || "",
    revizyon: initialFilters.revizyon || "all",
    revizeVarMi: initialFilters.revizeVarMi || "all",
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
    onOpenChange(false)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      durum: "all",
      sozlesmeTuru: "all",
      startDate: "",
      endDate: "",
      minTutar: "",
      maxTutar: "",
      revizyon: "all",
      revizeVarMi: "all",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[280px] sm:w-[350px] max-w-full inset-0 p-0"
        // Force the sheet to stay within the container
        containerClass="!fixed !inset-0 overflow-hidden"
      >
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Teklif Filtreleri</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-4 py-4 space-y-6">
            <div className="space-y-2">
              <Label>Durum</Label>
              <RadioGroup
                value={filters.durum}
                onValueChange={(value) => handleFilterChange("durum", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-status" />
                  <Label htmlFor="all-status" className="font-normal">
                    Tümü
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beklemede" id="beklemede" />
                  <Label htmlFor="beklemede" className="font-normal">
                    Beklemede
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onaylandi" id="onaylandi" />
                  <Label htmlFor="onaylandi" className="font-normal">
                    Onaylandı
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reddedildi" id="reddedildi" />
                  <Label htmlFor="reddedildi" className="font-normal">
                    Reddedildi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="revize_edildi" id="revize_edildi" />
                  <Label htmlFor="revize_edildi" className="font-normal">
                    Revize Edildi
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Sözleşme Türü</Label>
              <RadioGroup
                value={filters.sozlesmeTuru}
                onValueChange={(value) => handleFilterChange("sozlesmeTuru", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-contract" />
                  <Label htmlFor="all-contract" className="font-normal">
                    Tümü
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gecici_is_iliskisi" id="gecici_is_iliskisi" />
                  <Label htmlFor="gecici_is_iliskisi" className="font-normal">
                    Geçici İş İlişkisi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="danismanlik" id="danismanlik" />
                  <Label htmlFor="danismanlik" className="font-normal">
                    Danışmanlık
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Revizyon Durumu</Label>
              <RadioGroup
                value={filters.revizyon}
                onValueChange={(value) => handleFilterChange("revizyon", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-revisions" />
                  <Label htmlFor="all-revisions" className="font-normal">
                    Tümü
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="original" id="original" />
                  <Label htmlFor="original" className="font-normal">
                    Revize edilmemiş teklifler
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="revised" id="revised" />
                  <Label htmlFor="revised" className="font-normal">
                    Revize Edilmiş Teklifler
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="r1" id="r1" />
                  <Label htmlFor="r1" className="font-normal">
                    Revizyon 1
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="r2" id="r2" />
                  <Label htmlFor="r2" className="font-normal">
                    Revizyon 2
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="r3" id="r3" />
                  <Label htmlFor="r3" className="font-normal">
                    Revizyon 3+
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Revize Durumu</Label>
              <RadioGroup
                value={filters.revizeVarMi || "all"}
                onValueChange={(value) => handleFilterChange("revizeVarMi", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-revize" />
                  <Label htmlFor="all-revize" className="font-normal">
                    Tümü
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="var" id="revize-var" />
                  <Label htmlFor="revize-var" className="font-normal">
                    Revize Var
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yok" id="revize-yok" />
                  <Label htmlFor="revize-yok" className="font-normal">
                    Revize Yok
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Teklif Tarihi</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs">
                    Başlangıç
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs">
                    Bitiş
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tutar Aralığı</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minTutar" className="text-xs">
                    Min (₺)
                  </Label>
                  <Input
                    id="minTutar"
                    type="number"
                    placeholder="0"
                    value={filters.minTutar}
                    onChange={(e) => handleFilterChange("minTutar", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxTutar" className="text-xs">
                    Max (₺)
                  </Label>
                  <Input
                    id="maxTutar"
                    type="number"
                    placeholder="1000000"
                    value={filters.maxTutar}
                    onChange={(e) => handleFilterChange("maxTutar", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between p-4 border-t mt-auto">
          <Button variant="outline" onClick={handleResetFilters}>
            Sıfırla
          </Button>
          <Button onClick={handleApplyFilters}>Uygula</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

