"use client"

import { useState } from "react"
import { FormCard } from "./form-card"
import { Check, X, Users } from "lucide-react"
import { IOSAlert } from "../ui/ios-alert"

interface ReviewStepProps {
  formData: any
  onSubmit: () => void
}

export function ReviewStep({ formData, onSubmit }: ReviewStepProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const getServiceName = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      "gecici-is-gucu": "Geçici İş İlişkisi",
      danismanlik: "Danışmanlık",
      bordrolama: "Bordrolama",
      "yan-haklar": "Yan Haklar Yönetimi",
      "ozluk-dosyasi": "Özlük Dosyası Yönetimi",
      "tam-dis-kaynak": "Tam Dış Kaynak Kullanımı",
      "tesis-yonetimi": "Tesis Yönetimi",
      "ofis-hizmetleri": "Ofis Hizmetleri Yönetimi",
      "ise-alim-otomasyon": "İşe Alım Süreçlerinin Otomasyonu",
      "alt-isveren": "Alt İşveren Yönetimi ve Danışmanlığı",
      "is-sagligi": "İş Sağlığı ve Güvenliği Yönetimi",
    }
    return serviceMap[serviceId] || serviceId
  }

  const getContractTypeDisplay = () => {
    if (!formData.selectedServices || formData.selectedServices.length === 0) {
      return "Seçilmedi"
    }

    return formData.selectedServices.map((serviceId: string) => getServiceName(serviceId)).join(", ")
  }

  return (
    <div className="space-y-6">
      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold text-lg">Proje Bilgileri</div>}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Proje Grubu:</span>
            <span className="font-medium text-xs">{formData.projectGroup || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Proje Lokasyonu:</span>
            <span className="font-medium text-xs">{formData.projectLocation || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 mb-1 text-xs">Proje Açıklaması:</span>
            <span className="font-medium text-xs bg-gray-50 p-2 rounded">{formData.projectDescription || "-"}</span>
          </div>

          {formData.selectedProfessionCodes && formData.selectedProfessionCodes.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-600 block mb-2 text-xs">Personel İhtiyacı:</span>
              <div className="space-y-2">
                {formData.selectedProfessionCodes.map((code: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs">
                      <span className="font-medium">{code.name}</span> ({code.code}) - {code.count} kişi
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </FormCard>

      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold text-lg">Firma Bilgileri</div>}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Firma Adı:</span>
            <span className="font-medium text-xs">{formData.companyName || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Vergi No:</span>
            <span className="font-medium text-xs">{formData.taxId || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Vergi Dairesi:</span>
            <span className="font-medium text-xs">{formData.taxOffice || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Adres:</span>
            <span className="font-medium text-xs">{formData.address || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">İl/İlçe:</span>
            <span className="font-medium text-xs">
              {formData.city ? `${formData.city}${formData.district ? ` / ${formData.district}` : ""}` : "-"}
            </span>
          </div>
        </div>
      </FormCard>

      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold text-lg">İletişim Bilgileri</div>}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Yetkili Adı:</span>
            <span className="font-medium text-xs">{formData.contactName || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Ünvan:</span>
            <span className="font-medium text-xs">{formData.contactTitle || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Telefon:</span>
            <span className="font-medium text-xs">{formData.contactPhone || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">E-posta:</span>
            <span className="font-medium text-xs">{formData.contactEmail || "-"}</span>
          </div>
        </div>
      </FormCard>

      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold text-lg">Sözleşme Bilgileri</div>}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Seçilen Sözleşme Tipi:</span>
            <span className="font-medium text-xs">{getContractTypeDisplay()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Ek Hizmet Talebi:</span>
            <span className="font-medium flex items-center text-xs">
              {formData.needsAdditionalServices ? (
                <Check className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-1" />
              )}
              {formData.needsAdditionalServices ? "Evet" : "Hayır"}
            </span>
          </div>
        </div>
      </FormCard>

      <IOSAlert
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false)
          onSubmit()
        }}
        title="Teklif Önkayıt Onayı"
        message="Teklif önkayıt bilgileriniz kaydedilecektir. Onaylıyor musunuz?"
        confirmText="Onaylıyorum"
        cancelText="İptal"
      />
    </div>
  )
}

