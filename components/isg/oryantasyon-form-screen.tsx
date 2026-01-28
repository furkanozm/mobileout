"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Camera, FileText, ChevronRight, ChevronLeft, X, Image, Check } from "lucide-react"

interface OryantasyonFormScreenProps {
  onBack: () => void
  training?: any
}

export function OryantasyonFormScreen({ onBack, training }: OryantasyonFormScreenProps) {
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

  // Photo handling
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  // Document handling
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])
  const [showDocumentOptions, setShowDocumentOptions] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePhotoUpload = (source: "gallery" | "camera") => {
    setShowPhotoOptions(false)

    if (source === "camera") {
      setShowCamera(true)
    } else {
      // Simulate gallery selection with a placeholder
      const newPhoto = `/placeholder.svg?height=300&width=400&text=Photo${uploadedPhotos.length + 1}`
      setUploadedPhotos([...uploadedPhotos, newPhoto])
    }
  }

  const handleCameraCapture = () => {
    // Simulate taking a photo
    const newPhoto = `/placeholder.svg?height=300&width=400&text=Camera${uploadedPhotos.length + 1}`
    setUploadedPhotos([...uploadedPhotos, newPhoto])
    setShowCamera(false)
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos]
    newPhotos.splice(index, 1)
    setUploadedPhotos(newPhotos)
  }

  const handleDocumentUpload = (type: string) => {
    // Simulate document upload
    const docName = `${type.toUpperCase()}_Doküman_${uploadedDocuments.length + 1}.${type}`
    setUploadedDocuments([...uploadedDocuments, docName])
    setShowDocumentOptions(false)
  }

  const handleRemoveDocument = (index: number) => {
    const newDocs = [...uploadedDocuments]
    newDocs.splice(index, 1)
    setUploadedDocuments(newDocs)
  }

  // Mock data for dropdowns
  const companies = ["ABC Holding", "XYZ İnşaat", "123 Sanayi"]
  const projectGroups = ["İnşaat Projeleri", "Altyapı Projeleri", "Üretim Projeleri"]
  const projects = ["İstanbul Rezidans", "Ankara Metro", "Fabrika Genişletme"]
  const locations = ["Eğitim Salonu A", "Saha Ofisi", "Ana Toplantı Salonu"]
  const trainers = ["Ahmet Yılmaz", "Mehmet Kaya", "Ayşe Demir"]

  // Step bar rendering - more compact version
  const renderStepBar = () => (
    <div className="px-4 py-2 bg-gray-50 border-b">
      <div className="flex justify-between items-center">
        {[
          { num: 1, name: "Temel Bilgiler" },
          { num: 2, name: "Tarih/Saat" },
          { num: 3, name: "Ekler" },
        ].map((step, index) => {
          const isActive = currentStep === step.num
          const isCompleted = currentStep > step.num

          return (
            <div key={index} className="flex items-center">
              {/* Step circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? <Check className="h-3 w-3" /> : step.num}
              </div>

              {/* Step name */}
              <span className="text-xs ml-1 text-gray-600">{step.name}</span>

              {/* Connecting lines */}
              {index < 2 && (
                <div className={`h-[1px] w-4 mx-1 ${currentStep > step.num ? "bg-green-500" : "bg-gray-200"}`}></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Temel Bilgiler</h3>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                    Eğitim Başlığı
                  </Label>
                  <Input
                    id="title"
                    placeholder="Eğitim başlığını girin"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-900">
                    Firma
                  </Label>
                  <Select value={formData.company} onValueChange={(value) => handleChange("company", value)}>
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Firma seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectGroup" className="text-sm font-medium text-gray-900">
                    Proje Grubu
                  </Label>
                  <Select value={formData.projectGroup} onValueChange={(value) => handleChange("projectGroup", value)}>
                    <SelectTrigger id="projectGroup">
                      <SelectValue placeholder="Proje grubu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="text-sm font-medium text-gray-900">
                    Proje
                  </Label>
                  <Select value={formData.project} onValueChange={(value) => handleChange("project", value)}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Proje seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-900">
                    Eğitim Lokasyonu
                  </Label>
                  <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Lokasyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer" className="text-sm font-medium text-gray-900">
                    Eğitmen
                  </Label>
                  <Select value={formData.trainer} onValueChange={(value) => handleChange("trainer", value)}>
                    <SelectTrigger id="trainer">
                      <SelectValue placeholder="Eğitmen seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer} value={trainer}>
                          {trainer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                    Açıklama
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Eğitim hakkında açıklama girin"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Tarih ve Saat</h3>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-900">
                    Eğitim Tarihi
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-medium text-gray-900">
                      Başlangıç Saati
                    </Label>
                    <div className="relative">
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleChange("startTime", e.target.value)}
                        className="pl-10"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-sm font-medium text-gray-900">
                      Bitiş Saati
                    </Label>
                    <div className="relative">
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleChange("endTime", e.target.value)}
                        className="pl-10"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <>
            <Card className="mb-4">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-blue-600" />
                  Fotoğraflar
                </h3>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Eğitim fotoğrafı ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
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
                )}

                <Button type="button" variant="outline" className="w-full" onClick={() => setShowPhotoOptions(true)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Fotoğraf Ekle
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Dokümanlar
                </h3>

                {uploadedDocuments.length > 0 && (
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="ml-2 text-sm">{doc}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => handleRemoveDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="button" variant="outline" className="w-full" onClick={() => setShowDocumentOptions(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Doküman Ekle
                </Button>
              </CardContent>
            </Card>
          </>
        )
      default:
        return null
    }
  }

  // Photo options modal
  const renderPhotoOptionsModal = () => {
    if (!showPhotoOptions) return null

    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg w-[90%] max-w-[300px] overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Fotoğraf Ekle</h3>
          </div>
          <div className="p-2">
            <Button
              variant="outline"
              className="w-full justify-start mb-2 text-blue-600"
              onClick={() => handlePhotoUpload("gallery")}
            >
              <Image className="mr-2 h-5 w-5" />
              Galeriden Seç
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-blue-600"
              onClick={() => handlePhotoUpload("camera")}
            >
              <Camera className="mr-2 h-5 w-5" />
              Kamera ile Çek
            </Button>
          </div>
          <div className="p-2 flex justify-end border-t">
            <Button variant="ghost" className="text-red-600" onClick={() => setShowPhotoOptions(false)}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Camera simulation modal
  const renderCameraModal = () => {
    if (!showCamera) return null

    return (
      <div className="absolute inset-0 bg-black flex flex-col z-20">
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowCamera(false)}>
            <X className="h-6 w-6" />
          </Button>
          <div className="flex-1"></div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full h-3/4 bg-gray-800 flex items-center justify-center">
            <Camera className="h-16 w-16 text-gray-400 opacity-50" />
            {/* Camera preview would go here in a real app */}
          </div>
        </div>

        <div className="p-4 bg-black">
          <div className="flex justify-center">
            <Button className="rounded-full w-16 h-16 bg-white hover:bg-gray-200" onClick={handleCameraCapture} />
          </div>

          {uploadedPhotos.length > 0 && (
            <div className="mt-4 flex overflow-x-auto gap-2 pb-2">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Document options modal
  const renderDocumentOptionsModal = () => {
    if (!showDocumentOptions) return null

    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg w-[90%] max-w-[300px] overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Doküman Ekle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleDocumentUpload("pdf")}>
              <FileText className="mr-2 h-5 w-5 text-red-500" />
              PDF Dokümanı
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleDocumentUpload("word")}>
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Word Dokümanı
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleDocumentUpload("excel")}>
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              Excel Dokümanı
            </Button>
          </div>
          <div className="p-2 flex justify-end border-t">
            <Button variant="ghost" onClick={() => setShowDocumentOptions(false)}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title={isEditing ? "Oryantasyon Düzenle" : "Yeni Oryantasyon Ekle"}
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
      <div className="sticky bottom-0 w-full p-4 bg-white border-t flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" className="w-[48%]" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        ) : (
          <Button variant="outline" className="w-[48%]" onClick={onBack}>
            İptal
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button className="w-[48%] bg-blue-600 hover:bg-blue-700" onClick={nextStep}>
            İleri
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button className="w-[48%] bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
            Tamamla
          </Button>
        )}
      </div>

      {/* Modals */}
      {renderPhotoOptionsModal()}
      {renderCameraModal()}
      {renderDocumentOptionsModal()}
    </div>
  )
}

