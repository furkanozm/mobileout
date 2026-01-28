import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Check } from "lucide-react"
import { FormSection } from "./form-section"
import { cn } from "@/lib/utils"

interface EkHizmetlerFormProps {
  includeAdditionalServices: boolean
  onIncludeChange: (value: boolean) => void
  currentHizmet: {
    sozlesmeTuru: string
    hizmetTuru: string
    hizmetAdi: string
    adet: string
    tutar: string
  }
  onHizmetChange: (field: string, value: string) => void
  onAddHizmet: () => void
  ekHizmetler: Array<{
    id: string
    hizmetAdi: string
    hizmetTuru: string
    adet: string
    tutar: string
  }>
}

const SOZLESME_TURLERI = [
  { value: "gecici_is_iliskisi", label: "Geçici İş İlişkisi" },
  { value: "danismanlik", label: "Danışmanlık" },
]

const HIZMET_TURLERI = [
  { value: "ulasim", label: "Ulaşım" },
  { value: "konaklama", label: "Konaklama" },
  { value: "yemek", label: "Yemek" },
  { value: "egitim", label: "Eğitim" },
  { value: "diger", label: "Diğer" },
]

export function EkHizmetlerForm({
  includeAdditionalServices,
  onIncludeChange,
  currentHizmet,
  onHizmetChange,
  onAddHizmet,
  ekHizmetler,
}: EkHizmetlerFormProps) {
  return (
    <>
      <FormSection title="Ek Hizmetler">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeAdditionalServices"
            checked={includeAdditionalServices}
            onCheckedChange={(checked) => onIncludeChange(checked === true)}
          />
          <Label htmlFor="includeAdditionalServices" className="text-sm text-gray-600">
            Teklife ek hizmet ekleyecek misiniz?
          </Label>
        </div>

        {includeAdditionalServices && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sozlesmeTuru" className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-400" />
                Sözleşme Türü
              </Label>
              <Select
                value={currentHizmet.sozlesmeTuru}
                onValueChange={(value) => onHizmetChange("sozlesmeTuru", value)}
              >
                <SelectTrigger className="w-full h-11 bg-white">
                  <SelectValue placeholder="Sözleşme türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {SOZLESME_TURLERI.map((tur) => (
                    <SelectItem key={tur.value} value={tur.value}>
                      {tur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hizmetTuru" className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-400" />
                Ek Hizmet Türü
              </Label>
              <Select value={currentHizmet.hizmetTuru} onValueChange={(value) => onHizmetChange("hizmetTuru", value)}>
                <SelectTrigger className="w-full h-11 bg-white">
                  <SelectValue placeholder="Ek hizmet türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {HIZMET_TURLERI.map((tur) => (
                    <SelectItem key={tur.value} value={tur.value}>
                      {tur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hizmetAdi" className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-400" />
                Ek Hizmet Adı
              </Label>
              <Input
                id="hizmetAdi"
                value={currentHizmet.hizmetAdi}
                onChange={(e) => onHizmetChange("hizmetAdi", e.target.value)}
                className="h-11 bg-white"
                placeholder="Ek hizmet adı"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adet" className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-400" />
                Ek Hizmet Adeti
              </Label>
              <Input
                id="adet"
                type="number"
                value={currentHizmet.adet}
                onChange={(e) => onHizmetChange("adet", e.target.value)}
                className="h-11 bg-white"
                placeholder="Ek hizmet adeti"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tutar" className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-400" />
                Ek Hizmet Tutarı
              </Label>
              <Input
                id="tutar"
                type="number"
                value={currentHizmet.tutar}
                onChange={(e) => onHizmetChange("tutar", e.target.value)}
                className="h-11 bg-white"
                placeholder="Ek hizmet tutarı"
              />
            </div>

            <Button
              type="button"
              onClick={onAddHizmet}
              className={cn(
                "w-full h-11",
                "bg-green-600 hover:bg-green-700 text-white",
                "flex items-center justify-center gap-2",
              )}
              disabled={
                !currentHizmet.sozlesmeTuru ||
                !currentHizmet.hizmetTuru ||
                !currentHizmet.hizmetAdi ||
                !currentHizmet.adet ||
                !currentHizmet.tutar
              }
            >
              <Plus className="h-5 w-5" />
              Ek Hizmet Ekle
            </Button>
          </div>
        )}
      </FormSection>

      {ekHizmetler.length > 0 && (
        <FormSection title="Eklenen Hizmetler">
          <div className="space-y-4">
            {ekHizmetler.map((hizmet) => (
              <div key={hizmet.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{hizmet.hizmetAdi}</h4>
                    <p className="text-sm text-gray-600">
                      {HIZMET_TURLERI.find((t) => t.value === hizmet.hizmetTuru)?.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{hizmet.tutar}₺</p>
                    <p className="text-sm text-gray-600">{hizmet.adet} adet</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      )}
    </>
  )
}

