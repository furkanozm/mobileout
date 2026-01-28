"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface TeklifStep4FormProps {
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

// Define the service types
const EK_HIZMET_TURLERI = [
  { id: "konaklama", label: "Konaklama" },
  { id: "ulasim", label: "Ulaşım" },
  { id: "yemek", label: "Yemek" },
  { id: "egitim", label: "Eğitim" },
  { id: "diger", label: "Diğer" },
]

// Define the service units
const EK_HIZMET_BIRIMLERI = [
  { id: "adet", label: "Adet" },
  { id: "saat", label: "Saat" },
  { id: "gun", label: "Gün" },
  { id: "ay", label: "Ay" },
  { id: "yil", label: "Yıl" },
]

interface EkHizmet {
  id: string
  tur: string
  ad: string
  birim: string
  tutar: string
  includedInTotal: boolean
}

export function TeklifStep4Form({ onNext, onBack, formData }: TeklifStep4FormProps) {
  const [ekHizmetler, setEkHizmetler] = useState<EkHizmet[]>(formData.ekHizmetler || [])
  const [currentHizmet, setCurrentHizmet] = useState<EkHizmet>({
    id: "",
    tur: "",
    ad: "",
    birim: "",
    tutar: "",
    includedInTotal: true,
  })

  const handleHizmetChange = (field: keyof EkHizmet, value: any) => {
    setCurrentHizmet((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddHizmet = () => {
    if (currentHizmet.tur && currentHizmet.ad && currentHizmet.birim && currentHizmet.tutar) {
      setEkHizmetler([...ekHizmetler, { ...currentHizmet, id: Date.now().toString() }])
      setCurrentHizmet({
        id: "",
        tur: "",
        ad: "",
        birim: "",
        tutar: "",
        includedInTotal: true,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ ekHizmetler })
  }

  // Ek hizmetleri otomatik olarak yüklemek için useEffect ekleyin
  useEffect(() => {
    // Eğer formData'da önceden seçilmiş ek hizmetler varsa
    if (formData.additionalServices && formData.additionalServices.length > 0) {
      // Ek hizmetleri ekHizmetler state'ine ekleyin
      const initialServices = formData.additionalServices.map((service: any, index: number) => ({
        id: `pre-${index}`,
        tur: service.service === "İş Sağlığı ve Güvenliği" ? "diger" : "ulasim",
        ad: service.service,
        birim: service.unit === "Aylık" ? "ay" : "gun",
        tutar: service.price || "2500", // Varsayılan tutar
        includedInTotal: index % 2 === 0, // Bazıları dahil, bazıları ayrı gösterilsin
      }))

      setEkHizmetler(initialServices)
    }
  }, [formData.additionalServices])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {ekHizmetler.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="font-medium text-sm text-gray-900">Eklenen Hizmetler</h3>
              <div className="space-y-3">
                {ekHizmetler.map((hizmet) => (
                  <div key={hizmet.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {EK_HIZMET_TURLERI.find((t) => t.id === hizmet.tur)?.label}
                        </p>
                        <p className="text-sm text-gray-500">{hizmet.ad}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hizmet.includedInTotal ? "Toplam Maliyete Dahil" : "Ayrı Gösterilecek"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Number(hizmet.tutar).toLocaleString("tr-TR")} ₺</p>
                        <p className="text-xs text-gray-500">
                          {EK_HIZMET_BIRIMLERI.find((b) => b.id === hizmet.birim)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hizmetTuru" className="text-sm text-gray-600">
                  Ek Hizmet Türü <span className="text-red-500">*</span>
                </Label>
                <Select value={currentHizmet.tur} onValueChange={(value) => handleHizmetChange("tur", value)}>
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="Ek hizmet türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {EK_HIZMET_TURLERI.map((tur) => (
                      <SelectItem key={tur.id} value={tur.id}>
                        {tur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hizmetAdi" className="text-sm text-gray-600">
                  Ek Hizmet Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hizmetAdi"
                  placeholder="Ek hizmet adı"
                  value={currentHizmet.ad}
                  onChange={(e) => handleHizmetChange("ad", e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hizmetBirimi" className="text-sm text-gray-600">
                  Ek Hizmet Birimi <span className="text-red-500">*</span>
                </Label>
                <Select value={currentHizmet.birim} onValueChange={(value) => handleHizmetChange("birim", value)}>
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="Birim seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {EK_HIZMET_BIRIMLERI.map((birim) => (
                      <SelectItem key={birim.id} value={birim.id}>
                        {birim.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hizmetTutari" className="text-sm text-gray-600">
                  Ek Hizmet Tutarı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hizmetTutari"
                  type="number"
                  placeholder="0.00"
                  value={currentHizmet.tutar}
                  onChange={(e) => handleHizmetChange("tutar", e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Maliyet Hesaplaması</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="includedInTotal"
                      name="costCalculation"
                      checked={currentHizmet.includedInTotal}
                      onChange={() => handleHizmetChange("includedInTotal", true)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="includedInTotal" className="text-sm font-normal">
                      Toplam Maliyete Ekle
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="separateFromTotal"
                      name="costCalculation"
                      checked={!currentHizmet.includedInTotal}
                      onChange={() => handleHizmetChange("includedInTotal", false)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="separateFromTotal" className="text-sm font-normal">
                      Ayrı Göster
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddHizmet}
                disabled={!currentHizmet.tur || !currentHizmet.ad || !currentHizmet.birim || !currentHizmet.tutar}
                className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 h-11"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ek Hizmet Ekle
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mb-4 bg-white border-t mt-auto">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
            Geri
          </Button>
          <Button type="submit" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
            Tamamla
          </Button>
        </div>
      </div>
    </form>
  )
}

