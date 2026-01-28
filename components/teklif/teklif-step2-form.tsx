"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeklifStep2FormProps {
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

// Mock data for sectors
const SECTORS = [
  { id: "1", name: "Bilişim Teknolojileri" },
  { id: "2", name: "Üretim" },
  { id: "3", name: "Finans" },
  { id: "4", name: "Sağlık" },
  { id: "5", name: "Eğitim" },
  { id: "6", name: "Perakende" },
  { id: "7", name: "İnşaat" },
  { id: "8", name: "Turizm" },
  { id: "9", name: "Lojistik" },
  { id: "10", name: "Enerji" },
]

export function TeklifStep2Form({ onNext, onBack, formData }: TeklifStep2FormProps) {
  const [iletisimKisi, setIletisimKisi] = useState(formData.iletisimKisi || "")
  const [telefon, setTelefon] = useState(formData.telefon || "")
  const [email, setEmail] = useState(formData.email || "")
  const [selectedSektor, setSelectedSektor] = useState<any>(null)

  // Set sector from pre-registration data
  useEffect(() => {
    if (formData.sektor) {
      const sector = SECTORS.find((s) => s.id === formData.sektor)
      if (sector) {
        setSelectedSektor(sector)
      }
    }
  }, [formData.sektor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      iletisimKisi,
      telefon,
      email,
      sektor: selectedSektor?.id,
      sektorAdi: selectedSektor?.name,
    }

    onNext(data)
  }

  const isFormValid = iletisimKisi && telefon && email && selectedSektor

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900">İletişim Bilgileri</h3>

            <div className="space-y-2">
              <Label htmlFor="iletisimKisi" className="text-sm text-gray-600">
                İletişim Kişisi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="iletisimKisi"
                placeholder="İletişim kişisi"
                value={iletisimKisi}
                onChange={(e) => setIletisimKisi(e.target.value)}
                className="h-11 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefon" className="text-sm text-gray-600">
                Telefon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefon"
                placeholder="Telefon numarası"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="h-11 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-600">
                E-posta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="E-posta adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Firma Bilgileri</h3>

            <div className="space-y-2">
              <Label htmlFor="sektor" className="text-sm text-gray-600">
                Sektör <span className="text-red-500">*</span>
              </Label>
              {formData.firmaType === "preregistered" ? (
                <div className="h-11 px-3 flex items-center bg-gray-50 border rounded-md">
                  <span className="text-gray-900 text-sm">{selectedSektor?.name || "Sektör bilgisi bekleniyor"}</span>
                </div>
              ) : (
                <Select
                  value={selectedSektor?.id || ""}
                  onValueChange={(value) => {
                    const sector = SECTORS.find((s) => s.id === value)
                    setSelectedSektor(sector)
                  }}
                >
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="Sektör seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {formData.firmaType === "preregistered" && selectedSektor && (
                <p className="text-sm text-blue-600">Bu sektör ön kayıt formunda seçilmiştir.</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mb-4 bg-white border-t mt-auto">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
            Geri
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Devam Et
          </Button>
        </div>
      </div>
    </form>
  )
}

