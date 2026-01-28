"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, FileText, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { IOSAlert } from "@/components/ui/ios-alert"

interface OryantasyonDetailScreenProps {
  training: any
  onBack: () => void
}

export function OryantasyonDetailScreen({ training, onBack }: OryantasyonDetailScreenProps) {
  const { toast } = useToast()
  const [currentStatus, setCurrentStatus] = useState(training.status)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  const handleStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setShowStatusConfirm(true)
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setCurrentStatus(pendingStatus)
      toast({
        title: "Durum güncellendi",
        description: `Oryantasyon durumu "${pendingStatus === "completed" ? "Tamamlandı" : "Planlandı"}" olarak güncellendi.`,
      })
      setShowStatusConfirm(false)
      setPendingStatus(null)
    }
  }

  const cancelStatusChange = () => {
    setShowStatusConfirm(false)
    setPendingStatus(null)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="Oryantasyon Detayı"
        onBackClick={onBack}
        rightContent={
          <div className="flex space-x-2">
            <select
              className="text-sm rounded border-gray-200"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="upcoming">Planlandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="py-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{training.title}</h2>
            <Badge
              variant={
                currentStatus === "completed" ? "success" : currentStatus === "cancelled" ? "destructive" : "outline"
              }
            >
              {currentStatus === "completed"
                ? "Tamamlandı"
                : currentStatus === "cancelled"
                  ? "İptal Edildi"
                  : "Planlandı"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-green-600" />
                <span>{training.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-green-600" />
                <span>{training.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-green-600" />
                <span>{training.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-green-600" />
                <span>Eğitmen: {training.trainer || "Belirtilmemiş"}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Firma Bilgileri</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Firma:</span> {training.company}
                </p>
                <p>
                  <span className="font-medium">Proje Grubu:</span> {training.projectGroup}
                </p>
                <p>
                  <span className="font-medium">Proje:</span> {training.project}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Katılımcılar</h3>
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">{training.participants} Katılımcı</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  Görüntüle
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Dokümanlar</h3>
              <div className="space-y-2">
                {training.documents > 0 ? (
                  Array.from({ length: training.documents }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-600" />
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

            {training.photos && training.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Fotoğraflar</h3>
                <div className="grid grid-cols-2 gap-2">
                  {training.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Oryantasyon fotoğrafı ${index + 1}`}
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
        <Button variant="outline" className="w-[48%]" onClick={onBack}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
        <Button variant="destructive" className="w-[48%]">
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
              Oryantasyon durumunu{" "}
              <span className="font-semibold">
                "
                {pendingStatus === "completed"
                  ? "Tamamlandı"
                  : pendingStatus === "cancelled"
                    ? "İptal Edildi"
                    : "Planlandı"}
                "
              </span>{" "}
              olarak değiştirmek istediğinize emin misiniz?
            </div>
          }
          confirmText="Onayla"
          confirmVariant="default"
          cancelText="İptal"
          showCancel={true}
        />
      )}
    </div>
  )
}

