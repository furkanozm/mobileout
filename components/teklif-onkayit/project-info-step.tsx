"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormCard } from "./form-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

interface ProjectInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

// Mock profession codes for the dropdown
const PROFESSION_CODES = [
  { code: "2512.01", name: "Yazılım Geliştirici" },
  { code: "2511.06", name: "Sistem Analisti" },
  { code: "2513.01", name: "Web Geliştirici" },
  { code: "2514.01", name: "Uygulama Programcısı" },
  { code: "2519.03", name: "Veri Tabanı Tasarımcısı" },
  { code: "2521.01", name: "Veri Tabanı Yöneticisi" },
  { code: "2522.01", name: "Sistem Yöneticisi" },
  { code: "2523.01", name: "Bilgisayar Ağı Uzmanı" },
  { code: "3511.01", name: "Bilgi İşlem Destek Uzmanı" },
  { code: "3512.01", name: "Bilgi Teknolojileri Teknik Destek Elemanı" },
]

export function ProjectInfoStep({ formData, updateFormData, onNext, onBack }: ProjectInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showProfessionCodes, setShowProfessionCodes] = useState(
    formData.selectedProfessionCodes && formData.selectedProfessionCodes.length > 0,
  )
  const [selectedCodes, setSelectedCodes] = useState<Array<{ code: string; name: string; count: string }>>(
    formData.selectedProfessionCodes || [],
  )
  const [showAdditionalServices, setShowAdditionalServices] = useState(
    formData.additionalServices && formData.additionalServices.length > 0,
  )
  const [additionalServices, setAdditionalServices] = useState<Array<{ service: string; unit: string }>>(
    formData.additionalServices || [],
  )

  // If formData has selectedProfessionCodes from pre-registration, use them
  useEffect(() => {
    if (formData.selectedProfessionCodes && formData.selectedProfessionCodes.length > 0 && selectedCodes.length === 0) {
      setSelectedCodes(formData.selectedProfessionCodes)
      setShowProfessionCodes(true)
    }
  }, [formData.selectedProfessionCodes])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleProfessionCodeToggle = (checked: boolean) => {
    setShowProfessionCodes(checked)
    if (!checked) {
      setSelectedCodes([])
      updateFormData({ selectedProfessionCodes: [] })
    }
  }

  const handleAdditionalServicesToggle = (checked: boolean) => {
    setShowAdditionalServices(checked)
    if (!checked) {
      setAdditionalServices([])
      updateFormData({ additionalServices: [] })
    }
  }

  const addProfessionCode = () => {
    setSelectedCodes([...selectedCodes, { code: "", name: "", count: "1" }])
  }

  const removeProfessionCode = (index: number) => {
    const newCodes = [...selectedCodes]
    newCodes.splice(index, 1)
    setSelectedCodes(newCodes)
    updateFormData({ selectedProfessionCodes: newCodes })
  }

  const updateProfessionCode = (index: number, field: string, value: string) => {
    const newCodes = [...selectedCodes]

    if (field === "code") {
      const selectedProfession = PROFESSION_CODES.find((p) => p.code === value)
      newCodes[index] = {
        ...newCodes[index],
        code: value,
        name: selectedProfession?.name || "",
      }
    } else {
      newCodes[index] = {
        ...newCodes[index],
        [field]: value,
      }
    }

    setSelectedCodes(newCodes)
    updateFormData({ selectedProfessionCodes: newCodes })
  }

  const addAdditionalService = () => {
    setAdditionalServices([...additionalServices, { service: "", unit: "" }])
  }

  const removeAdditionalService = (index: number) => {
    const newServices = [...additionalServices]
    newServices.splice(index, 1)
    setAdditionalServices(newServices)
    updateFormData({ additionalServices: newServices })
  }

  const updateAdditionalService = (index: number, field: string, value: string) => {
    const newServices = [...additionalServices]
    newServices[index] = {
      ...newServices[index],
      [field]: value,
    }
    setAdditionalServices(newServices)
    updateFormData({ additionalServices: newServices })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.projectGroup) newErrors.projectGroup = "Proje grubu gereklidir"
    if (!formData.projectLocation) newErrors.projectLocation = "Proje lokasyonu gereklidir"
    if (!formData.projectDescription) newErrors.projectDescription = "Proje açıklaması gereklidir"

    if (showProfessionCodes) {
      if (selectedCodes.length === 0) {
        newErrors.professionCodes = "En az bir meslek kodu seçmelisiniz"
      } else {
        for (let i = 0; i < selectedCodes.length; i++) {
          if (!selectedCodes[i].code) {
            newErrors[`code-${i}`] = "Meslek kodu seçmelisiniz"
          }
          if (!selectedCodes[i].count || Number.parseInt(selectedCodes[i].count) < 1) {
            newErrors[`count-${i}`] = "Geçerli bir sayı giriniz"
          }
        }
      }
    }

    if (showAdditionalServices) {
      for (let i = 0; i < additionalServices.length; i++) {
        if (!additionalServices[i].service) {
          newErrors[`service-${i}`] = "Hizmet adı giriniz"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold">Proje Bilgileri</div>}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectGroup">
              Proje Grubu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectGroup"
              name="projectGroup"
              value={formData.projectGroup}
              onChange={handleChange}
              className={`${errors.projectGroup ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Proje grubunu giriniz"
            />
            {errors.projectGroup && <p className="text-red-500 text-xs">{errors.projectGroup}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectLocation">
              Proje Lokasyonu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectLocation"
              name="projectLocation"
              value={formData.projectLocation}
              onChange={handleChange}
              className={`${errors.projectLocation ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Örn: İstanbul / Kadıköy"
            />
            {errors.projectLocation && <p className="text-red-500 text-xs">{errors.projectLocation}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">
              Proje Açıklaması <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className={`${errors.projectDescription ? "border-red-500" : ""} text-sm`}
              rows={4}
              placeholder="Proje hakkında detaylı bilgi giriniz"
            />
            {errors.projectDescription && <p className="text-red-500 text-xs">{errors.projectDescription}</p>}
          </div>
        </div>
      </FormCard>

      <div className="py-1">
        <h3 className="font-semibold text-gray-800 px-4">Personel İhtiyacı</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 border p-4 rounded-md bg-white">
          <Checkbox
            id="showProfessionCodes"
            checked={showProfessionCodes}
            onCheckedChange={(checked) => handleProfessionCodeToggle(checked === true)}
            className="mt-1"
          />
          <div className="grid gap-2.5 leading-none">
            <Label htmlFor="showProfessionCodes" className="font-medium cursor-pointer">
              Meslek kodlarına göre personel ihtiyacı belirtmek istiyorum
            </Label>
            <p className="text-sm text-muted-foreground">
              Projenizde ihtiyaç duyduğunuz personel türlerini ve sayılarını belirtebilirsiniz
            </p>
          </div>
        </div>

        {showProfessionCodes && (
          <div className="space-y-4 mt-4">
            {errors.professionCodes && (
              <p className="text-red-500 text-xs bg-red-50 p-2 rounded">{errors.professionCodes}</p>
            )}

            {selectedCodes.map((code, index) => (
              <div key={index} className="border rounded-md p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{code.name ? code.name : `Meslek Kodu #${index + 1}`}</h4>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                    onClick={() => removeProfessionCode(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`profession-code-${index}`} className="text-xs">
                      Meslek Kodu <span className="text-red-500">*</span>
                    </Label>
                    <Select value={code.code} onValueChange={(value) => updateProfessionCode(index, "code", value)}>
                      <SelectTrigger className={`${errors[`code-${index}`] ? "border-red-500" : ""} text-xs h-10`}>
                        <SelectValue placeholder="Meslek kodu seçin">
                          {code.code && (
                            <div className="truncate max-w-[120px] text-xs" title={`${code.code} - ${code.name}`}>
                              {code.code} - {code.name.length > 15 ? `${code.name.substring(0, 15)}...` : code.name}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PROFESSION_CODES.map((profession) => (
                          <SelectItem key={profession.code} value={profession.code} className="text-xs">
                            {profession.code} - {profession.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`code-${index}`] && <p className="text-red-500 text-xs">{errors[`code-${index}`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`personnel-count-${index}`} className="text-xs">
                      Personel Sayısı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`personnel-count-${index}`}
                      type="number"
                      min="1"
                      value={code.count}
                      onChange={(e) => updateProfessionCode(index, "count", e.target.value)}
                      className={`${errors[`count-${index}`] ? "border-red-500" : ""} text-xs h-10`}
                    />
                    {errors[`count-${index}`] && <p className="text-red-500 text-xs">{errors[`count-${index}`]}</p>}
                  </div>
                </div>
                {code.name && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    Seçilen meslek: <span className="font-medium">{code.name}</span>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              className="w-full mt-2 border border-dashed rounded-md p-2 text-blue-600 bg-white hover:bg-blue-50 transition-colors flex items-center justify-center text-xs"
              onClick={addProfessionCode}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Meslek Kodu Ekle
            </button>
          </div>
        )}

        <div className="flex items-start space-x-3 border p-4 rounded-md bg-white mt-6">
          <Checkbox
            id="showAdditionalServices"
            checked={showAdditionalServices}
            onCheckedChange={(checked) => handleAdditionalServicesToggle(checked === true)}
            className="mt-1"
          />
          <div className="grid gap-2.5 leading-none">
            <Label htmlFor="showAdditionalServices" className="font-medium cursor-pointer">
              Ek hizmet talep ediyorum
            </Label>
            <p className="text-sm text-muted-foreground">
              İş sağlığı ve güvenliği, eğitim, araç kiralama vb. hizmetleri belirtebilirsiniz
            </p>
          </div>
        </div>

        {showAdditionalServices && (
          <div className="space-y-4 mt-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="border rounded-md p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">
                    {service.service ? service.service : `Ek Hizmet #${index + 1}`}
                  </h4>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                    onClick={() => removeAdditionalService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`service-name-${index}`} className="text-xs">
                      Hizmet Adı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`service-name-${index}`}
                      value={service.service}
                      onChange={(e) => updateAdditionalService(index, "service", e.target.value)}
                      className={`${errors[`service-${index}`] ? "border-red-500" : ""} text-xs h-10`}
                      placeholder="Örn: İş Sağlığı ve Güvenliği"
                    />
                    {errors[`service-${index}`] && <p className="text-red-500 text-xs">{errors[`service-${index}`]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`service-unit-${index}`} className="text-xs">
                      Birim
                    </Label>
                    <Input
                      id={`service-unit-${index}`}
                      value={service.unit}
                      onChange={(e) => updateAdditionalService(index, "unit", e.target.value)}
                      placeholder="Örn: Aylık, Kişi Başı, vb."
                      className="text-xs h-10"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full mt-2 border border-dashed rounded-md p-2 text-blue-600 bg-white hover:bg-blue-50 transition-colors flex items-center justify-center text-xs"
              onClick={addAdditionalService}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Ek Hizmet Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

