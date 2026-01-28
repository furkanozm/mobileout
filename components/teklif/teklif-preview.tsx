"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
  Truck,
  Info,
  CheckCircle,
  Send,
  Download,
  Maximize,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { IOSAlert } from "../ui/ios-alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface TeklifPreviewProps {
  onNext: () => void
  onBack: () => void
  onComplete: () => void
  formData: any
}

const MESLEK_KODLARI = [
  { id: "121101", name: "Maden Mühendisi" },
  { id: "214603", name: "Makine Mühendisi" },
  { id: "214102", name: "Endüstri Mühendisi" },
  { id: "214402", name: "Elektrik Mühendisi" },
  { id: "214401", name: "Elektronik Mühendisi" },
  { id: "214302", name: "Bilgisayar Mühendisi" },
  { id: "216604", name: "İnşaat Mühendisi" },
  { id: "242402", name: "Sistem Analisti" },
  { id: "251102", name: "Sistem Yöneticisi" },
  { id: "251401", name: "Yazılım Mühendisi" },
  { id: "251201", name: "Yazılımcı" },
  { id: "243406", name: "Veri Analisti" },
  { id: "213102", name: "Kimya Mühendisi" },
  { id: "215102", name: "Grafik Tasarımcısı" },
  { id: "311501", name: "Elektrik Teknisyeni" },
  { id: "311503", name: "Elektronik Teknisyeni" },
  { id: "311205", name: "Makine Teknikeri" },
  { id: "311201", name: "Makine Teknisyeni" },
  { id: "311803", name: "İnşaat Teknikeri" },
  { id: "311801", name: "İnşaat Teknisyeni" },
  { id: "351401", name: "Satış Temsilcisi" },
  { id: "334301", name: "Muhasebeci" },
  { id: "431101", name: "Büro Memuru" },
  { id: "422101", name: "Müşteri Temsilcisi" },
  { id: "522301", name: "Depo Görevlisi" },
  { id: "723302", name: "Kaynakçı" },
  { id: "721203", name: "Metal İşleme Ustası" },
  { id: "815402", name: "Paketleme İşçisi" },
  { id: "932903", name: "Temizlik Görevlisi" },
  { id: "911201", name: "Tarım İşçisi" },
  { id: "962902", name: "Diğer Vasıfsız İşçiler" },
]

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

export function TeklifPreview({ onBack, onComplete, formData }: TeklifPreviewProps) {
  const router = useRouter()
  const [showCompleteAlert, setShowCompleteAlert] = useState(false)
  const [showSendMethodAlert, setShowSendMethodAlert] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [generatePdf, setGeneratePdf] = useState(true)
  const [selectedMethods, setSelectedMethods] = useState<Array<"email" | "sms">>([])
  const [attachPdf, setAttachPdf] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showDahilHizmetlerInfo, setShowDahilHizmetlerInfo] = useState(false)
  const [showAyriHizmetlerInfo, setShowAyriHizmetlerInfo] = useState(false)

  // Handle modal animation
  useEffect(() => {
    if (showPdfPreview) {
      // Small delay to ensure the modal is in the DOM before animating
      setTimeout(() => setModalVisible(true), 10)
    } else {
      setModalVisible(false)
      // Reset fullscreen when closing
      setIsFullscreen(false)
    }
  }, [showPdfPreview])

  // Örnek veri - gerçek veriler yoksa örnek veriyi kullan
  const sampleData = {
    professionEntries: [
      {
        id: "1",
        meslekKodu: "251401",
        meslekAdi: "Yazılım Mühendisi",
        ucretTipi: "ay",
        netBrut: "net",
        ucret: "25000",
        karTipi: "yuzde",
        karDegeri: "15",
        personelHakedisi: 25000,
        sgkIsverenPayi: 5625,
        issizlikIsverenPayi: 500,
        toplamMaliyet: 31125,
        karTutari: 4668.75,
        toplamFatura: 35793.75,
      },
      {
        id: "2",
        meslekKodu: "214302",
        meslekAdi: "Bilgisayar Mühendisi",
        ucretTipi: "ay",
        netBrut: "brut",
        ucret: "30000",
        karTipi: "yuzde",
        karDegeri: "12",
        personelHakedisi: 30000,
        sgkIsverenPayi: 6750,
        issizlikIsverenPayi: 600,
        toplamMaliyet: 37350,
        karTutari: 4482,
        toplamFatura: 41832,
      },
    ],
    ekHizmetler: [
      {
        id: "1",
        tur: "konaklama",
        ad: "Otel Konaklaması",
        aciklama: "Proje süresince 3 yıldızlı otelde konaklama",
        birim: "ay",
        tutar: "5000",
        includedInTotal: true,
        tip: "sabit",
        dahilMi: true,
        hizmetAdi: "Otel Konaklaması",
        fiyat: 5000,
      },
      {
        id: "2",
        tur: "ulasim",
        ad: "Şehirlerarası Ulaşım",
        aciklama: "Aylık 2 kez şehirlerarası ulaşım",
        birim: "ay",
        tutar: "2500",
        includedInTotal: true,
        tip: "sabit",
        dahilMi: true,
        hizmetAdi: "Şehirlerarası Ulaşım",
        fiyat: 2500,
      },
      {
        id: "3",
        tur: "yemek",
        ad: "Yemek Kartı",
        aciklama: "Günlük yemek kartı desteği",
        birim: "ay",
        tutar: "1800",
        includedInTotal: false,
        tip: "sabit",
        dahilMi: false,
        hizmetAdi: "Yemek Kartı",
        fiyat: 1800,
      },
      {
        id: "4",
        tur: "egitim",
        ad: "Sertifika Programı",
        aciklama: "Proje özelinde sertifika programı",
        birim: "adet",
        tutar: "7500",
        includedInTotal: false,
        tip: "sabit",
        dahilMi: false,
        hizmetAdi: "Sertifika Programı",
        fiyat: 7500,
      },
      {
        id: "5",
        tur: "ulasim",
        ad: "Personel Servisi",
        aciklama: "Kişi başı günlük servis ücreti",
        birim: "gun",
        tutar: "150",
        includedInTotal: false,
        tip: "kisi_basi_gun",
        dahilMi: false,
        hizmetAdi: "Personel Servisi",
        fiyat: 150,
      },
    ],
    hizmetTuru: "gecici-is-gucu",
    baslangicTarihi: "2025-04-01",
    bitisTarihi: "2026-03-31",
    firmaAdi: "Teknoloji A.Ş.",
    firmaSehir: "İstanbul",
    teklifTarihi: "2025-03-15",
    gecerlilikTarihi: "2025-04-15",
    teklifNo: "TK-2025-1234",
    sozlesmeTuru: "gecici_is_iliskisi",
    karOrani: 15,
    projeBaslangicTarihi: "2025-04-01",
    projeBitisTarihi: "2026-03-31",
    hazirlayan: "Seda Sel",
    durum: "beklemede",
  }

  // Eğer formData'da ilgili alanlar yoksa örnek veriyi kullan
  const effectiveData = {
    professionEntries: formData.professionEntries?.length ? formData.professionEntries : sampleData.professionEntries,
    ekHizmetler: formData.ekHizmetler?.length ? formData.ekHizmetler : sampleData.ekHizmetler,
    hizmetTuru: formData.hizmetTuru || sampleData.hizmetTuru,
    baslangicTarihi: formData.baslangicTarihi || sampleData.baslangicTarihi,
    bitisTarihi: formData.bitisTarihi || sampleData.bitisTarihi,
    firmaAdi: formData.firmaAdi || sampleData.firmaAdi,
    firmaSehir: formData.firmaSehir || sampleData.firmaSehir,
    teklifTarihi: formData.teklifTarihi || sampleData.teklifTarihi,
    gecerlilikTarihi: formData.gecerlilikTarihi || sampleData.gecerlilikTarihi,
    teklifNo: formData.teklifNo || sampleData.teklifNo,
    sozlesmeTuru: formData.sozlesmeTuru || sampleData.sozlesmeTuru,
    karOrani: formData.karOrani || sampleData.karOrani,
    projeBaslangicTarihi: formData.projeBaslangicTarihi || sampleData.projeBaslangicTarihi,
    projeBitisTarihi: formData.projeBitisTarihi || sampleData.projeBitisTarihi,
    hazirlayan: formData.hazirlayan || sampleData.hazirlayan,
    durum: formData.durum || sampleData.durum,
  }

  const handleCompleteClick = () => {
    setShowCompleteAlert(true)
  }

  const handleConfirmComplete = () => {
    setShowCompleteAlert(false)
    setShowSendMethodAlert(true)
  }

  const toggleSendMethod = (method: "email" | "sms") => {
    setSelectedMethods((prev) => {
      if (prev.includes(method)) {
        return prev.filter((m) => m !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  const handleSendConfirm = () => {
    setShowSendMethodAlert(false)
    setShowSuccessAlert(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccessAlert(false)
    // Navigate to teklif list view using the onComplete callback
    onComplete()
  }

  // Prepare data for display
  const kisiBasisEkHizmetler =
    effectiveData.ekHizmetler.filter((h: any) => h.tip === "kisi_basi_gun" || h.birim === "gun") || []
  const sabitEkHizmetler = effectiveData.ekHizmetler.filter((h: any) => h.tip === "sabit" || h.birim === "ay") || []

  const dahilSabitHizmetler = sabitEkHizmetler.filter((h: any) => h.dahilMi || h.includedInTotal)
  const ayriSabitHizmetler = sabitEkHizmetler.filter((h: any) => !h.dahilMi && !h.includedInTotal)

  const totalDahilSabitHizmet = dahilSabitHizmetler.reduce(
    (sum: number, h: any) => sum + (h.fiyat || Number(h.tutar) || 0),
    0,
  )
  const totalBirimMaliyet = effectiveData.professionEntries.reduce(
    (sum: number, entry: any) => sum + (entry.toplamMaliyet || 0),
    0,
  )
  const karTutari = (totalBirimMaliyet * effectiveData.karOrani) / 100
  const genelToplam = totalBirimMaliyet + karTutari + totalDahilSabitHizmet

  // Format currency helper
  const formatCurrency = (value: number) => {
    return value.toLocaleString("tr-TR") + " ₺"
  }

  // Meslek adını alma fonksiyonu
  const getMeslekAdi = (entry: any) => {
    // Önce entry içinde meslekAdi varsa onu kullan
    if (entry.meslekAdi) {
      return entry.meslekAdi
    }

    // Yoksa MESLEK_KODLARI listesinden bul
    const selectedProfession = MESLEK_KODLARI.find((kod) => kod.id === entry.meslekKodu)
    if (selectedProfession) {
      return selectedProfession.name
    }

    // Hiçbir şekilde bulunamazsa meslek kodunu göster
    return `Meslek Kodu: ${entry.meslekKodu}`
  }

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">{effectiveData.firmaAdi}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{effectiveData.firmaSehir}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Teklif Bilgileri</p>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        <p>Teklif No: {effectiveData.teklifNo}</p>
                        <p>Teklif Tarihi: {new Date(effectiveData.teklifTarihi).toLocaleDateString("tr-TR")}</p>
                        <p>Geçerlilik: {new Date(effectiveData.gecerlilikTarihi).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Sözleşme Türü</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {effectiveData.sozlesmeTuru === "gecici_is_iliskisi" ? "Geçici İş İlişkisi" : "Danışmanlık"}
                      </p>
                    </div>
                  </div>

                  {effectiveData.projeBaslangicTarihi && effectiveData.projeBitisTarihi && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Proje Süresi</p>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                          <p>Başlangıç: {new Date(effectiveData.projeBaslangicTarihi).toLocaleDateString("tr-TR")}</p>
                          <p>Bitiş: {new Date(effectiveData.projeBitisTarihi).toLocaleDateString("tr-TR")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    size="icon"
                    onClick={() => setShowPdfPreview(true)}
                    className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {effectiveData.professionEntries && effectiveData.professionEntries.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Personel Detayları</h3>
                <div className="space-y-4">
                  {effectiveData.professionEntries.map((entry: any) => {
                    const meslekAdi = getMeslekAdi(entry)
                    return (
                      <div key={entry.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{meslekAdi}</p>
                            <p className="text-sm text-muted-foreground">{entry.meslekKodu}</p>
                          </div>
                          <Badge variant="outline">1 Kişi</Badge>
                        </div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Birim Maliyet:</span>
                            <span className="font-medium">{formatCurrency(entry.toplamMaliyet)}</span>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-md p-2 text-xs text-blue-700">
                            Bu meslek kodu önkayıt esnasında firma tarafından seçilmiştir.
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {effectiveData.professionEntries.length > 1 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Toplam Birim Maliyet:</span>
                        <span className="font-medium">{formatCurrency(totalBirimMaliyet)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {effectiveData.ekHizmetler && effectiveData.ekHizmetler.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Ek Hizmetler</h3>
                </div>

                {dahilSabitHizmetler.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-blue-600">Toplam Tutara Dahil Edilen Hizmetler</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDahilHizmetlerInfo(true)
                        }}
                        className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    {dahilSabitHizmetler.map((hizmet: any) => (
                      <div key={hizmet.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">{hizmet.hizmetAdi || hizmet.ad}</span>
                          {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                        </div>
                        <span className="font-medium">{formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}/ay</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Toplam:</span>
                        <span className="font-medium">{formatCurrency(totalDahilSabitHizmet)}/ay</span>
                      </div>
                    </div>
                  </div>
                )}

                {(ayriSabitHizmetler.length > 0 || kisiBasisEkHizmetler.length > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-amber-600">Ayrı Faturalandırılacak Hizmetler</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAyriHizmetlerInfo(true)
                        }}
                        className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>

                    {ayriSabitHizmetler.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <h5 className="text-xs font-medium text-muted-foreground">Sabit Hizmetler</h5>
                        {ayriSabitHizmetler.map((hizmet: any) => (
                          <div key={hizmet.id} className="flex justify-between items-center">
                            <div>
                              <span className="text-sm">{hizmet.hizmetAdi || hizmet.ad}</span>
                              {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                            </div>
                            <span className="font-medium">
                              {formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}/ay
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {kisiBasisEkHizmetler.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-medium text-muted-foreground">Kişi Başı Günlük Hizmetler</h5>
                        {kisiBasisEkHizmetler.map((hizmet: any) => (
                          <div key={hizmet.id} className="flex justify-between items-center">
                            <div>
                              <span className="text-sm">{hizmet.hizmetAdi || hizmet.ad}</span>
                              {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                            </div>
                            <span className="font-medium">
                              {formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}/gün
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Geçerlilik Süresi</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(effectiveData.gecerlilikTarihi).toLocaleDateString("tr-TR")} tarihine kadar geçerlidir
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div className="w-full">
                    <p className="font-medium">Maliyet Bilgileri</p>
                    <div className="mt-2 space-y-2">
                      {/* Personel Maliyetleri */}
                      {effectiveData.professionEntries && effectiveData.professionEntries.length > 0 && (
                        <div className="space-y-2 pb-2">
                          {effectiveData.professionEntries.map((entry: any) => {
                            const meslekAdi = getMeslekAdi(entry)
                            return (
                              <div key={entry.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {entry.meslekKodu} | {meslekAdi}:
                                </span>
                                <span className="font-medium">{formatCurrency(entry.toplamMaliyet)}</span>
                              </div>
                            )
                          })}
                          <div className="flex justify-between text-sm pt-1 border-t">
                            <span className="text-muted-foreground">Aylık Olası Toplam Maliyet:</span>
                            <span className="font-medium">{formatCurrency(totalBirimMaliyet)}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kâr Oranı:</span>
                        <span className="font-medium">%{effectiveData.karOrani}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kâr Tutarı:</span>
                        <span className="font-medium">{formatCurrency(karTutari)}</span>
                      </div>

                      {/* Toplam Tutara Dahil Edilen Hizmetler */}
                      {dahilSabitHizmetler.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium">Toplam Tutara Dahil Edilen Hizmetler:</p>
                          {dahilSabitHizmetler.map((hizmet: any) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{hizmet.hizmetAdi || hizmet.ad}:</span>
                              <span className="font-medium">
                                {formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Toplam Dahil Edilen Hizmetler:</span>
                            <span className="font-medium">{formatCurrency(totalDahilSabitHizmet)}</span>
                          </div>
                        </div>
                      )}

                      {/* Ayrı Faturalandırılacak Hizmetler */}
                      {(ayriSabitHizmetler.length > 0 || kisiBasisEkHizmetler.length > 0) && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium">Ayrı Faturalandırılacak Hizmetler:</p>
                          {ayriSabitHizmetler.map((hizmet: any) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{hizmet.hizmetAdi || hizmet.ad} (Sabit):</span>
                              <span className="font-medium">
                                {formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}/ay
                              </span>
                            </div>
                          ))}
                          {kisiBasisEkHizmetler.map((hizmet: any) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {hizmet.hizmetAdi || hizmet.ad} (Kişi Başı):
                              </span>
                              <span className="font-medium">
                                {formatCurrency(hizmet.fiyat || Number(hizmet.tutar))}/gün
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Genel Toplam */}
                      <div className="flex justify-between text-sm pt-2 border-t mt-2">
                        <span className="font-medium">Genel Toplam:</span>
                        <span className="font-medium">{formatCurrency(genelToplam)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teklifi Hazırlayan */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Teklifi Hazırlayan</h3>
              <p className="font-medium">{effectiveData.hazirlayan || "Seda Sel"}</p>
              <p className="text-sm text-gray-500">İşe Alım Yöneticisi</p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Bottom Bar */}
      <div className="p-4 bg-white border-t mt-auto">
        <Button onClick={handleCompleteClick} className="w-full h-12 text-sm bg-blue-600 hover:bg-blue-700">
          Tamamla
        </Button>
      </div>

      {/* Alerts */}
      <IOSAlert
        isOpen={showCompleteAlert}
        onClose={() => setShowCompleteAlert(false)}
        onConfirm={handleConfirmComplete}
        title="Teklifi Tamamla"
        message={
          <div className="space-y-3 py-2">
            <p>Teklif süreci tamamlanacak ve teklif kaydedilecektir. Devam etmek istiyor musunuz?</p>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="generatePdf"
                checked={generatePdf}
                onCheckedChange={(checked) => setGeneratePdf(checked === true)}
              />
              <Label htmlFor="generatePdf" className="text-sm flex items-center">
                <FileText className="h-4 w-4 mr-1.5 text-blue-600" />
                PDF dosyası oluştur
              </Label>
            </div>
          </div>
        }
        confirmText="Tamamla"
        cancelText="İptal"
      />

      <IOSAlert
        isOpen={showSendMethodAlert}
        onClose={() => setShowSendMethodAlert(false)}
        onConfirm={handleSendConfirm}
        title="Teklifi Gönder"
        message={
          <div className="space-y-4 py-2">
            <p>Teklifi göndermek istediğiniz yöntemi seçin:</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => toggleSendMethod("email")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedMethods.includes("email") ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } cursor-pointer`}
              >
                <Send
                  className={`h-5 w-5 mb-1 ${selectedMethods.includes("email") ? "text-blue-500" : "text-gray-500"}`}
                />
                <span
                  className={`text-sm font-medium ${selectedMethods.includes("email") ? "text-blue-700" : "text-gray-700"}`}
                >
                  E-posta
                </span>
              </div>
              <div
                onClick={() => toggleSendMethod("sms")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedMethods.includes("sms") ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } cursor-pointer`}
              >
                <Send
                  className={`h-5 w-5 mb-1 ${selectedMethods.includes("sms") ? "text-blue-500" : "text-gray-500"}`}
                />
                <span
                  className={`text-sm font-medium ${selectedMethods.includes("sms") ? "text-blue-700" : "text-gray-700"}`}
                >
                  SMS
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="attachPdf"
                  checked={attachPdf}
                  onCheckedChange={(checked) => setAttachPdf(checked === true)}
                />
                <Label htmlFor="attachPdf" className="text-sm">
                  PDF dosyası ekle
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={includeDetails}
                  onCheckedChange={(checked) => setIncludeDetails(checked === true)}
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  Detaylı maliyet bilgilerini dahil et
                </Label>
              </div>
            </div>
          </div>
        }
        confirmText={selectedMethods.length > 0 ? "Gönder" : "İptal"}
        cancelText="İptal"
        confirmDisabled={selectedMethods.length === 0}
      />

      <IOSAlert
        isOpen={showSuccessAlert}
        onClose={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
        title="İşlem Başarılı"
        message={
          <div className="flex flex-col items-center py-3">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-center">
              Teklif başarıyla kaydedildi
              {selectedMethods.length > 0 && (
                <>
                  {" "}
                  ve{" "}
                  {selectedMethods.includes("email") && selectedMethods.includes("sms")
                    ? "e-posta ve SMS"
                    : selectedMethods.includes("email")
                      ? "e-posta"
                      : "SMS"}{" "}
                  olarak gönderildi
                </>
              )}
              .
            </p>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <p className="font-medium mb-1">Bilgilendirme</p>
              <p>
                Onaylanan teklif için sistem otomatik olarak sözleşme ve protokol oluşturacaktır. İlgili dokümanlar
                "Sözleşmeler" bölümünde görüntülenebilir.
              </p>
            </div>
          </div>
        }
        confirmText="Tamam"
      />
      <IOSAlert
        isOpen={showDahilHizmetlerInfo}
        onClose={() => setShowDahilHizmetlerInfo(false)}
        onConfirm={() => setShowDahilHizmetlerInfo(false)}
        title="Toplam Tutara Dahil Edilen Hizmetler"
        message={
          <div className="py-2 space-y-2">
            <p className="text-sm">
              Bu hizmetler, ana sözleşme kapsamında sunulan ve toplam fatura tutarına dahil edilen ek hizmetlerdir. Ayrı
              bir fatura düzenlenmez ve genel toplam içerisinde yer alırlar.
            </p>
            <div className="bg-blue-50 p-2 rounded-md text-xs text-blue-700">
              Örneğin: Proje kapsamında sağlanan konaklama, yemek veya ulaşım hizmetleri gibi sabit maliyetler.
            </div>
          </div>
        }
        confirmText="Anladım"
        cancelText={null}
      />

      <IOSAlert
        isOpen={showAyriHizmetlerInfo}
        onClose={() => setShowAyriHizmetlerInfo(false)}
        onConfirm={() => setShowAyriHizmetlerInfo(false)}
        title="Ayrı Faturalandırılacak Hizmetler"
        message={
          <div className="py-2 space-y-2">
            <p className="text-sm">
              Bu hizmetler, ana sözleşme dışında ayrıca faturalandırılacak olan ek hizmetlerdir. Genel toplama dahil
              edilmezler ve kullanıldıkça ayrı fatura düzenlenir.
            </p>
            <div className="bg-amber-50 p-2 rounded-md text-xs text-amber-700">
              Örneğin: Talep üzerine sağlanan eğitimler, ekstra personel servisi veya isteğe bağlı ek hizmetler.
            </div>
          </div>
        }
        confirmText="Anladım"
        cancelText={null}
      />

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div
          className="absolute inset-0 bg-black/50 z-[100] flex items-end justify-center"
          onClick={() => setShowPdfPreview(false)}
          style={{ bottom: "8px" }} // Account for home indicator
        >
          <div
            className={`bg-white rounded-t-2xl w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out ${
              modalVisible ? "translate-y-0 animate-slide-up" : "translate-y-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle at the top of the modal */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2"></div>

            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base font-semibold">Teklif Önizleme</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => setShowPdfPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className={`relative ${isFullscreen ? "fixed inset-0 z-[110] bg-white pt-12" : "h-[60vh]"}`}>
              {isFullscreen && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 bg-white/80 shadow-sm"
                    onClick={() => setIsFullscreen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 overflow-auto p-3">
                {/* PDF Preview Placeholder */}
                <div className="relative w-full max-w-md mx-auto">
                  {!isFullscreen && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <div className="bg-white/80 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <Maximize className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Büyütmek için tıklayın</span>
                      </div>
                    </div>
                  )}

                  <img
                    src="/placeholder.svg?height=842&width=595"
                    alt="PDF Önizleme"
                    className="w-full shadow-md border border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

