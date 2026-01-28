"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Camera, FileText, X, Image, ChevronDown, File } from "lucide-react"

// Basic Info Section
interface BasicInfoSectionProps {
  formData: {
    title: string
    company: string
    projectGroup: string
    project: string
    isgCompany: string
    isgSpecialist: string
    [key: string]: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (name: string, value: string) => void
  companies: string[]
  projectGroups: Record<string, string[]>
  projects: Record<string, string[]>
  isgCompanies: string[]
  isgSpecialists: Record<string, string[]>
}

export function BasicInfoSection({
  formData,
  handleInputChange,
  handleSelectChange,
  companies,
  projectGroups,
  projects,
  isgCompanies,
  isgSpecialists,
}: BasicInfoSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Eğitim Başlığı</Label>
          <Input
            id="title"
            name="title"
            placeholder="Eğitim başlığını girin"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Firma</Label>
          <Select value={formData.company} onValueChange={(value) => handleSelectChange("company", value)}>
            <SelectTrigger>
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

        {formData.company && (
          <div className="space-y-2">
            <Label htmlFor="projectGroup">Proje Grubu</Label>
            <Select value={formData.projectGroup} onValueChange={(value) => handleSelectChange("projectGroup", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Proje grubu seçin" />
              </SelectTrigger>
              <SelectContent>
                {projectGroups[formData.company]?.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.projectGroup && (
          <div className="space-y-2">
            <Label htmlFor="project">Proje</Label>
            <Select value={formData.project} onValueChange={(value) => handleSelectChange("project", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Proje seçin" />
              </SelectTrigger>
              <SelectContent>
                {projects[formData.projectGroup]?.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.project && (
          <div className="space-y-2">
            <Label htmlFor="isgCompany">İSG Firması</Label>
            <Select value={formData.isgCompany} onValueChange={(value) => handleSelectChange("isgCompany", value)}>
              <SelectTrigger>
                <SelectValue placeholder="İSG firması seçin" />
              </SelectTrigger>
              <SelectContent>
                {isgCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.isgCompany && (
          <div className="space-y-2">
            <Label htmlFor="isgSpecialist">İSG Uzmanı</Label>
            <Select
              value={formData.isgSpecialist}
              onValueChange={(value) => handleSelectChange("isgSpecialist", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="İSG uzmanı seçin" />
              </SelectTrigger>
              <SelectContent>
                {isgSpecialists[formData.isgCompany]?.map((specialist) => (
                  <SelectItem key={specialist} value={specialist}>
                    {specialist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Date Time Section
interface DateTimeSectionProps {
  formData: {
    date: string
    startTime: string
    endTime: string
    [key: string]: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDateSelect: (date: Date) => void
  showCalendar: boolean
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>
  formatDate: (dateString: string) => string
}

export function DateTimeSection({
  formData,
  handleInputChange,
  handleDateSelect,
  showCalendar,
  setShowCalendar,
  formatDate,
}: DateTimeSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Tarih</Label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                {formatDate(formData.date)}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>

            {showCalendar && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg p-2">
                <div className="calendar-placeholder h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-10 w-10 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm text-gray-500">Takvim bileşeni burada gösterilecek</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowCalendar(false)}>
                        İptal
                      </Button>
                      <Button size="sm" onClick={() => handleDateSelect(new Date())}>
                        Bugün
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Başlangıç Saati</Label>
            <div className="relative">
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="pl-9"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">Bitiş Saati</Label>
            <div className="relative">
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="pl-9"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Photos Section
interface PhotosSectionProps {
  uploadedPhotos: string[]
  handleRemovePhoto: (index: number) => void
  setShowPhotoOptions: React.Dispatch<React.SetStateAction<boolean>>
}

export function PhotosSection({ uploadedPhotos, handleRemovePhoto, setShowPhotoOptions }: PhotosSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium flex items-center">
          <Camera className="mr-2 h-5 w-5 text-blue-600" />
          Fotoğraflar
        </h3>

        {uploadedPhotos.length > 0 ? (
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
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-md">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Henüz fotoğraf eklenmemiş</p>
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
interface DocumentsSectionProps {
  uploadedDocuments: string[]
  handleRemoveDocument: (index: number) => void
  setShowDocumentOptions: React.Dispatch<React.SetStateAction<boolean>>
}

export function DocumentsSection({
  uploadedDocuments,
  handleRemoveDocument,
  setShowDocumentOptions,
}: DocumentsSectionProps) {
  const getDocumentIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (fileName.endsWith(".docx")) return <FileText className="h-5 w-5 text-blue-500" />
    if (fileName.endsWith(".xlsx")) return <FileText className="h-5 w-5 text-green-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Dokümanlar
        </h3>

        {uploadedDocuments.length > 0 ? (
          <div className="space-y-2">
            {uploadedDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center">
                  {getDocumentIcon(doc)}
                  <span className="ml-2 text-sm">{doc}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveDocument(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-md">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Henüz doküman eklenmemiş</p>
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
    <div className="absolute inset-x-0 bottom-0 top-auto z-50 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-t-xl p-6 space-y-4 shadow-xl min-h-[50vh] transform transition-transform duration-300 ease-out"
        style={{
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
          animation: "slideUp 0.3s ease-out forwards",
        }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <h3 className="font-medium text-center mb-3 text-lg">Fotoğraf Ekle</h3>
        <Button variant="outline" className="w-full justify-start" onClick={() => onPhotoUpload("gallery")}>
          <Image className="mr-2 h-5 w-5" />
          Galeriden Seç
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onPhotoUpload("camera")}>
          <Camera className="mr-2 h-5 w-5" />
          Kamera ile Çek
        </Button>
        <Button variant="outline" className="w-full border border-gray-300" onClick={onClose}>
          İptal
        </Button>
      </div>
    </div>
  )
}

// Document Options Modal
interface DocumentOptionsModalProps {
  onClose: () => void
  onDocumentUpload: (type: string) => void
}

export function DocumentOptionsModal({ onClose, onDocumentUpload }: DocumentOptionsModalProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-auto z-50">
      <div className="bg-white rounded-t-xl p-4 space-y-3 shadow-lg">
        <h3 className="font-medium text-center mb-2">Doküman Ekle</h3>
        <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("pdf")}>
          <FileText className="mr-2 h-5 w-5 text-red-500" />
          PDF Dokümanı
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("word")}>
          <FileText className="mr-2 h-5 w-5 text-blue-500" />
          Word Dokümanı
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onDocumentUpload("excel")}>
          <FileText className="mr-2 h-5 w-5 text-green-500" />
          Excel Dokümanı
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          İptal
        </Button>
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
    <div className="absolute inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
          <img
            src="/placeholder.svg?height=800&width=600"
            alt="Camera preview"
            className="max-h-full max-w-full object-contain"
          />

          {/* Camera controls overlay */}
          <div className="absolute inset-x-0 bottom-10 flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-white"
              onClick={onCapture}
            >
              <div className="h-14 w-14 rounded-full bg-white"></div>
            </Button>
          </div>

          {/* Right side controls */}
          <div className="absolute right-4 inset-y-0 flex flex-col justify-center gap-6">
            {/* Camera flip button */}
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black bg-opacity-50 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-camera-rotate"
              >
                <path d="M12.5 3h5a2 2 0 0 1 2 2v5"></path>
                <path d="M20.755 12.444a9 9 0 1 1-2.199-8.889"></path>
                <path d="m22 4-4 4"></path>
                <path d="m22 10-4-2"></path>
                <path d="m16 10-4-2"></path>
              </svg>
            </Button>

            {/* Gallery preview */}
            <div className="h-12 w-12 rounded-md overflow-hidden border-2 border-white">
              {uploadedPhotos.length > 0 ? (
                <img
                  src={uploadedPhotos[uploadedPhotos.length - 1] || "/placeholder.svg"}
                  alt="Last photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

