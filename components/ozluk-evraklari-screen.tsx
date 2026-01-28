"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Menu, Globe, DownloadCloud, CheckCircle2, Plus, X, FileText, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentList } from "./ozluk-evraklari/document-list"
import { FilterSidebar } from "./ozluk-evraklari/filter-sidebar"
import type { Evrak } from "./ozluk-evraklari/types"
import { HizliOnayFlow } from "./ozluk-evraklari/hizli-onay-flow"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Mock data for selected documents
const mockSelectedDocuments: Evrak[] = [
  {
    id: "1",
    personelAdi: "Ahmet Yılmaz",
    tckn: "12345678901",
    firma: "TechCorp A.Ş.",
    projeGrubu: "Yazılım Geliştirme",
    proje: "Web Uygulaması",
    evrakTuru: "İş Sözleşmesi",
    dosyaTuru: "pdf",
    durum: "onaylandı",
    tarih: "01.03.2022",
  },
  {
    id: "2",
    personelAdi: "Mehmet Kaya",
    tckn: "12345678902",
    firma: "TechCorp A.Ş.",
    projeGrubu: "Yazılım Geliştirme",
    proje: "Mobil Uygulama",
    evrakTuru: "Sağlık Raporu",
    dosyaTuru: "pdf",
    durum: "beklemede",
    tarih: "15.03.2022",
  },
  {
    id: "3",
    personelAdi: "Ayşe Demir",
    tckn: "12345678903",
    firma: "InnoSoft Ltd.",
    projeGrubu: "Tasarım",
    proje: "UI/UX Tasarımı",
    evrakTuru: "İş Sözleşmesi",
    dosyaTuru: "pdf",
    durum: "onaylandı",
    tarih: "15.06.2020",
  },
  {
    id: "4",
    personelAdi: "Fatma Şahin",
    tckn: "12345678904",
    firma: "InnoSoft Ltd.",
    projeGrubu: "Tasarım",
    proje: "Logo Tasarımı",
    evrakTuru: "İstifa Dilekçesi",
    dosyaTuru: "pdf",
    durum: "onaylandı",
    tarih: "15.02.2022",
  },
  {
    id: "5",
    personelAdi: "Ali Yıldız",
    tckn: "12345678905",
    firma: "DataSys Bilişim",
    projeGrubu: "Veri Analizi",
    proje: "Veri Madenciliği",
    evrakTuru: "İş Sözleşmesi",
    dosyaTuru: "pdf",
    durum: "onaylandı",
    tarih: "01.09.2018",
  },
  {
    id: "6",
    personelAdi: "Zeynep Çelik",
    tckn: "12345678906",
    firma: "DataSys Bilişim",
    projeGrubu: "Veri Analizi",
    proje: "Veri Görselleştirme",
    evrakTuru: "İşten Ayrılış Belgesi",
    dosyaTuru: "pdf",
    durum: "onaylandı",
    tarih: "31.05.2020",
  },
]

interface FilterState {
  evrakTuru: string
  startDate: string
  endDate: string
  durum: string
}

interface OzlukEvraklariScreenProps {
  onNavigate?: (route: string) => void
  onSelectedDocsChange?: (count: number) => void
}

export function OzlukEvraklariScreen({ onNavigate, onSelectedDocsChange }: OzlukEvraklariScreenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedDocsCount, setSelectedDocsCount] = useState(0)
  const [showDownloadPreview, setShowDownloadPreview] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    evrakTuru: "",
    startDate: "",
    endDate: "",
    durum: "tumu",
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showAddDocumentSheet, setShowAddDocumentSheet] = useState(false)
  const [step, setStep] = useState<"select" | "upload" | "review">("select")
  const [documentType, setDocumentType] = useState<string>("")
  const [validityDate, setValidityDate] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedProjectGroup, setSelectedProjectGroup] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [hizliOnayEnabled, setHizliOnayEnabled] = useState(false)

  const documentTypes = [
    "İş Sözleşmesi",
    "Kimlik Fotokopisi",
    "İkametgah",
    "Sağlık Raporu",
    "Diploma",
    "Sertifika",
    "Gizlilik Sözleşmesi",
    "Adli Sicil Kaydı",
    "İstifa Dilekçesi",
    "İşten Ayrılış Belgesi",
  ]

  const personnelList = ["Ahmet Yılmaz", "Mehmet Kaya", "Ayşe Demir", "Fatma Şahin", "Ali Yıldız", "Zeynep Çelik"]

  const companyList = ["TechCorp A.Ş.", "InnoSoft Ltd.", "DataSys Bilişim", "Global Tech", "Yazılım Evi"]

  const projectGroupList = {
    "TechCorp A.Ş.": ["Yazılım Geliştirme", "Mobil Uygulama", "Veri Analizi"],
    "InnoSoft Ltd.": ["Tasarım", "Web Geliştirme", "Pazarlama"],
    "DataSys Bilişim": ["Veri Analizi", "Bulut Çözümleri", "Siber Güvenlik"],
    "Global Tech": ["IoT Çözümleri", "Yapay Zeka", "Blockchain"],
    "Yazılım Evi": ["Frontend Geliştirme", "Backend Geliştirme", "Mobil Uygulama"],
  }

  const projectList = {
    "Yazılım Geliştirme": ["Web Uygulaması", "CRM Sistemi", "ERP Modülü"],
    "Mobil Uygulama": ["iOS Uygulaması", "Android Uygulaması", "Cross-platform Uygulama"],
    "Veri Analizi": ["Veri Madenciliği", "Veri Görselleştirme", "Tahminleme Modeli"],
    Tasarım: ["UI/UX Tasarımı", "Logo Tasarımı", "Marka Kimliği"],
    "Web Geliştirme": ["E-ticaret Sitesi", "Kurumsal Web Sitesi", "Web Portal"],
    Pazarlama: ["Dijital Pazarlama", "İçerik Üretimi", "SEO Optimizasyonu"],
    "Bulut Çözümleri": ["AWS Migrasyonu", "Azure Entegrasyonu", "Bulut Altyapı"],
    "Siber Güvenlik": ["Güvenlik Denetimi", "Penetrasyon Testi", "Güvenlik Duvarı"],
    "IoT Çözümleri": ["Sensör Ağı", "IoT Platform", "Akıllı Ev Sistemleri"],
    "Yapay Zeka": ["Makine Öğrenmesi", "Doğal Dil İşleme", "Görüntü Tanıma"],
    Blockchain: ["Akıllı Kontrat", "Kripto Para", "Blok Zinciri Altyapısı"],
    "Frontend Geliştirme": ["React Uygulaması", "Vue Uygulaması", "Angular Uygulaması"],
    "Backend Geliştirme": ["Node.js API", "Django Uygulaması", "Spring Boot Servisi"],
  }

  const personnelByCompany = {
    "TechCorp A.Ş.": ["Ahmet Yılmaz", "Mehmet Kaya"],
    "InnoSoft Ltd.": ["Ayşe Demir", "Fatma Şahin"],
    "DataSys Bilişim": ["Ali Yıldız", "Zeynep Çelik"],
    "Global Tech": ["Mustafa Öztürk", "Elif Yıldırım"],
    "Yazılım Evi": ["Emre Kaya", "Selin Demir"],
  }

  const handleSelectedDocsChange = (count: number) => {
    setSelectedDocsCount(count)
    if (onSelectedDocsChange) {
      onSelectedDocsChange(count)
    }
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleDownloadClick = () => {
    setShowDownloadPreview(true)
  }

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      setShowDownloadPreview(false)

      // Show success popup
      setShowSuccessPopup(true)

      // Hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false)
      }, 3000)

      console.log("Documents downloaded successfully")
    }, 1500)
  }

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessPopup])

  const handleAddDocument = () => {
    setShowAddDocumentModal(true)
  }

  const handleContinue = () => {
    if (step === "select") {
      if (!selectedCompany || !selectedProjectGroup || !selectedProject || !documentType || !selectedPersonnel) {
        alert("Lütfen tüm alanları doldurun")
        return
      }
      if (!validityDate) {
        alert("Lütfen geçerlilik tarihi seçin")
        return
      }
      setStep("upload")
    } else if (step === "upload") {
      setStep("review")
    } else {
      // Submit the document
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        handleCloseAddDocument()
        alert("Belge başarıyla yüklendi ve onaya gönderildi")
      }, 1500)
    }
  }

  const handleBack = () => {
    if (step === "upload") {
      setStep("select")
    } else if (step === "review") {
      setStep("upload")
    }
  }

  const handleOpenCamera = () => {
    setShowCamera(true)
    // Simulate taking a photo
    setTimeout(() => {
      setShowCamera(false)
    }, 2000)
  }

  const handleCloseAddDocument = () => {
    setShowAddDocumentSheet(false)
    setStep("select")
    setDocumentType("")
    setValidityDate("")
    setSelectedCompany("")
    setSelectedProjectGroup("")
    setSelectedProject("")
    setSelectedPersonnel("")
  }

  const getFilteredPersonnel = () => {
    if (!selectedCompany) return []
    return personnelByCompany[selectedCompany] || []
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <header className="flex items-center px-4 h-14 border-b bg-white">
        <div className="flex-1 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-600">OutsourceHub</span>
          </div>
        </div>
      </header>

      {/* Hızlı Onay Switch */}
      <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="hizli-onay" className="font-medium">
            Hızlı Onay Modu
          </Label>
          <Switch id="hizli-onay" checked={hizliOnayEnabled} onCheckedChange={setHizliOnayEnabled} />
        </div>
        <Badge
          variant={hizliOnayEnabled ? "success" : "secondary"}
          className={
            hizliOnayEnabled
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {hizliOnayEnabled ? "Aktif" : "Pasif"}
        </Badge>
      </div>

      {/* Success Toast Notification */}
      <div
        className={`absolute top-16 left-0 right-0 mx-auto w-[90%] z-50 transition-all duration-300 ease-in-out ${
          showSuccessPopup ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">{selectedDocsCount} evrak başarıyla indirildi</p>
        </div>
      </div>

      {/* Ana İçerik - Hızlı Onay veya Normal Mod */}
      <div className="flex-1 flex flex-col">
        {hizliOnayEnabled ? (
          <HizliOnayFlow
            onClose={() => setHizliOnayEnabled(false)}
            onComplete={() => {
              setHizliOnayEnabled(false)
              // Burada onay tamamlandığında yapılacak işlemleri ekleyebilirsiniz
              setShowSuccessPopup(true)
              setTimeout(() => setShowSuccessPopup(false), 3000)
            }}
          />
        ) : (
          <DocumentList onSelectedDocsChange={handleSelectedDocsChange} />
        )}
      </div>

      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {selectedDocsCount > 0 && !hizliOnayEnabled && (
        <div className="absolute bottom-24 right-4 z-10">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={handleDownloadClick}
          >
            <DownloadCloud className="h-6 w-6 text-white" />
            {selectedDocsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selectedDocsCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Download Preview Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-white z-20 transition-transform duration-300 ease-in-out rounded-t-2xl shadow-lg ${
          showDownloadPreview ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowDownloadPreview(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">İndirilecek Evraklar</h2>
          </div>
          <div className="bg-gray-100 px-2.5 py-1 rounded-full text-sm font-medium">{selectedDocsCount} evrak</div>
        </div>

        {/* Document List */}
        <div className="overflow-auto" style={{ maxHeight: "calc(80vh - 130px)" }}>
          <div className="p-4 space-y-3">
            {mockSelectedDocuments.slice(0, selectedDocsCount).map((doc, index) => (
              <div
                key={doc.id}
                className={`flex items-center p-3 border rounded-lg ${
                  index % 2 === 0 ? "bg-blue-50 border-blue-100" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-blue-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="font-medium text-sm truncate">{doc.evrakTuru}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {doc.personelAdi} • {doc.firma}
                    </p>
                  </div>
                </div>
                <div
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    doc.durum === "onaylandı"
                      ? "bg-green-100 text-green-800"
                      : doc.durum === "reddedildi"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doc.durum === "onaylandı" ? "Onaylandı" : doc.durum === "reddedildi" ? "Reddedildi" : "Beklemede"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <Button className="w-full" size="lg" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                İndiriliyor...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                İndir
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Overlay when download preview is shown */}
      {showDownloadPreview && (
        <div className="absolute inset-0 bg-black/30 z-10" onClick={() => setShowDownloadPreview(false)} />
      )}

      {/* Add Document Button - Positioned within mobile frame */}
      {!hizliOnayEnabled && (
        <div className="absolute bottom-24 right-4 z-10">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={() => setShowAddDocumentSheet(true)}
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Add Document Modal - iOS Style (contained within phone frame) */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-white z-30 transition-transform duration-300 ease-in-out rounded-t-2xl shadow-lg ${
          showAddDocumentSheet ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              {step === "select" ? "Evrak Ekle" : step === "upload" ? "Evrak Yükle" : "Evrak Önizleme"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCloseAddDocument}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 130px)" }}>
            {step === "select" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Firma</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCompany}
                    onChange={(e) => {
                      setSelectedCompany(e.target.value)
                      setSelectedProjectGroup("")
                      setSelectedProject("")
                      setSelectedPersonnel("")
                    }}
                  >
                    <option value="">Seçiniz</option>
                    {companyList.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCompany && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proje Grubu</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedProjectGroup}
                      onChange={(e) => {
                        setSelectedProjectGroup(e.target.value)
                        setSelectedProject("")
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {projectGroupList[selectedCompany]?.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedProjectGroup && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proje</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      {projectList[selectedProjectGroup]?.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCompany && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Personel</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedPersonnel}
                      onChange={(e) => setSelectedPersonnel(e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      {getFilteredPersonnel().map((person) => (
                        <option key={person} value={person}>
                          {person}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Evrak Türü</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Geçerlilik Tarihi</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="indefinite"
                      className="mr-2"
                      onChange={() => setValidityDate(validityDate ? "" : "Süresiz")}
                      checked={validityDate === "Süresiz"}
                    />
                    <label htmlFor="indefinite" className="text-sm">
                      Süresiz
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {showCamera ? (
                    <div className="space-y-4">
                      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white">Kamera Açık</span>
                      </div>
                      <div className="animate-pulse">Fotoğraf çekiliyor...</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Belgeyi yüklemek için sürükleyip bırakın veya aşağıdaki seçenekleri kullanın
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button onClick={handleOpenCamera} className="w-full">
                          <Camera className="h-4 w-4 mr-2" />
                          Kamerayı Aç
                        </Button>
                        <Button variant="outline" className="w-full">
                          Galeriden Seç
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Dosya Seç
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <p>
                    Firma: <span className="font-medium">{selectedCompany}</span>
                  </p>
                  <p>
                    Proje Grubu: <span className="font-medium">{selectedProjectGroup}</span>
                  </p>
                  <p>
                    Proje: <span className="font-medium">{selectedProject}</span>
                  </p>
                  <p>
                    Personel: <span className="font-medium">{selectedPersonnel}</span>
                  </p>
                  <p>
                    Seçilen Evrak: <span className="font-medium">{documentType}</span>
                  </p>
                  <p>
                    Geçerlilik: <span className="font-medium">{validityDate}</span>
                  </p>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <img
                      src="/placeholder.svg?height=400&width=300"
                      alt="Document Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Firma:</span> {selectedCompany}
                    </p>
                    <p>
                      <span className="font-medium">Proje Grubu:</span> {selectedProjectGroup}
                    </p>
                    <p>
                      <span className="font-medium">Proje:</span> {selectedProject}
                    </p>
                    <p>
                      <span className="font-medium">Personel:</span> {selectedPersonnel}
                    </p>
                    <p>
                      <span className="font-medium">Evrak Türü:</span> {documentType}
                    </p>
                    <p>
                      <span className="font-medium">Geçerlilik Tarihi:</span> {validityDate}
                    </p>
                    <p>
                      <span className="font-medium">Durum:</span> <span className="text-amber-600">Onay Bekliyor</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2 mt-auto">
            {step !== "select" && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Geri
              </Button>
            )}
            <Button onClick={handleContinue} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Yükleniyor...
                </span>
              ) : step === "select" ? (
                "Devam Et"
              ) : step === "upload" ? (
                "Önizle"
              ) : (
                "Onaya Gönder"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay when add document modal is shown */}
      {showAddDocumentSheet && (
        <div className="absolute inset-0 bg-black/30 z-20" onClick={() => setShowAddDocumentSheet(false)} />
      )}
    </div>
  )
}

