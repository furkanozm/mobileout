"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  FileText,
  User,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Camera,
  Upload,
  Plus,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { IOSAlert } from "@/components/ui/ios-alert"
import { Textarea } from "@/components/ui/textarea"

interface KazaDetailScreenProps {
  id: number
  onBack: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  isNew?: boolean
}

export function KazaDetailScreen({ id, onBack, onEdit, onDelete, isNew = false }: KazaDetailScreenProps) {
  const { toast } = useToast()
  // Mock data for the accident
  const accident = {
    id,
    title: "Kayma Kazası",
    date: "10 Nisan 2024",
    time: "14:30",
    location: "Üretim Alanı - Kat 2",
    severity: "medium",
    status: "investigated", // This will be overridden for new records
    description:
      "Islak zeminde kayma sonucu hafif yaralanma. Çalışan sağ ayak bileğinde burkulma yaşadı. İlk müdahale işyeri hekimi tarafından yapıldı. İş göremezlik raporu 3 gün olarak verildi.",
    reportedBy: "Ahmet Yılmaz",
    witnesses: ["Mehmet Demir", "Ayşe Kaya"],
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    documents: 2,
  }

  // Set initial status based on whether it's a new record
  const [currentStatus, setCurrentStatus] = useState(isNew ? "open" : accident.status)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [actionPhotos, setActionPhotos] = useState<string[]>([])
  const [actionDescription, setActionDescription] = useState("")
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const [showCameraSimulation, setShowCameraSimulation] = useState(false)

  // Set default status to "open" for new records
  useEffect(() => {
    if (isNew) {
      setCurrentStatus("open")
    }
  }, [isNew])

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "action-taken" && currentStatus !== "action-taken") {
      // If changing to "action-taken", directly show the photo upload modal
      setCurrentStatus(newStatus)
      setShowPhotoOptions(true)
      toast({
        title: "Durum güncellendi",
        description: `Kaza durumu "${getStatusText(newStatus)}" olarak güncellendi.`,
      })
    } else {
      // For other status changes, show confirmation
      setPendingStatus(newStatus)
      setShowStatusConfirm(true)
    }
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setCurrentStatus(pendingStatus)
      toast({
        title: "Durum güncellendi",
        description: `Kaza durumu "${getStatusText(pendingStatus)}" olarak güncellendi.`,
      })
      setShowStatusConfirm(false)
      setPendingStatus(null)
    }
  }

  const cancelStatusChange = () => {
    setShowStatusConfirm(false)
    setPendingStatus(null)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete(id)
    setShowDeleteConfirm(false)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleAddActionPhoto = () => {
    setShowPhotoOptions(true)
  }

  const handlePhotoUpload = (source: "gallery" | "camera") => {
    if (source === "camera") {
      setShowCameraSimulation(true)
      setShowPhotoOptions(false)
    } else {
      // Simulate gallery selection
      setActionPhotos([...actionPhotos, "/placeholder.svg?height=300&width=400"])
      setShowPhotoOptions(false)
    }
  }

  const handleCameraCapture = () => {
    // Simulate taking a photo
    setActionPhotos([...actionPhotos, "/placeholder.svg?height=300&width=400"])
    setShowCameraSimulation(false)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Yüksek Şiddet</Badge>
      case "medium":
        return <Badge variant="warning">Orta Şiddet</Badge>
      case "low":
        return <Badge variant="outline">Düşük Şiddet</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Açık"
      case "investigated":
        return "İncelendi"
      case "action-taken":
        return "Önlem Alındı"
      case "closed":
        return "Kapatıldı"
      default:
        return "Açık" // Default to "Açık" if status is undefined
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="Kaza Detayı"
        onBackClick={onBack}
        rightContent={
          <div className="flex space-x-2">
            <select
              className="text-sm rounded border-gray-200"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="open">Açık</option>
              <option value="investigated">İncelendi</option>
              <option value="action-taken">Önlem Alındı</option>
              <option value="closed">Kapatıldı</option>
            </select>
          </div>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="py-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{accident.title}</h2>
            {getSeverityBadge(accident.severity)}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-red-600" />
                <span>{accident.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-red-600" />
                <span>{accident.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-red-600" />
                <span>{accident.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-red-600" />
                <span>Bildiren: {accident.reportedBy}</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-red-600" />
                <span>Durum: {getStatusText(currentStatus)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
              <p className="text-gray-700">{accident.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tanıklar</h3>
              {accident.witnesses && accident.witnesses.length > 0 ? (
                <div className="space-y-2">
                  {accident.witnesses.map((witness, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border">
                      <User className="h-5 w-5 mr-2 text-gray-600" />
                      <span>{witness}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Tanık bulunmamaktadır.</p>
              )}
            </div>

            {/* Alınan Önlemler Section - Only visible when status is "action-taken" */}
            {currentStatus === "action-taken" && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Alınan Önlemler
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-800">Önlem Açıklaması</label>
                    <Textarea
                      placeholder="Alınan önlemleri detaylı olarak açıklayınız..."
                      value={actionDescription}
                      onChange={(e) => setActionDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-green-800">Önlem Fotoğrafları</label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-green-600 text-green-600 hover:bg-green-50"
                        onClick={handleAddActionPhoto}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Fotoğraf Ekle
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {actionPhotos.map((photo, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Önlem fotoğrafı ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Dokümanlar</h3>
              <div className="space-y-2">
                {accident.documents > 0 ? (
                  Array.from({ length: accident.documents }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-red-600" />
                        <span>Doküman {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        İndir
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Doküman bulunmamaktadır.</p>
                )}
              </div>
            </div>

            {accident.photos && accident.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Fotoğraflar</h3>
                <div className="grid grid-cols-2 gap-2">
                  {accident.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Kaza fotoğrafı ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-between">
        <Button variant="outline" className="w-[48%]" onClick={() => onEdit(id)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
        <Button variant="destructive" className="w-[48%]" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Sil
        </Button>
      </div>

      {/* Status Change Confirmation Dialog - iOS Style */}
      {showStatusConfirm && (
        <IOSAlert
          isOpen={showStatusConfirm}
          onClose={cancelStatusChange}
          onConfirm={confirmStatusChange}
          title="Durum Değişikliği"
          message={
            <div className="py-2">
              Kaza durumunu <span className="font-semibold">"{getStatusText(pendingStatus || "")}"</span> olarak
              değiştirmek istediğinize emin misiniz?
              {pendingStatus === "action-taken" && (
                <div className="mt-2 text-left text-xs bg-yellow-50 p-2 rounded">
                  <p className="font-medium text-yellow-800">Not:</p>
                  <p className="text-yellow-700">
                    Önlem alındı durumuna geçtiğinizde, alınan önlemleri ve fotoğrafları eklemeniz gerekecektir.
                  </p>
                </div>
              )}
            </div>
          }
          confirmText="Onayla"
          confirmVariant="default"
          cancelText="İptal"
          showCancel={true}
        />
      )}

      {/* Delete Confirmation Dialog - iOS Style */}
      {showDeleteConfirm && (
        <IOSAlert
          isOpen={showDeleteConfirm}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Kaza Kaydını Sil"
          message="Bu kaza kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
          confirmText="Sil"
          confirmVariant="destructive"
          cancelText="İptal"
          showCancel={true}
        />
      )}

      {/* Photo Options Modal - iOS Style - Embedded in the screen */}
      {showPhotoOptions && (
        <div className="absolute inset-0 flex flex-col h-full">
          {/* Main content area - pushed up */}
          <div className="flex-1"></div>

          {/* Photo upload modal - fixed at bottom */}
          <div className="bg-white border-t border-gray-200">
            <div className="p-4 text-center border-b">
              <h3 className="text-lg font-semibold">Fotoğraf Ekle</h3>
              <p className="text-sm text-gray-500 mt-1">Önlem fotoğrafı eklemek için kaynak seçin</p>
            </div>

            <div className="p-4 space-y-3">
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-md flex items-center justify-center font-medium"
                onClick={() => handlePhotoUpload("camera")}
              >
                <Camera className="h-5 w-5 mr-2" />
                Kamera ile Çek
              </button>

              <button
                className="w-full py-3 border border-gray-300 rounded-md flex items-center justify-center font-medium"
                onClick={() => handlePhotoUpload("gallery")}
              >
                <Upload className="h-5 w-5 mr-2" />
                Galeriden Seç
              </button>

              <button className="w-full py-3 text-red-600 font-medium" onClick={() => setShowPhotoOptions(false)}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Simulation Modal */}
      {showCameraSimulation && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-4">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowCameraSimulation(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full h-3/4 bg-gray-800 flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400 opacity-50" />
            </div>
          </div>

          <div className="p-4 bg-black">
            <div className="flex justify-center">
              <Button className="rounded-full w-16 h-16 bg-white hover:bg-gray-200" onClick={handleCameraCapture} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

