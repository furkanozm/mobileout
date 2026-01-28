"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge-extended"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UygunsuzlukDetailScreenProps {
  onBack: () => void
}

export function UygunsuzlukDetailScreen({ onBack }: UygunsuzlukDetailScreenProps) {
  const [status, setStatus] = useState<"open" | "in-progress" | "resolved">("open")
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)

  // Mock data for a non-conformity
  const nonConformity = {
    id: "NC-2024-001",
    title: "Eksik Kişisel Koruyucu Donanım",
    date: "12 Mayıs 2024",
    time: "14:30",
    location: "İnşaat Alanı - Blok C",
    reportedBy: "Ahmet Yılmaz",
    severity: "high",
    description:
      "İnşaat alanında çalışan 3 personelin baret ve emniyet kemeri kullanmadığı tespit edildi. Ayrıca, yüksekte çalışma için gerekli güvenlik önlemleri alınmamış durumda.",
    responsiblePerson: "Mehmet Kaya (Saha Sorumlusu)",
    correctiveActions:
      "1. Tüm personele KKD kullanımı hakkında acil bilgilendirme yapılacak.\n2. Saha sorumluları günlük KKD kontrolü yapacak.\n3. Yüksekte çalışma için güvenlik halatları ve ankraj noktaları kontrol edilecek.",
    deadline: "19 Mayıs 2024",
    photos: [
      "/placeholder.svg?height=300&width=400&text=Fotoğraf+1",
      "/placeholder.svg?height=300&width=400&text=Fotoğraf+2",
    ],
    documents: ["Tespit_Raporu.pdf", "Düzeltici_Faaliyet_Planı.pdf"],
    history: [
      { date: "12 Mayıs 2024", time: "14:30", action: "Uygunsuzluk kaydedildi", user: "Ahmet Yılmaz" },
      { date: "12 Mayıs 2024", time: "16:45", action: "Sorumlu atandı", user: "Ayşe Demir" },
      { date: "13 Mayıs 2024", time: "09:15", action: "Düzeltici faaliyet planı oluşturuldu", user: "Mehmet Kaya" },
    ],
  }

  const handleStatusChange = (newStatus: "open" | "in-progress" | "resolved") => {
    setStatus(newStatus)
    setShowStatusModal(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Açık
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            İşlemde
          </Badge>
        )
      case "resolved":
        return <Badge variant="success">Çözüldü</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Yüksek Öncelik</Badge>
      case "medium":
        return <Badge variant="warning">Orta Öncelik</Badge>
      case "low":
        return <Badge variant="outline">Düşük Öncelik</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const renderStatusModal = () => {
    if (!showStatusModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg w-full max-w-xs">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Durum Güncelle</h3>
          </div>
          <div className="p-4 space-y-3">
            <Button
              variant="outline"
              className={cn("w-full justify-start", status === "open" && "border-red-500")}
              onClick={() => handleStatusChange("open")}
            >
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Açık
            </Button>
            <Button
              variant="outline"
              className={cn("w-full justify-start", status === "in-progress" && "border-blue-500")}
              onClick={() => handleStatusChange("in-progress")}
            >
              <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
              İşlemde
            </Button>
            <Button
              variant="outline"
              className={cn("w-full justify-start", status === "resolved" && "border-green-500")}
              onClick={() => handleStatusChange("resolved")}
            >
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Çözüldü
            </Button>
          </div>
          <div className="p-3 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderImageModal = () => {
    if (!showImageModal) return null

    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col z-50">
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" className="text-white" onClick={() => setShowImageModal(null)}>
            <XCircle className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={showImageModal || "/placeholder.svg"}
            alt="Büyütülmüş fotoğraf"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="Uygunsuzluk Detayı"
        onBackClick={onBack}
        rightContent={
          <Button variant="ghost" className="p-1" onClick={() => setShowStatusModal(true)}>
            {getStatusBadge(status)}
          </Button>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-0">
        <div className="py-4 min-h-[calc(100vh-180px)] space-y-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-gray-900">{nonConformity.title}</h2>
              {getSeverityBadge(nonConformity.severity)}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>{nonConformity.date}</span>
                <Clock className="h-4 w-4 ml-4 mr-2 text-blue-600" />
                <span>{nonConformity.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                <span>{nonConformity.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                <span>Bildiren: {nonConformity.reportedBy}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-medium text-gray-900 mb-2">Açıklama</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{nonConformity.description}</p>
          </div>

          {/* Corrective Actions Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium text-gray-900">Düzeltici Faaliyetler</h3>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                <span>Termin: {nonConformity.deadline}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{nonConformity.correctiveActions}</p>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-blue-600" />
              <span>Sorumlu: {nonConformity.responsiblePerson}</span>
            </div>
          </div>

          {/* Photos Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-medium text-gray-900 mb-2">Fotoğraflar</h3>
            <div className="grid grid-cols-2 gap-2">
              {nonConformity.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative rounded-md overflow-hidden border border-gray-200"
                  onClick={() => setShowImageModal(photo)}
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Fotoğraf ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-medium text-gray-900 mb-2">Dokümanlar</h3>
            <div className="space-y-2">
              {nonConformity.documents.map((doc, index) => (
                <div key={index} className="flex items-center p-2 border rounded-md">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-md font-medium text-gray-900 mb-2">İşlem Geçmişi</h3>
            <div className="space-y-3">
              {nonConformity.history.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{item.date}</span>
                      <span className="mx-1">•</span>
                      <span>{item.time}</span>
                      <span className="mx-1">•</span>
                      <span>{item.user}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex justify-around items-center p-4 border-t bg-white">
        <Button variant="outline" className="flex-1 mr-2" onClick={() => setShowStatusModal(true)}>
          Durum Güncelle
        </Button>
        <Button className="flex-1 ml-2 bg-blue-600 hover:bg-blue-700">Düzenle</Button>
      </div>

      {renderStatusModal()}
      {renderImageModal()}
    </div>
  )
}

