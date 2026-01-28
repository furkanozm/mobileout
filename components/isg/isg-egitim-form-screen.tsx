"use client"
import { useState } from "react"
import type React from "react"

import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, X, Check, Calendar, Clock } from "lucide-react"
import type { Training } from "./isg-egitim-screen"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface IsgEgitimFormScreenProps {
  onBack: () => void
  training?: Training | null
}

export function IsgEgitimFormScreen({ onBack, training }: IsgEgitimFormScreenProps) {
  const { toast } = useToast()
  const isEditing = !!training

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const initialFormData = {
    title: training?.title || "",
    company: training?.company || "",
    projectGroup: training?.projectGroup || "",
    project: training?.project || "",
    location: training?.location || "",
    trainer: training?.trainer || "",
    description: training?.description || "",
    date: training?.date || "",
    startTime: training?.startTime || "",
    endTime: training?.endTime || "",
    status: "completed", // Default to completed
  }

  const [formData, setFormData] = useState(initialFormData)

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(training?.photos || [])
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>(
    Array.isArray(training?.documents) ? training.documents : [],
  )
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCameraSimulation, setShowCameraSimulation] = useState(false)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const [showDocumentOptions, setShowDocumentOptions] = useState(false)

  // Mock data for dropdowns
  const companies = ["ABC Holding", "XYZ İnşaat", "123 Sanayi", "DEF Tekstil"]
  const projectGroups = {
    "ABC Holding": ["İnşaat Projeleri", "Fabrika Projeleri", "Ofis Projeleri"],
    "XYZ İnşaat": ["Konut Projeleri", "AVM Projeleri", "Otel Projeleri"],
    "123 Sanayi": ["Üretim Projeleri", "Lojistik Projeleri"],
    "DEF Tekstil": ["Üretim Tesisleri", "Mağaza Projeleri"],
  }
  const projects = {
    "İnşaat Projeleri": ["ABC Tower", "ABC Residence", "ABC Plaza"],
    "Fabrika Projeleri": ["ABC Fabrika 1", "ABC Fabrika 2"],
    "Ofis Projeleri": ["ABC Merkez Ofis", "ABC Şube Ofis"],
    "Konut Projeleri": ["XYZ Konutları", "XYZ Evleri"],
    "AVM Projeleri": ["XYZ AVM", "XYZ Plaza"],
    "Otel Projeleri": ["XYZ Hotel", "XYZ Resort"],
    "Üretim Projeleri": ["123 Üretim Tesisi", "123 Fabrika"],
    "Lojistik Projeleri": ["123 Depo", "123 Dağıtım Merkezi"],
    "Üretim Tesisleri": ["DEF Fabrika 1", "DEF Fabrika 2"],
    "Mağaza Projeleri": ["DEF Mağaza 1", "DEF Mağaza 2"],
  }
  const isgCompanies = ["İSG Danışmanlık A.Ş.", "Güvenli Çalışma Ltd.", "İş Sağlığı Merkezi", "OSGB Firması"]
  const isgSpecialists = {
    "İSG Danışmanlık A.Ş.": ["Ahmet Yılmaz (A Sınıfı)", "Mehmet Kaya (B Sınıfı)", "Ayşe Demir (C Sınıfı)"],
    "Güvenli Çalışma Ltd.": ["Mustafa Öz (A Sınıfı)", "Zeynep Çelik (B Sınıfı)"],
    "İş Sağlığı Merkezi": ["Ali Şahin (A Sınıfı)", "Fatma Yıldız (B Sınıfı)", "Emre Can (C Sınıfı)"],
    "OSGB Firması": ["Hakan Koç (A Sınıfı)", "Selin Demir (B Sınıfı)"],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "company") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        projectGroup: "",
        project: "",
        isgCompany: "",
        isgSpecialist: "",
      }))
    } else if (name === "projectGroup") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        project: "",
        isgCompany: "",
        isgSpecialist: "",
      }))
    } else if (name === "project") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isgCompany: "",
        isgSpecialist: "",
      }))
    } else if (name === "isgCompany") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isgSpecialist: "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({ ...prev, date: date.toISOString().split("T")[0] }))
    setShowCalendar(false)
  }

  const handlePhotoUpload = (source: "gallery" | "camera") => {
    if (source === "camera") {
      setShowCameraSimulation(true)
      setShowPhotoOptions(false)
    } else {
      // Simulate gallery selection by adding a placeholder
      setUploadedPhotos((prev) => [...prev, "/placeholder.svg?height=300&width=400"])
      setShowPhotoOptions(false)
    }
  }

  const handleCameraCapture = () => {
    // Simulate taking a photo
    setUploadedPhotos((prev) => [...prev, "/placeholder.svg?height=300&width=400"])
    setShowCameraSimulation(false)
  }

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDocumentUpload = (type: string) => {
    // Simulate document upload by adding a placeholder
    const documentName = type === "pdf" ? "Doküman.pdf" : type === "word" ? "Doküman.docx" : "Doküman.xlsx"
    setUploadedDocuments((prev) => [...prev, documentName])
    setShowDocumentOptions(false)
  }

  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    console.log({
      ...formData,
      photos: uploadedPhotos,
      documents: uploadedDocuments,
      status: "completed", // Ensure it's explicitly set when submitting
    })
    onBack()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Step bar component
  const renderStepBar = () => {
    const stepTitles = ["Temel Bilgiler", "Tarih/Saat", "Ekler"]

    return (
      <div className="bg-white border-b">
        <div className="flex items-center px-4 py-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                    isActive && "bg-blue-600 text-white",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-600",
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : stepNumber}
                </div>

                {/* Step title */}
                <span
                  className={cn(
                    "ml-1 text-xs",
                    isActive && "text-blue-600 font-medium",
                    isCompleted && "text-green-500",
                    !isActive && !isCompleted && "text-gray-500",
                  )}
                >
                  {stepTitles[index]}
                </span>

                {/* Connector line */}
                {stepNumber < totalSteps && (
                  <div className={cn("h-[1px] w-4 mx-1", isCompleted ? "bg-green-500" : "bg-gray-300")} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Step 1: Basic Information
  const renderBasicInfoStep = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-900">
            Eğitim Başlığı
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Eğitim başlığını girin"
            value={formData.title}
            onChange={handleInputChange}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-900">
            Firma
          </Label>
          <select
            id="company"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.company}
            onChange={(e) => handleSelectChange("company", e.target.value)}
          >
            <option value="">Firma seçin</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {formData.company && (
          <div className="space-y-2">
            <Label htmlFor="projectGroup" className="text-gray-900">
              Proje Grubu
            </Label>
            <select
              id="projectGroup"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.projectGroup}
              onChange={(e) => handleSelectChange("projectGroup", e.target.value)}
            >
              <option value="">Proje grubu seçin</option>
              {projectGroups[formData.company as keyof typeof projectGroups]?.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.projectGroup && (
          <div className="space-y-2">
            <Label htmlFor="project" className="text-gray-900">
              Proje
            </Label>
            <select
              id="project"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.project}
              onChange={(e) => handleSelectChange("project", e.target.value)}
            >
              <option value="">Proje seçin</option>
              {projects[formData.projectGroup as keyof typeof projects]?.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="isgCompany" className="text-gray-900">
            İSG Firması
          </Label>
          <select
            id="isgCompany"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.isgCompany}
            onChange={(e) => handleSelectChange("isgCompany", e.target.value)}
          >
            <option value="">İSG firması seçin</option>
            {isgCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {formData.isgCompany && (
          <div className="space-y-2">
            <Label htmlFor="isgSpecialist" className="text-gray-900">
              İSG Uzmanı
            </Label>
            <select
              id="isgSpecialist"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.isgSpecialist}
              onChange={(e) => handleSelectChange("isgSpecialist", e.target.value)}
            >
              <option value="">İSG uzmanı seçin</option>
              {isgSpecialists[formData.isgCompany as keyof typeof isgSpecialists]?.map((specialist) => (
                <option key={specialist} value={specialist}>
                  {specialist}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )
  }

  // Step 2: Date and Time
  const renderDateTimeStep = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-gray-900">
            Tarih
          </Label>
          <div className="relative">
            <div
              className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span>{formatDate(formData.date)}</span>
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            {showCalendar && (
              <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-200 rounded-md shadow-lg">
                {/* Simple calendar UI */}
                <div className="grid grid-cols-7 gap-1">
                  {["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1
                    const date = new Date()
                    date.setDate(day)
                    return (
                      <div
                        key={day}
                        className="text-center py-1 text-sm cursor-pointer hover:bg-blue-50 rounded"
                        onClick={() => handleDateSelect(date)}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-gray-900">
              Başlangıç Saati
            </Label>
            <div className="relative">
              <div className="flex items-center w-full">
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
                <Clock className="absolute right-2 h-5 w-5 text-blue-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-gray-900">
              Bitiş Saati
            </Label>
            <div className="relative">
              <div className="flex items-center w-full">
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
                <Clock className="absolute right-2 h-5 w-5 text-blue-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-900">
            Eğitim Yeri
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="Eğitim yerini girin"
            value={formData.location}
            onChange={handleInputChange}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainer" className="text-gray-900">
            Eğitmen
          </Label>
          <Input
            id="trainer"
            name="trainer"
            placeholder="Eğitmen adını girin"
            value={formData.trainer}
            onChange={handleInputChange}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-900">
            Açıklama
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Eğitim açıklaması girin"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
          />
        </div>
      </div>
    )
  }

  // Step 3: Photos and Documents
  const renderAttachmentsStep = () => {
    return (
      <div className="space-y-6">
        {/* Photos Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-gray-900 text-lg font-medium">Fotoğraflar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600"
              onClick={() => setShowPhotoOptions(true)}
            >
              Fotoğraf Ekle
            </Button>
          </div>

          {uploadedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden aspect-video">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Fotoğraf ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
              Henüz fotoğraf eklenmedi
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-gray-900 text-lg font-medium">Dokümanlar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600"
              onClick={() => setShowDocumentOptions(true)}
            >
              Doküman Ekle
            </Button>
          </div>

          {uploadedDocuments.length > 0 ? (
            <div className="space-y-2 mt-2">
              {uploadedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <span className="text-gray-900">{doc}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
              Henüz doküman eklenmedi
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep()
      case 2:
        return renderDateTimeStep()
      case 3:
        return renderAttachmentsStep()
      default:
        return null
    }
  }

  // Photo Options Modal
  const PhotoOptionsModal = () => {
    if (!showPhotoOptions) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg w-full max-w-xs">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-center">Fotoğraf Ekle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handlePhotoUpload("gallery")}
            >
              Galeriden Seç
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handlePhotoUpload("camera")}
            >
              Kamera ile Çek
            </Button>
          </div>
          <div className="p-3 border-t">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-red-500"
              onClick={() => setShowPhotoOptions(false)}
            >
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Document Options Modal
  const DocumentOptionsModal = () => {
    if (!showDocumentOptions) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg w-full max-w-xs">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-center">Doküman Ekle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDocumentUpload("pdf")}
            >
              PDF Dokümanı
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDocumentUpload("word")}
            >
              Word Dokümanı
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDocumentUpload("excel")}
            >
              Excel Dokümanı
            </Button>
          </div>
          <div className="p-3 border-t">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-red-500"
              onClick={() => setShowDocumentOptions(false)}
            >
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Camera Simulation Modal
  const CameraSimulationModal = () => {
    if (!showCameraSimulation) return null

    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        <div className="flex justify-between items-center p-4 text-white">
          <Button
            type="button"
            variant="ghost"
            className="text-white p-0 h-auto"
            onClick={() => setShowCameraSimulation(false)}
          >
            İptal
          </Button>
          <Button type="button" variant="ghost" className="text-white p-0 h-auto" onClick={handleCameraCapture}>
            Çek
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full h-full max-h-[60vh] bg-gray-800 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="border-2 border-white/50 rounded-lg w-64 h-48 mx-auto mb-2 flex items-center justify-center">
                <span>Kamera Önizleme</span>
              </div>
            </div>
          </div>
        </div>

        {uploadedPhotos.length > 0 && (
          <div className="bg-black p-4">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title={isEditing ? "ISG Eğitimi Düzenle" : "Yeni ISG Eğitimi Ekle"}
        onBackClick={onBack}
        rightContent={
          <div className="flex items-center">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">Tamamlandı</span>
          </div>
        }
      />

      {renderStepBar()}

      <ScrollArea className="flex-1 px-4 pb-0">
        <div className="py-4 min-h-[calc(100vh-180px)]">{renderStepContent()}</div>
      </ScrollArea>

      {/* Navigation Buttons */}
      <div className="absolute bottom-16 left-0 right-0 p-4 bg-white border-t flex justify-between">
        {currentStep === 1 ? (
          <Button type="button" variant="outline" className="w-[48%]" onClick={onBack}>
            İptal
          </Button>
        ) : (
          <Button type="button" variant="outline" className="w-[48%]" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        )}

        <Button type="button" variant="default" className="w-[48%]" onClick={nextStep}>
          {currentStep === totalSteps ? "Tamamla" : "İleri"}
          {currentStep !== totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>

      {/* Modals */}
      <PhotoOptionsModal />
      <DocumentOptionsModal />
      <CameraSimulationModal />
    </div>
  )
}

