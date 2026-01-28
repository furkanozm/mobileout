"use client"

import { useState } from "react"
import { TeklifList } from "./teklif-list"
import { TeklifDetail } from "./teklif-detail"
import { MOCK_TEKLIFLER } from "./mock-data"
import { Button } from "@/components/ui/button"
import { Filter, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Teklif } from "./types"
import { Header } from "@/components/header"
import { YeniTeklifScreen } from "./yeni-teklif-screen"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TeklifScreen() {
  const router = useRouter()
  const [selectedTeklif, setSelectedTeklif] = useState<Teklif | null>(null)
  const [teklifler, setTeklifler] = useState<Teklif[]>(MOCK_TEKLIFLER)
  const [showFilters, setShowFilters] = useState(false)
  const [showNewTeklifForm, setShowNewTeklifForm] = useState(false)
  const [filters, setFilters] = useState({
    durum: "all",
    sozlesmeTuru: "all",
    startDate: "",
    endDate: "",
    minTutar: "",
    maxTutar: "",
    revizyon: "all",
    revizeVarMi: "all",
  })

  const handleTeklifSelect = (teklif: Teklif) => {
    setSelectedTeklif(teklif)
  }

  const handleBack = () => {
    setSelectedTeklif(null)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    setShowFilters(false)
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
  }

  const handleTeklifUpdate = (updatedTeklif: Teklif) => {
    setTeklifler((prev) => prev.map((teklif) => (teklif.id === updatedTeklif.id ? updatedTeklif : teklif)))
    setSelectedTeklif(updatedTeklif)
  }

  const handleNewTeklif = () => {
    setShowNewTeklifForm(true)
  }

  const handleNewTeklifComplete = () => {
    setShowNewTeklifForm(false)
    // Optionally refresh the list here if a new teklif was added
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Show the new teklif form
  if (showNewTeklifForm) {
    return <YeniTeklifScreen onComplete={handleNewTeklifComplete} />
  }

  // Show the teklif detail
  if (selectedTeklif) {
    return <TeklifDetail teklif={selectedTeklif} onBack={handleBack} onUpdate={handleTeklifUpdate} />
  }

  // Show the main teklif list
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <Header
        title="Teklifler"
        onMenuClick={() => {}}
        showBackButton={false}
        showLogo={true}
        rightElement={
          <Button variant="ghost" size="icon" onClick={toggleFilters}>
            <Filter className="h-5 w-5" />
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <TeklifList teklifler={teklifler} onTeklifSelect={handleTeklifSelect} filters={filters} />
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={handleNewTeklif}
        size="icon"
        className="h-14 w-14 rounded-full absolute bottom-16 right-4 shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-10"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Filter Panel with Animation */}
      <div
        className={cn(
          "absolute inset-0 z-50 bg-black/20 transition-opacity duration-300",
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setShowFilters(false)}
      >
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-lg transition-transform duration-300 ease-out",
            showFilters ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Teklif Filtreleri</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
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

            <div className="flex justify-between p-4 border-t">
              <Button variant="outline" onClick={handleResetFilters}>
                Sıfırla
              </Button>
              <Button onClick={handleApplyFilters}>Uygula</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

