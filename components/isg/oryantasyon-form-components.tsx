"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Camera, FileText, X, Image, File } from "lucide-react"

// Basic Info Section
export function BasicInfoSection({
  formData,
  handleInputChange,
  handleSelectChange,
  companies,
  projectGroups,
  projects,
  locations,
  trainers,
}) {
  const availableProjects = formData.projectGroup ? projects[formData.projectGroup] || [] : []

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium">Temel Bilgiler</h3>

        <div className="space-y-3">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Eğitim Başlığı
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Eğitim başlığını girin"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Firma
            </label>
            <Select
              id="company"
              name="company"
              value={formData.company}
              onValueChange={(value) => handleSelectChange("company", value)}
              options={companies.map((company) => ({ label: company, value: company }))}
              placeholder="Firma seçin"
            />
          </div>

          <div>
            <label htmlFor="projectGroup" className="block text-sm font-medium mb-1">
              Proje Grubu
            </label>
            <Select
              id="projectGroup"
              name="projectGroup"
              value={formData.projectGroup}
              onValueChange={(value) => handleSelectChange("projectGroup", value)}
              options={projectGroups.map((group) => ({ label: group, value: group }))}
              placeholder="Proje grubu seçin"
            />
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium mb-1">
              Proje
            </label>
            <Select
              id="project"
              name="project"
              value={formData.project}
              onValueChange={(value) => handleSelectChange("project", value)}
              options={availableProjects.map((project) => ({ label: project, value: project }))}
              placeholder="Proje seçin"
              disabled={!formData.projectGroup}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Eğitim Lokasyonu
            </label>
            <Select
              id="location"
              name="location"
              value={formData.location}
              onValueChange={(value) => handleSelectChange("location", value)}
              options={locations.map((location) => ({ label: location, value: location }))}
              placeholder="Lokasyon seçin"
            />
          </div>

          <div>
            <label htmlFor="trainer" className="block text-sm font-medium mb-1">
              Eğitmen
            </label>
            <Select
              id="trainer"
              name="trainer"
              value={formData.trainer}
              onValueChange={(value) => handleSelectChange("trainer", value)}
              options={trainers.map((trainer) => ({ label: trainer, value: trainer }))}
              placeholder="Eğitmen seçin"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Açıklama
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Eğitim hakkında açıklama girin"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Date and Time Section
export function DateTimeSection({
  formData,
  handleInputChange,
  handleDateSelect,
  showCalendar,
  setShowCalendar,
  formatDate,
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium">Tarih ve Saat</h3>

        <div className="space-y-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Eğitim Tarihi
            </label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.date ? formatDate(formData.date) : "Tarih seçin"}
              </Button>
              {showCalendar && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg p-2">
                  {/* Simple date picker UI */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const date = new Date()
                          date.setDate(day)
                          handleDateSelect(date)
                        }}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                Başlangıç Saati
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                Bitiş Saati
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Photos Section
export function PhotosSection({ uploadedPhotos, handleRemovePhoto, setShowPhotoOptions }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium flex items-center">
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
  )
}

// Documents Section
export function DocumentsSection({ uploadedDocuments, handleRemoveDocument, setShowDocumentOptions }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium flex items-center">
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
  )
}

// Photo Options Modal
interface PhotoOptionsModalProps {
  onClose: () => void
  onPhotoUpload: (source: "gallery" | "camera") => void
}

export function PhotoOptionsModal({ onClose, onPhotoUpload }: PhotoOptionsModalProps) {
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
            onClick={() => onPhotoUpload("gallery")}
          >
            <Image className="mr-2 h-5 w-5" />
            Galeriden Seç
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-blue-600"
            onClick={() => onPhotoUpload("camera")}
          >
            <Camera className="mr-2 h-5 w-5" />
            Kamera ile Çek
          </Button>
        </div>
        <div className="p-2 flex justify-end border-t">
          <Button variant="ghost" className="text-red-600" onClick={onClose}>
            İptal
          </Button>
        </div>
      </div>
    </div>
  )
}

// Document Options Modal
export function DocumentOptionsModal({ onClose, onDocumentUpload }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Doküman Ekle</h3>
        </div>
        <div className="p-4 space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("pdf")}>
            <File className="mr-2 h-5 w-5 text-red-500" />
            PDF Dokümanı
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("word")}>
            <File className="mr-2 h-5 w-5 text-blue-500" />
            Word Dokümanı
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("excel")}>
            <File className="mr-2 h-5 w-5 text-green-500" />
            Excel Dokümanı
          </Button>
        </div>
        <div className="p-3 border-t bg-gray-50 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            İptal
          </Button>
        </div>
      </div>
    </div>
  )
}

// Camera Simulation Modal
interface CameraSimulationModalProps {
  onClose: () => void
  onCapture: () => void
  uploadedPhotos: string[]
}

export function CameraSimulationModal({ onClose, onCapture, uploadedPhotos }: CameraSimulationModalProps) {
  return (
    <div className="absolute inset-0 bg-black flex flex-col z-20">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
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
          <Button className="rounded-full w-16 h-16 bg-white hover:bg-gray-200" onClick={onCapture} />
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

