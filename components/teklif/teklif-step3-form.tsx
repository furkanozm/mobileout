"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Info,
  Plus,
  Trash2,
  Percent,
  DollarSign,
  ChevronUp,
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
import { IOSAlert } from "../ui/ios-alert"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface TeklifStep3FormProps {
  onNext: (data: any) => void
  onBack: () => void
  formData: any
  updateFormData?: (data: any) => void // Make this optional
}

// Remove "İşe Alım ve Seçme Yerleştirme" from the service types list
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

// Mock data for profession codes
const MESLEK_KODLARI = [
  { id: "1234", name: "Yazılım Geliştirici", baseWage: 17002 },
  { id: "5678", name: "Muhasebeci", baseWage: 15000 },
  { id: "9012", name: "İnsan Kaynakları Uzmanı", baseWage: 16000 },
]

// Update the ProfessionEntry interface to include a flag for showing wage fields
interface ProfessionEntry {
  id: string
  meslekKodu: string
  ucretTipi: string // ay, gun, saat
  netBrut: string // net, brut
  ucret: string
  karTipi?: string // yuzde, rakam - only for gecici
  karDegeri?: string // only for gecici
  isMinimumWage: boolean
  // For danismanlik
  hizmetBedeliHakedisUzerinden?: boolean
  hizmetBedeliYuzdesi?: string
  hizmetBedeliTutari?: string // Direct service fee amount
}

export function TeklifStep3Form({ formData, updateFormData, onNext, onBack }: TeklifStep3FormProps) {
  // Add a default no-op function for updateFormData
  const safeUpdateFormData =
    updateFormData ||
    ((data: any) => {
      // This is a no-op function that does nothing
      console.log("Warning: updateFormData not provided", data)
    })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showServiceInfo, setShowServiceInfo] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [hizmetTuru, setHizmetTuru] = useState(formData.sozlesmeTipi || "")

  // Initialize date fields from multiple possible sources
  const [baslangicTarihi, setBaslangicTarihi] = useState(formData.baslangicTarihi || formData.startDate || "")
  const [bitisTarihi, setBitisTarihi] = useState(formData.bitisTarihi || formData.endDate || "")

  const [aciklama, setAciklama] = useState(formData.aciklama || "")
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedInfoServiceId, setSelectedInfoServiceId] = useState<string | null>(null)

  // Update the initial state to include the new field
  const [professionEntries, setProfessionEntries] = useState<ProfessionEntry[]>([
    {
      id: "1",
      meslekKodu: "",
      ucretTipi: "ay", // default to monthly
      netBrut: "net", // default to net
      ucret: "",
      karTipi: hizmetTuru === "gecici-is-gucu" ? "yuzde" : undefined,
      karDegeri: "",
      isMinimumWage: false,
      hizmetBedeliHakedisUzerinden: false,
      hizmetBedeliYuzdesi: "50", // default to 50%
      hizmetBedeliTutari: "", // default empty
    },
  ])

  // Set contract type if pre-registered
  useEffect(() => {
    if (formData.sozlesmeTipi) {
      // Map the contract type from the backend to the correct format for this form
      const contractTypeMapping = {
        gecici: "gecici-is-gucu",
        danismanlik: "danismanlik",
      }

      setHizmetTuru(contractTypeMapping[formData.sozlesmeTipi] || formData.sozlesmeTipi)
    }
  }, [formData.sozlesmeTipi])

  // Meslek kodlarını otomatik olarak yüklemek için useEffect ekleyin
  useEffect(() => {
    // Eğer formData'da önceden seçilmiş meslek kodları varsa
    if (formData.selectedProfessionCodes && formData.selectedProfessionCodes.length > 0) {
      // Meslek kodlarını professionEntries state'ine ekleyin
      const initialEntries = formData.selectedProfessionCodes.map((code: any, index: number) => ({
        id: `pre-${index}`,
        meslekKodu: code.code || "",
        ucretTipi: "ay",
        netBrut: "net",
        ucret: "", // Boş bırakıldı
        karTipi: hizmetTuru === "gecici-is-gucu" ? "yuzde" : undefined,
        karDegeri: "", // Boş bırakıldı
        isMinimumWage: false,
        hizmetBedeliHakedisUzerinden: hizmetTuru === "danismanlik",
        hizmetBedeliYuzdesi: "",
        hizmetBedeliTutari: "",
      }))

      setProfessionEntries(initialEntries)
    }
  }, [formData.selectedProfessionCodes, hizmetTuru])

  useEffect(() => {
    if (showServiceModal) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = ""
    }

    return () => {
      // Cleanup: ensure scrolling is re-enabled when component unmounts
      document.body.style.overflow = ""
    }
  }, [showServiceModal])

  // Set default dates when component mounts if they're not already set
  useEffect(() => {
    if (!baslangicTarihi || !bitisTarihi) {
      const today = new Date()
      const oneYearLater = new Date()
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      const newStartDate = formatDate(today)
      const newEndDate = formatDate(oneYearLater)

      // Update both local state and form data
      if (!baslangicTarihi) setBaslangicTarihi(newStartDate)
      if (!bitisTarihi) setBitisTarihi(newEndDate)

      // Update all possible field names to ensure compatibility
      safeUpdateFormData({
        startDate: newStartDate,
        endDate: newEndDate,
        baslangicTarihi: newStartDate,
        bitisTarihi: newEndDate,
      })
    }
  }, [])

  // Update form data when dates change
  useEffect(() => {
    if (baslangicTarihi || bitisTarihi) {
      // Update all possible field names to ensure compatibility
      safeUpdateFormData({
        startDate: baslangicTarihi,
        endDate: bitisTarihi,
        baslangicTarihi: baslangicTarihi,
        bitisTarihi: bitisTarihi,
      })
    }
  }, [baslangicTarihi, bitisTarihi])

  const getMinimumWage = (ucretTipi: string, netBrut: string) => {
    // 2025 projected minimum wage values (estimates)
    const minimumWages = {
      ay: {
        net: "21500",
        brut: "26875",
      },
      gun: {
        net: "860",
        brut: "1075",
      },
      saat: {
        net: "129",
        brut: "161.25",
      },
    }

    return minimumWages[ucretTipi as keyof typeof minimumWages]?.[netBrut as keyof typeof minimumWages.ay] || ""
  }

  // Update the handleAddProfession function to include the new field
  const handleAddProfession = () => {
    setProfessionEntries([
      ...professionEntries,
      {
        id: Date.now().toString(),
        meslekKodu: "",
        ucretTipi: "ay",
        netBrut: "net",
        ucret: "",
        karTipi: hizmetTuru === "gecici-is-gucu" ? "yuzde" : undefined,
        karDegeri: "",
        isMinimumWage: false,
        hizmetBedeliHakedisUzerinden: false,
        hizmetBedeliYuzdesi: "50",
        hizmetBedeliTutari: "",
      },
    ])
  }

  const handleRemoveProfession = (id: string) => {
    if (professionEntries.length > 1) {
      setProfessionEntries(professionEntries.filter((entry) => entry.id !== id))
    }
  }

  const handleProfessionChange = (id: string, field: keyof ProfessionEntry, value: any) => {
    setProfessionEntries(
      professionEntries.map((entry) => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, [field]: value }

          // If changing ucretTipi or netBrut and minimum wage is checked, update the ucret value
          if ((field === "ucretTipi" || field === "netBrut") && entry.isMinimumWage) {
            updatedEntry.ucret = getMinimumWage(
              field === "ucretTipi" ? value : entry.ucretTipi,
              field === "netBrut" ? value : entry.netBrut,
            )
          }

          return updatedEntry
        }
        return entry
      }),
    )
  }

  const handleMinimumWageChange = (id: string, checked: boolean) => {
    setProfessionEntries(
      professionEntries.map((entry) => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, isMinimumWage: checked }

          if (checked) {
            updatedEntry.ucret = getMinimumWage(entry.ucretTipi, entry.netBrut)
          }

          return updatedEntry
        }
        return entry
      }),
    )
  }

  // Update the calculateCosts function to handle the new logic
  const calculateCosts = (entry: ProfessionEntry) => {
    const selectedProfession = MESLEK_KODLARI.find((kod) => kod.id === entry.meslekKodu)
    if (!selectedProfession)
      return {
        personelHakedisi: 0,
        sgkIsverenPayi: 0,
        issizlikIsverenPayi: 0,
        toplamMaliyet: 0,
        karTutari: 0,
        hizmetBedeli: 0,
        toplamFatura: 0,
      }

    // For consulting with direct service fee
    if (hizmetTuru === "danismanlik" && !entry.hizmetBedeliHakedisUzerinden && entry.hizmetBedeliTutari) {
      const hizmetBedeli = Number(entry.hizmetBedeliTutari)
      return {
        personelHakedisi: 0,
        sgkIsverenPayi: 0,
        issizlikIsverenPayi: 0,
        toplamMaliyet: 0,
        karTutari: 0,
        hizmetBedeli,
        toplamFatura: hizmetBedeli,
      }
    }

    // For other cases that require wage calculation
    if (!entry.ucret) {
      return {
        personelHakedisi: 0,
        sgkIsverenPayi: 0,
        issizlikIsverenPayi: 0,
        toplamMaliyet: 0,
        karTutari: 0,
        hizmetBedeli: 0,
        toplamFatura: 0,
      }
    }

    const ucret = Number(entry.ucret)
    const personelHakedisi = ucret
    const sgkIsverenPayi = personelHakedisi * 0.225 // %22.5
    const issizlikIsverenPayi = personelHakedisi * 0.02 // %2

    const toplamMaliyet = personelHakedisi + sgkIsverenPayi + issizlikIsverenPayi

    let karTutari = 0
    let hizmetBedeli = 0

    if (hizmetTuru === "gecici-is-gucu" && entry.karTipi && entry.karDegeri) {
      if (entry.karTipi === "yuzde") {
        karTutari = toplamMaliyet * (Number(entry.karDegeri) / 100)
      } else if (entry.karTipi === "rakam") {
        karTutari = Number(entry.karDegeri)
      }
    } else if (hizmetTuru === "danismanlik" && entry.hizmetBedeliHakedisUzerinden && entry.hizmetBedeliYuzdesi) {
      // Calculate based on payment amount
      hizmetBedeli = personelHakedisi * (Number(entry.hizmetBedeliYuzdesi) / 100)
    }

    const toplamFatura =
      hizmetTuru === "gecici-is-gucu"
        ? toplamMaliyet + karTutari
        : entry.hizmetBedeliHakedisUzerinden
          ? personelHakedisi + hizmetBedeli
          : hizmetBedeli

    return {
      personelHakedisi,
      sgkIsverenPayi,
      issizlikIsverenPayi,
      toplamMaliyet,
      karTutari,
      hizmetBedeli,
      toplamFatura,
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    safeUpdateFormData({ [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    safeUpdateFormData({ [name]: value })

    // Clear error when user selects
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contractType) newErrors.contractType = "Sözleşme tipi seçmelisiniz"
    if (!baslangicTarihi) newErrors.startDate = "Başlangıç tarihi gereklidir"
    if (!bitisTarihi) newErrors.endDate = "Bitiş tarihi gereklidir"
    if (baslangicTarihi && bitisTarihi && new Date(baslangicTarihi) > new Date(bitisTarihi)) {
      newErrors.endDate = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      hizmetTuru,
      baslangicTarihi,
      bitisTarihi,
      startDate: baslangicTarihi, // Add both field names for compatibility
      endDate: bitisTarihi,
      aciklama,
      professionEntries: professionEntries.map((entry) => {
        const costs = calculateCosts(entry)
        return {
          ...entry,
          ...costs,
        }
      }),
      toplamMaliyet: professionEntries.reduce((sum, entry) => sum + calculateCosts(entry).toplamFatura, 0),
    }

    // Use the safe function
    safeUpdateFormData(data)

    // Always call onNext
    onNext(data)
  }

  // Update the isFormValid check
  const isFormValid =
    (hizmetTuru || formData.sozlesmeTipi) &&
    baslangicTarihi &&
    bitisTarihi &&
    (hizmetTuru === "gecici-is-gucu" || formData.sozlesmeTipi === "gecici"
      ? professionEntries.every(
          (entry) =>
            entry.meslekKodu &&
            entry.ucret &&
            (entry.karTipi === "yuzde" || entry.karTipi === "rakam") &&
            entry.karDegeri,
        )
      : hizmetTuru === "danismanlik" || formData.sozlesmeTipi === "danismanlik"
        ? professionEntries.every(
            (entry) =>
              entry.meslekKodu &&
              (entry.hizmetBedeliHakedisUzerinden
                ? entry.ucret && entry.hizmetBedeliYuzdesi
                : entry.hizmetBedeliTutari),
          )
        : true)

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* Contract Type Display */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Seçilen Sözleşme Tipi:</span>
            <Badge
              variant="outline"
              className={cn(
                "font-normal",
                hizmetTuru === "gecici-is-gucu"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200",
              )}
            >
              {HIZMET_TURLERI.find((h) => h.id === hizmetTuru)?.name ||
                (formData.sozlesmeTipi === "gecici"
                  ? "Geçici İş İlişkisi"
                  : formData.sozlesmeTipi === "danismanlik"
                    ? "Danışmanlık"
                    : "Seçilmedi")}
            </Badge>
          </div>

          {/* Service Duration */}
          <div className="space-y-2 mb-4">
            <Label className="text-sm text-gray-600">Hizmet Süresi</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={baslangicTarihi}
                onChange={(e) => setBaslangicTarihi(e.target.value)}
                className="h-10 bg-white"
                placeholder="Başlangıç Tarihi"
              />
              <Input
                type="date"
                value={bitisTarihi}
                onChange={(e) => setBitisTarihi(e.target.value)}
                className="h-10 bg-white"
                placeholder="Bitiş Tarihi"
              />
            </div>
          </div>

          {/* Contract Type Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-900">Hizmet Detayları</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowInfoAlert(true)}
                className="h-8 w-8"
              >
                <Info className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* Update the service type selection button with this updated version: */}
            <div className="space-y-2">
              <Label htmlFor="hizmetTuru" className="text-sm text-gray-600">
                Hizmet Türü <span className="text-red-500">*</span>
              </Label>
              <button
                type="button"
                onClick={() => setShowServiceModal(true)}
                disabled={!!formData.sozlesmeTipi}
                className={cn(
                  "w-full flex h-11 items-center justify-between rounded-md border bg-white px-3 py-2",
                  "text-sm font-normal transition-colors",
                  !hizmetTuru && "text-muted-foreground",
                  formData.sozlesmeTipi && "opacity-50 cursor-not-allowed",
                  "hover:bg-gray-50/50",
                )}
              >
                <span className="truncate">
                  {HIZMET_TURLERI.find((h) => h.id === hizmetTuru)?.name || "Hizmet türü seçin"}
                </span>
                <ChevronUp className="h-4 w-4 opacity-50 rotate-180 shrink-0 ml-2" />
              </button>
              {formData.sozlesmeTipi && (
                <p className="text-sm text-blue-600 mt-1">Bu sözleşme tipi ön kayıt formunda seçilmiştir.</p>
              )}
            </div>

            {/* Profession Code Entries */}
            {(hizmetTuru === "gecici-is-gucu" || hizmetTuru === "danismanlik") && (
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-gray-900">Meslek Kodları</h3>
                  <Button
                    type="button"
                    onClick={handleAddProfession}
                    className="h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Meslek Kodu Ekle
                  </Button>
                </div>

                {professionEntries.map((entry, index) => (
                  <div key={entry.id} className="bg-white p-4 rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Meslek Kodu #{index + 1}</h4>
                      </div>
                      {professionEntries.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProfession(entry.id)}
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Kaldır
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`meslekKodu-${entry.id}`} className="text-sm text-gray-600">
                        Meslek Kodu <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={entry.meslekKodu}
                        onValueChange={(value) => handleProfessionChange(entry.id, "meslekKodu", value)}
                      >
                        <SelectTrigger className="w-full h-11 bg-white" id={`meslekKodu-${entry.id}`}>
                          <SelectValue placeholder="Meslek kodu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {MESLEK_KODLARI.map((kod) => (
                            <SelectItem key={kod.id} value={kod.id}>
                              {kod.name} - {kod.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Move the checkbox here for consulting */}
                    {hizmetTuru === "danismanlik" && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`hizmetBedeliHakedisUzerinden-${entry.id}`}
                            checked={entry.hizmetBedeliHakedisUzerinden}
                            onCheckedChange={(checked) =>
                              handleProfessionChange(entry.id, "hizmetBedeliHakedisUzerinden", checked === true)
                            }
                          />
                          <Label htmlFor={`hizmetBedeliHakedisUzerinden-${entry.id}`} className="text-sm text-gray-600">
                            Hakediş üzerinden hizmet bedeli hesapla
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* Show wage fields only for gecici or when hakediş checkbox is checked for danismanlik */}
                    {(hizmetTuru === "gecici-is-gucu" ||
                      (hizmetTuru === "danismanlik" && entry.hizmetBedeliHakedisUzerinden)) && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`ucretTipi-${entry.id}`} className="text-sm text-gray-600">
                              Ücret Tipi <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={entry.ucretTipi}
                              onValueChange={(value) => handleProfessionChange(entry.id, "ucretTipi", value)}
                            >
                              <SelectTrigger className="w-full h-11 bg-white" id={`ucretTipi-${entry.id}`}>
                                <SelectValue placeholder="Ücret tipi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ay">Aylık</SelectItem>
                                <SelectItem value="gun">Günlük</SelectItem>
                                <SelectItem value="saat">Saatlik</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`netBrut-${entry.id}`} className="text-sm text-gray-600">
                              Net/Brüt <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={entry.netBrut}
                              onValueChange={(value) => handleProfessionChange(entry.id, "netBrut", value)}
                            >
                              <SelectTrigger className="w-full h-11 bg-white" id={`netBrut-${entry.id}`}>
                                <SelectValue placeholder="Net/Brüt seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="net">Net</SelectItem>
                                <SelectItem value="brut">Brüt</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Show minimum wage checkbox only for gecici */}
                        {hizmetTuru === "gecici-is-gucu" && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`isMinimumWage-${entry.id}`}
                                checked={entry.isMinimumWage}
                                onCheckedChange={(checked) => handleMinimumWageChange(entry.id, checked === true)}
                                disabled={!entry.netBrut}
                              />
                              <Label htmlFor={`isMinimumWage-${entry.id}`} className="text-sm text-gray-600">
                                Asgari ücretli mi? (2025)
                              </Label>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor={`ucret-${entry.id}`} className="text-sm text-gray-600">
                            Ücret <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`ucret-${entry.id}`}
                            type="number"
                            placeholder="0.00"
                            value={entry.ucret}
                            onChange={(e) => handleProfessionChange(entry.id, "ucret", e.target.value)}
                            className="h-11 bg-white"
                            disabled={entry.isMinimumWage}
                          />
                        </div>
                      </>
                    )}

                    {/* Different sections based on contract type */}
                    {hizmetTuru === "gecici-is-gucu" ? (
                      // For Geçici İş İlişkisi - Show profit type and value
                      <div className="space-y-4">
                        <Label className="text-sm text-gray-600">
                          Hizmet Bedeli Tipi <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => handleProfessionChange(entry.id, "karTipi", "yuzde")}
                            className={cn(
                              "p-3 border rounded-lg text-center transition-colors flex items-center justify-center",
                              entry.karTipi === "yuzde"
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-white hover:bg-gray-50",
                            )}
                          >
                            <Percent className="h-4 w-4 mr-1.5" />
                            <h4 className="font-medium text-xs">Yüzde</h4>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleProfessionChange(entry.id, "karTipi", "rakam")}
                            className={cn(
                              "p-3 border rounded-lg text-center transition-colors flex items-center justify-center",
                              entry.karTipi === "rakam"
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-white hover:bg-gray-50",
                            )}
                          >
                            <DollarSign className="h-4 w-4 mr-1.5" />
                            <h4 className="font-medium text-xs">Tutar</h4>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`karDegeri-${entry.id}`} className="text-sm text-gray-600">
                            {entry.karTipi === "yuzde" ? "Kar Oranı (%)" : "Kar Tutarı (₺)"}
                          </Label>
                          <Input
                            id={`karDegeri-${entry.id}`}
                            type="number"
                            placeholder={entry.karTipi === "yuzde" ? "Örn: 15" : "Örn: 5000"}
                            value={entry.karDegeri}
                            onChange={(e) => handleProfessionChange(entry.id, "karDegeri", e.target.value)}
                            className="h-11 bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      // For Danışmanlık - Show service fee calculation
                      hizmetTuru === "danismanlik" && (
                        <div className="space-y-4">
                          {entry.hizmetBedeliHakedisUzerinden ? (
                            <div className="space-y-2">
                              <Label htmlFor={`hizmetBedeliYuzdesi-${entry.id}`} className="text-sm text-gray-600">
                                Hizmet Bedeli Yüzdesi (%) <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`hizmetBedeliYuzdesi-${entry.id}`}
                                type="number"
                                placeholder="Örn: 50"
                                value={entry.hizmetBedeliYuzdesi}
                                onChange={(e) =>
                                  handleProfessionChange(entry.id, "hizmetBedeliYuzdesi", e.target.value)
                                }
                                className="h-11 bg-white"
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor={`hizmetBedeliTutari-${entry.id}`} className="text-sm text-gray-600">
                                Hizmet Bedeli (₺) <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`hizmetBedeliTutari-${entry.id}`}
                                type="number"
                                placeholder="Hizmet bedeli giriniz"
                                value={entry.hizmetBedeliTutari}
                                onChange={(e) => handleProfessionChange(entry.id, "hizmetBedeliTutari", e.target.value)}
                                className="h-11 bg-white"
                              />
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {entry.id.startsWith("pre-") && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                        <Info className="h-4 w-4 inline-block mr-1.5" />
                        Bu meslek kodu önkayıt esnasında firma tarafından seçilmiştir.
                      </div>
                    )}

                    {/* Cost summary section - keep as is */}
                    {((hizmetTuru === "gecici-is-gucu" && entry.meslekKodu && entry.ucret) ||
                      (hizmetTuru === "danismanlik" &&
                        entry.meslekKodu &&
                        ((entry.hizmetBedeliHakedisUzerinden && entry.ucret) ||
                          (!entry.hizmetBedeliHakedisUzerinden && entry.hizmetBedeliTutari)))) && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg border">
                        <h4 className="font-medium text-sm mb-2">Maliyet Özeti</h4>
                        <div className="overflow-hidden rounded-md border">
                          <table className="w-full text-sm">
                            <tbody>
                              {(hizmetTuru === "gecici-is-gucu" ||
                                (hizmetTuru === "danismanlik" && entry.hizmetBedeliHakedisUzerinden)) && (
                                <tr className="border-b">
                                  <td className="p-2 pl-3">Personel Hakedişi</td>
                                  <td className="p-2 pr-3 text-right font-medium">
                                    {calculateCosts(entry).personelHakedisi.toLocaleString("tr-TR")}
                                  </td>
                                </tr>
                              )}

                              {hizmetTuru === "gecici-is-gucu" && (
                                <>
                                  <tr className="border-b">
                                    <td className="p-2 pl-3">SGK İşveren Payı (%22.5)</td>
                                    <td className="p-2 pr-3 text-right font-medium">
                                      {calculateCosts(entry).sgkIsverenPayi.toLocaleString("tr-TR")}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 pl-3">İşsizlik İşveren Payı (%2)</td>
                                    <td className="p-2 pr-3 text-right font-medium">
                                      {calculateCosts(entry).issizlikIsverenPayi.toLocaleString("tr-TR")}
                                    </td>
                                  </tr>
                                  <tr className="border-b bg-gray-50">
                                    <td className="p-2 pl-3 font-medium">Toplam Maliyet</td>
                                    <td className="p-2 pr-3 text-right font-medium">
                                      {calculateCosts(entry).toplamMaliyet.toLocaleString("tr-TR")}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 pl-3">
                                      {entry.karTipi === "yuzde" ? `Kar Oranı (%${entry.karDegeri})` : "Kar Tutarı"}
                                    </td>
                                    <td className="p-2 pr-3 text-right font-medium">
                                      {calculateCosts(entry).karTutari.toLocaleString("tr-TR")}
                                    </td>
                                  </tr>
                                </>
                              )}

                              {hizmetTuru === "danismanlik" && (
                                <tr className="border-b">
                                  <td className="p-2 pl-3">
                                    {entry.hizmetBedeliHakedisUzerinden
                                      ? `Hizmet Bedeli (%${entry.hizmetBedeliYuzdesi})`
                                      : "Hizmet Bedeli"}
                                  </td>
                                  <td className="p-2 pr-3 text-right font-medium">
                                    {calculateCosts(entry).hizmetBedeli.toLocaleString("tr-TR")}
                                  </td>
                                </tr>
                              )}

                              <tr className="bg-blue-50">
                                <td className="p-2 pl-3 font-medium text-blue-700">Toplam Fatura Tutarı</td>
                                <td className="p-2 pr-3 text-right font-medium text-blue-700">
                                  {calculateCosts(entry).toplamFatura.toLocaleString("tr-TR")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Total Summary for all professions */}
                {professionEntries.length > 1 && professionEntries.some((entry) => entry.meslekKodu && entry.ucret) && (
                  <div className="bg-white p-4 rounded-lg border mt-4">
                    <h4 className="font-medium text-sm mb-3">Genel Toplam</h4>
                    <div className="overflow-hidden rounded-md border">
                      <table className="w-full text-sm">
                        <tbody>
                          {hizmetTuru === "gecici-is-gucu" && (
                            <>
                              <tr className="border-b">
                                <td className="p-2 pl-3">Toplam Personel Maliyeti</td>
                                <td className="p-2 pr-3 text-right font-medium">
                                  {professionEntries
                                    .reduce((sum, entry) => sum + calculateCosts(entry).toplamMaliyet, 0)
                                    .toLocaleString("tr-TR")}
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2 pl-3">Toplam Kar Tutarı</td>
                                <td className="p-2 pr-3 text-right font-medium">
                                  {professionEntries
                                    .reduce((sum, entry) => sum + calculateCosts(entry).karTutari, 0)
                                    .toLocaleString("tr-TR")}
                                </td>
                              </tr>
                            </>
                          )}

                          {hizmetTuru === "danismanlik" && (
                            <tr className="border-b">
                              <td className="p-2 pl-3">Toplam Hizmet Bedeli</td>
                              <td className="p-2 pr-3 text-right font-medium">
                                {professionEntries
                                  .reduce((sum, entry) => sum + calculateCosts(entry).hizmetBedeli, 0)
                                  .toLocaleString("tr-TR")}
                              </td>
                            </tr>
                          )}

                          <tr className="bg-blue-50">
                            <td className="p-2 pl-3 font-medium text-blue-700">Genel Toplam</td>
                            <td className="p-2 pr-3 text-right font-medium text-blue-700">
                              {professionEntries
                                .reduce((sum, entry) => sum + calculateCosts(entry).toplamFatura, 0)
                                .toLocaleString("tr-TR")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {/* Service Type Modal */}
      {showServiceModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
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
                  @keyframes slideDown {
                    from { transform: translateY(0); }
                    to { transform: translateY(100%); }
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
                      /* Update the service selection handler in the modal: */
                      <div
                        key={tur.id}
                        className={cn(
                          "relative border rounded-lg p-2.5 flex items-center cursor-pointer transition-colors",
                          hizmetTuru === tur.id
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white hover:bg-gray-50 border-gray-200",
                        )}
                        onClick={() => {
                          setHizmetTuru(tur.id)
                          setShowServiceModal(false)
                        }}
                      >
                        <div className="mr-2.5">{getServiceIcon(tur.id)}</div>
                        <span className="text-xs font-medium flex-1">{tur.name}</span>
                        <div className="ml-1">
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
    </form>
  )
}

