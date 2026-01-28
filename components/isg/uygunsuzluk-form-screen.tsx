"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge-extended"
import { Check, ChevronRight, Camera, X, Image, File, Plus, AlertTriangle, Calendar, Clock } from "lucide-react"

interface UygunsuzlukFormScreenProps {
  onBack: () => void
}

export function UygunsuzlukFormScreen({ onBack }: UygunsuzlukFormScreenProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showCameraView, setShowCameraView] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    projectGroup: "",
    project: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    severity: "medium",
    responsiblePerson: "",
    correctiveActions: "",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "completed",
  })

  // Project options based on selected project group
  const getProjectOptions = () => {
    switch (formData.projectGroup) {
      case "İnşaat":
        return [
          { value: "İnşaat Projesi A", label: "İnşaat Projesi A" },
          { value: "İnşaat Projesi B", label: "İnşaat Projesi B" },
          { value: "İnşaat Projesi C", label: "İnşaat Projesi C" },
        ]
      case "Üretim":
        return [
          { value: "Üretim Projesi A", label: "Üretim Projesi A" },
          { value: "Üretim Projesi B", label: "Üretim Projesi B" },
        ]
      case "Ofis":
        return [
          { value: "Ofis Projesi A", label: "Ofis Projesi A" },
          { value: "Ofis Projesi B", label: "Ofis Projesi B" },
        ]
      default:
        return []
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      // If changing project group, reset project selection
      if (field === "projectGroup") {
        return { ...prev, [field]: value, project: "" }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      onBack()
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", { ...formData, photos, documents })
    onBack()
  }

  const handleAddPhoto = (source: "camera" | "gallery") => {
    setShowPhotoModal(false)

    if (source === "camera") {
      setShowCameraView(true)
    } else {
      // Simulate adding a photo from gallery
      const newPhoto = `/placeholder.svg?height=300&width=400&text=Galeri+Fotoğrafı+${photos.length + 1}`
      setPhotos((prev) => [...prev, newPhoto])
    }
  }

  const handleCameraCapture = () => {
    // Simulate taking a photo
    const newPhoto = `/placeholder.svg?height=300&width=400&text=Kamera+Fotoğrafı+${photos.length + 1}`
    setPhotos((prev) => [...prev, newPhoto])
    setShowCameraView(false)
  }

  const handleAddDocument = (type: string) => {
    // Simulate adding a document
    const newDocument = `${type}_${documents.length + 1}.pdf`
    setDocuments((prev) => [...prev, newDocument])
    setShowDocumentModal(false)
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const renderStepBar = () => {
    return (
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 1 ? "bg-blue-600" : "bg-gray-300"}`}
            >
              {currentStep > 1 ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <span className="text-xs text-white">1</span>
              )}
            </div>
            <span className="text-xs ml-1 mr-2">Temel Bilgiler</span>
            <div className={`w-8 h-0.5 ${currentStep > 1 ? "bg-blue-600" : "bg-gray-300"}`}></div>
          </div>

          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}
            >
              {currentStep > 2 ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <span className="text-xs text-white">2</span>
              )}
            </div>
            <span className="text-xs ml-1 mr-2">Detaylar</span>
            <div className={`w-8 h-0.5 ${currentStep > 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
          </div>

          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span className="text-xs text-white">3</span>
            </div>
            <span className="text-xs ml-1">Ekler</span>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Uygunsuzluk Başlığı</label>
              <Input
                placeholder="Uygunsuzluk başlığını girin"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Firma</label>
              <select
                className="border rounded-md px-3 py-2 w-full bg-white"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              >
                <option value="" disabled>
                  Firma seçin
                </option>
                <option value="Firma A">Firma A</option>
                <option value="Firma B">Firma B</option>
                <option value="Firma C">Firma C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Proje Grubu</label>
              <select
                className="border rounded-md px-3 py-2 w-full bg-white"
                value={formData.projectGroup}
                onChange={(e) => handleInputChange("projectGroup", e.target.value)}
              >
                <option value="" disabled>
                  Proje grubu seçin
                </option>
                <option value="İnşaat">İnşaat</option>
                <option value="Üretim">Üretim</option>
                <option value="Ofis">Ofis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Proje</label>
              <select
                className="border rounded-md px-3 py-2 w-full bg-white"
                value={formData.project}
                onChange={(e) => handleInputChange("project", e.target.value)}
                disabled={!formData.projectGroup}
              >
                <option value="" disabled>
                  Proje seçin
                </option>
                {getProjectOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Lokasyon</label>
              <Input
                placeholder="Lokasyon bilgisi girin"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Tarih</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Saat</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Uygunsuzluk Detayları</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Açıklama</label>
              <Textarea
                placeholder="Uygunsuzluk detaylarını açıklayın"
                className="min-h-[100px] border rounded-md px-3 py-2 w-full"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Öncelik Seviyesi</label>
              <select
                value={formData.severity}
                onChange={(e) => handleInputChange("severity", e.target.value)}
                className="border rounded-md px-3 py-2 w-full bg-white"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Sorumlu Kişi</label>
              <Input
                placeholder="Sorumlu kişi adını girin"
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange("responsiblePerson", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Düzeltici Faaliyetler</label>
              <Textarea
                placeholder="Düzeltici faaliyetleri açıklayın"
                className="min-h-[100px] border rounded-md px-3 py-2 w-full"
                value={formData.correctiveActions}
                onChange={(e) => handleInputChange("correctiveActions", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Tamamlanma Tarihi</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Ekler</h2>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Fotoğraflar</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Fotoğraf Ekle
                </Button>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Fotoğraf ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                  Henüz fotoğraf eklenmedi
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Dokümanlar</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600"
                  onClick={() => setShowDocumentModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Doküman Ekle
                </Button>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <button className="text-red-500" onClick={() => handleRemoveDocument(index)}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                  Henüz doküman eklenmedi
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderNavButtons = () => {
    return (
      <div className="flex justify-between p-4 border-t bg-white">
        <Button variant="outline" onClick={handleBack}>
          {currentStep === 1 ? "İptal" : "Geri"}
        </Button>

        <Button onClick={currentStep < 3 ? handleNext : handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          {currentStep < 3 ? (
            <>
              İleri
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            "Tamamla"
          )}
        </Button>
      </div>
    )
  }

  // Photo selection modal
  const renderPhotoModal = () => {
    if (!showPhotoModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg w-full max-w-xs">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Fotoğraf Ekle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddPhoto("camera")}>
              <Camera className="mr-2 h-5 w-5 text-blue-600" />
              Kamera
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddPhoto("gallery")}>
              <Image className="mr-2 h-5 w-5 text-blue-600" />
              Galeri
            </Button>
          </div>
          <div className="p-3 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setShowPhotoModal(false)}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Camera view
  const renderCameraView = () => {
    if (!showCameraView) return null

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" className="text-white" onClick={() => setShowCameraView(false)}>
            <X className="h-6 w-6" />
          </Button>
          <h3 className="text-white font-medium">Fotoğraf Çek</h3>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 bg-gray-800 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md max-h-96 bg-gray-900 flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-gray-400" />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {photos.map((photo, index) => (
                <div key={index} className="w-12 h-12 rounded overflow-hidden border border-white">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-center">
          <Button className="rounded-full w-16 h-16 bg-white" onClick={handleCameraCapture}>
            <div className="rounded-full w-14 h-14 border-2 border-gray-300"></div>
          </Button>
        </div>
      </div>
    )
  }

  // Document selection modal
  const renderDocumentModal = () => {
    if (!showDocumentModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg w-full max-w-xs">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Doküman Ekle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddDocument("Rapor")}>
              <File className="mr-2 h-5 w-5 text-blue-600" />
              Rapor
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleAddDocument("Tutanak")}>
              <File className="mr-2 h-5 w-5 text-blue-600" />
              Tutanak
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddDocument("Kontrol_Listesi")}
            >
              <File className="mr-2 h-5 w-5 text-blue-600" />
              Kontrol Listesi
            </Button>
          </div>
          <div className="p-3 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setShowDocumentModal(false)}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="Yeni Uygunsuzluk Kaydı"
        onBackClick={handleBack}
        rightContent={currentStep === 3 && <Badge variant="success">Tamamlandı</Badge>}
      />

      {renderStepBar()}

      <ScrollArea className="flex-1 px-4 pb-0">
        <div className="py-4 min-h-[calc(100vh-180px)]">{renderStepContent()}</div>
      </ScrollArea>

      {renderNavButtons()}
      {renderPhotoModal()}
      {renderCameraView()}
      {renderDocumentModal()}
    </div>
  )
}

