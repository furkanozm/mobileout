"use client"

import { useState, useEffect } from "react"
import { FormCard } from "./form-card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Info,
  Briefcase,
  Users,
  FileText,
  Building,
  Clock,
  Warehouse,
  LayoutGrid,
  Cpu,
  HardHat,
  ShieldCheck,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IOSAlert } from "../ui/ios-alert"

interface ContractInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
}

// Service types array
const HIZMET_TURLERI = [
  { id: "bordrolama", name: "Bordrolama" },
  { id: "yan-haklar", name: "Yan Haklar Yönetimi" },
  { id: "ozluk-dosyasi", name: "Özlük Dosyası Yönetimi" },
  { id: "tam-dis-kaynak", name: "Tam Dış Kaynak Kullanımı" },
  { id: "gecici-is-gucu", name: "Geçici İş İlişkisi" },
  { id: "danismanlik", name: "Danışmanlık" },
  { id: "tesis-yonetimi", name: "Tesis Yönetimi" },
  { id: "ofis-hizmetleri", name: "Ofis Hizmetleri Yönetimi" },
  { id: "ise-alim-otomasyon", name: "İşe Alım Süreçlerinin Otomasyonu" },
  { id: "alt-isveren", name: "Alt İşveren Yönetimi ve Danışmanlığı" },
  { id: "is-sagligi", name: "İş Sağlığı ve Güvenliği Yönetimi" },
]

// Mock pre-registered companies data
const MOCK_PRE_REGISTERED_COMPANIES = [
  {
    id: "company1",
    name: "ABC Company",
    yetkiliAdSoyad: "John Doe",
    yetkiliTelefon: "555-123-4567",
    yetkiliEmail: "john.doe@example.com",
  },
  {
    id: "company2",
    name: "XYZ Corporation",
    name: "XYZ Corporation",
    yetkiliAdSoyad: "Jane Smith",
    yetkiliTelefon: "555-987-6543",
    yetkiliEmail: "jane.smith@example.com",
  },
]

export function ContractInfoStep({ formData, updateFormData }: ContractInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedInfoServiceId, setSelectedInfoServiceId] = useState<string | null>(null)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(
    formData.selectedServices && formData.selectedServices.length > 0 ? formData.selectedServices : [],
  )

  // Sync selectedServices with formData when component mounts
  useEffect(() => {
    if (!formData.selectedServices) {
      updateFormData({ selectedServices: selectedServices })
    }
  }, [])

  // Update formData when selectedServices changes
  useEffect(() => {
    updateFormData({ selectedServices: selectedServices })
  }, [selectedServices])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      return prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    })
  }

  const handleChange = (field: string, value: any) => {
    if (typeof updateFormData === "function") {
      updateFormData({ [field]: value })
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  useEffect(() => {
    if (showServiceModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [showServiceModal])

  const getServiceDescription = (id: string) => {
    switch (id) {
      case "bordrolama":
        return (
          <div className="space-y-2">
            <p>
              Bordro ve özlük işlemleri yönetimi hizmeti. Çalışanlarınızın maaş hesaplamaları, vergi kesintileri, SGK
              bildirimleri ve diğer yasal yükümlülüklerinin profesyonel olarak yönetilmesi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aylık bordro hesaplamaları</li>
              <li>SGK ve vergi bildirimleri</li>
              <li>Yasal mevzuat takibi</li>
              <li>Özlük dosyalarının dijital yönetimi</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "yan-haklar":
        return (
          <div className="space-y-2">
            <p>
              Çalışan yan haklarının yönetimi ve optimizasyonu. Şirketinizin yan haklar paketinin tasarlanması,
              uygulanması ve yönetilmesi süreçlerinde profesyonel destek.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Yan haklar paketinin tasarlanması</li>
              <li>Sağlık sigortası yönetimi</li>
              <li>BES ve diğer emeklilik planları</li>
              <li>Yemek, ulaşım ve diğer yan haklar</li>
              <li>Piyasa karşılaştırmalı analizler</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "ozluk-dosyasi":
        return (
          <div className="space-y-2">
            <p>
              Personel özlük dosyalarının dijital ortamda yönetimi. Tüm çalışan belgelerinin yasal mevzuata uygun
              şekilde saklanması, yönetilmesi ve raporlanması.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dijital özlük dosyası oluşturma</li>
              <li>Belge takibi ve hatırlatma sistemleri</li>
              <li>Yasal saklama sürelerinin yönetimi</li>
              <li>KVKK uyumlu veri saklama</li>
              <li>Anlık raporlama ve denetim desteği</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "tam-dis-kaynak":
        return (
          <div className="space-y-2">
            <p>
              İK süreçlerinin tamamının dış kaynak ile yönetimi. Şirketinizin tüm insan kaynakları fonksiyonlarının
              profesyonel ekibimiz tarafından yönetilmesi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>İşe alım süreçleri</li>
              <li>Performans yönetimi</li>
              <li>Eğitim ve gelişim</li>
              <li>Bordro ve özlük yönetimi</li>
              <li>Çalışan ilişkileri yönetimi</li>
              <li>İK stratejisi ve danışmanlık</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "gecici-is-gucu":
        return (
          <div className="space-y-2">
            <p>
              Belirli süreli personel ihtiyaçları için geçici işgücü hizmeti. Proje bazlı, sezonluk veya geçici iş yükü
              artışlarında nitelikli personel temini.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hızlı personel temini</li>
              <li>Yasal işveren sorumluluklarının üstlenilmesi</li>
              <li>Esnek çalışma modelleri</li>
              <li>Proje bazlı işgücü planlaması</li>
              <li>Tüm bordro ve özlük süreçlerinin yönetimi</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "danismanlik":
        return (
          <div className="space-y-2">
            <p>
              İnsan kaynakları ve yönetim danışmanlığı hizmetleri. Şirketinizin İK stratejilerinin geliştirilmesi ve
              uygulanması konusunda profesyonel destek.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>İK süreçlerinin tasarımı ve iyileştirilmesi</li>
              <li>Organizasyonel yapılandırma</li>
              <li>Yetenek yönetimi stratejileri</li>
              <li>Performans yönetim sistemleri</li>
              <li>Ücret ve yan haklar danışmanlığı</li>
              <li>Değişim yönetimi</li>
              <li>İşe alım ve seçme yerleştirme süreçleri</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "tesis-yonetimi":
        return (
          <div className="space-y-2">
            <p>
              Şirket tesislerinin operasyonel yönetimi. Tesislerinizin bakım, onarım, güvenlik ve diğer operasyonel
              süreçlerinin profesyonel yönetimi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bina bakım ve onarım hizmetleri</li>
              <li>Güvenlik hizmetleri</li>
              <li>Temizlik ve hijyen yönetimi</li>
              <li>Enerji verimliliği çözümleri</li>
              <li>Acil durum yönetimi</li>
              <li>Tedarikçi yönetimi</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "ofis-hizmetleri":
        return (
          <div className="space-y-2">
            <p>
              Ofis operasyonlarının yönetimi ve optimizasyonu. Ofis içi süreçlerin verimli şekilde yönetilmesi ve
              maliyetlerin optimize edilmesi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resepsiyon ve karşılama hizmetleri</li>
              <li>Ofis malzemeleri yönetimi</li>
              <li>Toplantı odaları organizasyonu</li>
              <li>Posta ve kargo yönetimi</li>
              <li>Ofis içi etkinlik organizasyonu</li>
              <li>Misafir ağırlama hizmetleri</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "ise-alim-otomasyon":
        return (
          <div className="space-y-2">
            <p>
              İşe alım süreçlerinin dijitalleştirilmesi. Modern teknolojiler kullanarak işe alım süreçlerinizin
              otomatize edilmesi ve verimliliğin artırılması.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dijital başvuru sistemleri</li>
              <li>Otomatik CV tarama ve eşleştirme</li>
              <li>Video mülakat platformları</li>
              <li>Yetkinlik değerlendirme araçları</li>
              <li>İşe alım metrikleri ve raporlama</li>
              <li>Aday deneyimi optimizasyonu</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "alt-isveren":
        return (
          <div className="space-y-2">
            <p>
              Alt işveren ilişkilerinin yasal ve operasyonel yönetimi. Alt işveren ilişkilerinizin yasal mevzuata uygun
              şekilde yapılandırılması ve yönetilmesi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alt işveren sözleşmelerinin hazırlanması</li>
              <li>Yasal uyum denetimi</li>
              <li>Risk analizi ve yönetimi</li>
              <li>Operasyonel süreçlerin yapılandırılması</li>
              <li>Denetim ve raporlama</li>
              <li>Mevzuat değişikliklerinin takibi</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      case "is-sagligi":
        return (
          <div className="space-y-2">
            <p>
              İSG süreçlerinin yönetimi ve yasal uyum danışmanlığı. İş sağlığı ve güvenliği süreçlerinizin yasal
              mevzuata uygun şekilde yönetilmesi.
            </p>
            <p>Bu hizmet kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Risk değerlendirmesi</li>
              <li>İSG eğitimleri</li>
              <li>Acil durum planları</li>
              <li>İSG kurulu toplantıları</li>
              <li>Sağlık gözetimleri</li>
              <li>Yasal dokümantasyon yönetimi</li>
              <li>Denetim ve raporlama</li>
            </ul>
            <p className="text-blue-600 underline cursor-pointer mt-2">Daha detaylı bilgi için tıklayınız</p>
          </div>
        )
      default:
        return ""
    }
  }

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "bordrolama":
        return <Briefcase className="h-5 w-5" />
      case "yan-haklar":
        return <Users className="h-5 w-5" />
      case "ozluk-dosyasi":
        return <FileText className="h-5 w-5" />
      case "tam-dis-kaynak":
        return <Building className="h-5 w-5" />
      case "gecici-is-gucu":
        return <Clock className="h-5 w-5" />
      case "danismanlik":
        return <Briefcase className="h-5 w-5" />
      case "tesis-yonetimi":
        return <Warehouse className="h-5 w-5" />
      case "ofis-hizmetleri":
        return <LayoutGrid className="h-5 w-5" />
      case "ise-alim-otomasyon":
        return <Cpu className="h-5 w-5" />
      case "alt-isveren":
        return <HardHat className="h-5 w-5" />
      case "is-sagligi":
        return <ShieldCheck className="h-5 w-5" />
      default:
        return null
    }
  }

  const handlePreRegisteredCompanySelect = (companyId: string) => {
    const selectedCompany = MOCK_PRE_REGISTERED_COMPANIES.find((company) => company.id === companyId)

    if (selectedCompany) {
      // Set company info from the selected pre-registered company
      updateFormData({
        companyName: selectedCompany.name,
        contactName: selectedCompany.yetkiliAdSoyad,
        contactPhone: selectedCompany.yetkiliTelefon,
        contactEmail: selectedCompany.yetkiliEmail,
        isPreRegistered: true,
        selectedPreRegisteredCompany: companyId,
      })

      // Set service duration dates automatically
      const startDate = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1) // Add 1 year

      // Format dates as YYYY-MM-DD for input fields
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      updateFormData({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })
    }
  }

  useEffect(() => {
    if (!formData.selectedServices && typeof updateFormData === "function") {
      updateFormData({ selectedServices: selectedServices })
    }
  }, [])

  useEffect(() => {
    if (typeof updateFormData === "function") {
      updateFormData({ selectedServices: selectedServices })
    }
  }, [selectedServices])

  return (
    <div className="space-y-6">
      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold">Sözleşme Bilgileri</div>}>
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Sözleşme Türü</Label>
            <div className="space-y-2">
              {["gecici-is-gucu", "danismanlik"].map((serviceId) => {
                const service = HIZMET_TURLERI.find((s) => s.id === serviceId)
                if (!service) return null

                return (
                  <div
                    key={serviceId}
                    className={cn(
                      "flex items-center space-x-2 border p-3 rounded-md transition-colors cursor-pointer text-sm",
                      selectedServices.includes(serviceId)
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "hover:bg-gray-50",
                    )}
                    onClick={() => handleServiceToggle(serviceId)}
                  >
                    <div className="mr-2">{getServiceIcon(serviceId)}</div>
                    <span className="font-medium text-sm flex-1">{service.name}</span>
                    <button
                      type="button"
                      className="bg-blue-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedInfoServiceId(serviceId)
                      }}
                    >
                      <Info className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )
              })}
            </div>
            {selectedServices.includes("gecici-is-gucu") &&
              formData.selectedProfessionCodes &&
              formData.selectedProfessionCodes.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <Label className="text-sm mb-2 block">Seçilen Meslek Kodları:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedProfessionCodes.map((code: any, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {code.code} - {code.name} ({code.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            {errors.selectedServices && <p className="text-sm text-red-500 mt-1">{errors.selectedServices}</p>}

            {/* Service Type Selection Button */}
            <div className="mt-4">
              <Button
                type="button"
                variant="default"
                onClick={() => setShowServiceModal(true)}
                className="w-full flex justify-between items-center h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                <span>Tüm Hizmet Türlerini Gör</span>
                <div className="rounded-full border-2 border-white p-0.5">
                  <Info className="h-5 w-5" />
                </div>
              </Button>
            </div>
          </div>

          {/* Service Duration */}
          <div className="space-y-2">
            <Label className="text-base font-medium mb-2 block">Hizmet Süresi</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Başlangıç Tarihi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={`${errors.startDate ? "border-red-500" : ""} text-sm h-10`}
                />
                {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Bitiş Tarihi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className={`${errors.endDate ? "border-red-500" : ""} text-sm h-10`}
                />
                {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
              </div>
            </div>
          </div>
        </div>
      </FormCard>

      {/* Service Type Modal */}
      {showServiceModal && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center">
          <div className="w-full h-full flex items-end justify-center">
            <div
              className="bg-white rounded-t-xl w-full overflow-hidden"
              style={{
                height: "85%",
                animation: "slideUp 0.3s ease-out forwards",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                  }
                `,
                }}
              />
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <div className="p-4 relative h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Hizmet Türü Seçin</h3>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    onClick={() => setShowServiceModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-grow overflow-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {HIZMET_TURLERI.map((tur) => (
                      <div
                        key={tur.id}
                        className={cn(
                          "relative border rounded-lg p-2.5 flex items-center cursor-pointer transition-colors",
                          selectedServices.includes(tur.id)
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white hover:bg-gray-50 border-gray-200",
                        )}
                        onClick={() => handleServiceToggle(tur.id)}
                      >
                        <div className="mr-2.5">{getServiceIcon(tur.id)}</div>
                        <span className="text-xs font-medium flex-1">{tur.name}</span>
                        <button
                          type="button"
                          className="bg-blue-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedInfoServiceId(tur.id)
                          }}
                        >
                          <Info className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Info Alert */}
      {selectedInfoServiceId && (
        <IOSAlert
          isOpen={!!selectedInfoServiceId}
          onClose={() => setSelectedInfoServiceId(null)}
          onConfirm={() => setSelectedInfoServiceId(null)}
          title={HIZMET_TURLERI.find((h) => h.id === selectedInfoServiceId)?.name || "Hizmet Bilgisi"}
          message={
            <div className="text-sm max-h-[50vh] overflow-y-auto">{getServiceDescription(selectedInfoServiceId)}</div>
          }
          confirmText="Tamam"
        />
      )}

      {/* Info Alert */}
      <IOSAlert
        isOpen={showInfoAlert}
        onClose={() => setShowInfoAlert(false)}
        onConfirm={() => setShowInfoAlert(false)}
        title="Hizmet Türleri Hakkında"
        message={
          <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto">
            {HIZMET_TURLERI.map((tur) => (
              <div key={tur.id} className="pb-3 border-b border-gray-200 last:border-0">
                <h4 className="font-medium mb-1">{tur.name}</h4>
                {getServiceDescription(tur.id)}
              </div>
            ))}
          </div>
        }
        confirmText="Tamam"
      />
    </div>
  )
}

