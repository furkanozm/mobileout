"use client"

import { useState } from "react"
import { FileText, Briefcase, Users, FolderOpen, ChevronLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Evrak tipleri ve ikonları
const documentTypeIcons = {
  "İş Sözleşmesi": <FileText className="h-5 w-5" />,
  "Kimlik Fotokopisi": <FileText className="h-5 w-5" />,
  İkametgah: <FileText className="h-5 w-5" />,
  "Sağlık Raporu": <FileText className="h-5 w-5" />,
  Diploma: <FileText className="h-5 w-5" />,
  Sertifika: <FileText className="h-5 w-5" />,
  "Gizlilik Sözleşmesi": <FileText className="h-5 w-5" />,
  "Adli Sicil Kaydı": <FileText className="h-5 w-5" />,
  "İstifa Dilekçesi": <FileText className="h-5 w-5" />,
  "İşten Ayrılış Belgesi": <FileText className="h-5 w-5" />,
  Diğer: <FileText className="h-5 w-5" />,
}

// Örnek veri
const mockDocuments = [
  {
    id: 1,
    personelName: "Ahmet Yılmaz",
    company: "ABC Teknoloji",
    projectGroup: "Yazılım Geliştirme",
    project: "E-Ticaret Platformu",
    documentType: "İş Sözleşmesi",
    documentName: "İş Sözleşmesi",
    uploadDate: "12.03.2023",
    status: "Beklemede",
  },
  {
    id: 2,
    personelName: "Ayşe Demir",
    company: "XYZ Holding",
    projectGroup: "İnsan Kaynakları",
    project: "Personel Yönetimi",
    documentType: "Kimlik Fotokopisi",
    documentName: "Nüfus Cüzdanı",
    uploadDate: "15.03.2023",
    status: "Beklemede",
  },
  {
    id: 3,
    personelName: "Mehmet Kaya",
    company: "DEF İnşaat",
    projectGroup: "Saha Operasyonları",
    project: "Konut Projesi",
    documentType: "Sağlık Raporu",
    documentName: "İşe Giriş Sağlık Raporu",
    uploadDate: "18.03.2023",
    status: "Beklemede",
  },
  {
    id: 4,
    personelName: "Zeynep Şahin",
    company: "GHI Danışmanlık",
    projectGroup: "Finans",
    project: "Bütçe Planlama",
    documentType: "Diploma",
    documentName: "Lisans Diploması",
    uploadDate: "20.03.2023",
    status: "Beklemede",
  },
  {
    id: 5,
    personelName: "Ali Öztürk",
    company: "JKL Lojistik",
    projectGroup: "Nakliye",
    project: "Filo Yönetimi",
    documentType: "Adli Sicil Kaydı",
    documentName: "Adli Sicil Kaydı",
    uploadDate: "22.03.2023",
    status: "Beklemede",
  },
]

interface HizliOnayFlowProps {
  onClose: () => void
  onComplete: () => void
}

export function HizliOnayFlow({ onClose, onComplete }: HizliOnayFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [approvedDocuments, setApprovedDocuments] = useState<number[]>([])
  const [rejectedDocuments, setRejectedDocuments] = useState<number[]>([])
  const [showCompletionNotification, setShowCompletionNotification] = useState(false)

  const currentDocument = mockDocuments[currentIndex]
  const totalDocuments = mockDocuments.length
  const isLastDocument = currentIndex === totalDocuments - 1

  const handleApprove = () => {
    setApprovedDocuments([...approvedDocuments, currentDocument.id])
    if (!isLastDocument) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Son belge onaylandığında bildirim göster
      setShowCompletionNotification(true)
      // 2 saniye sonra tamamla
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const handleReject = () => {
    setRejectedDocuments([...rejectedDocuments, currentDocument.id])
    if (!isLastDocument) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Son belge reddedildiğinde bildirim göster
      setShowCompletionNotification(true)
      // 2 saniye sonra tamamla
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const handleSkip = () => {
    if (!isLastDocument) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Son belge atlandığında bildirim göster
      setShowCompletionNotification(true)
      // 2 saniye sonra tamamla
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const icon =
    documentTypeIcons[currentDocument.documentType as keyof typeof documentTypeIcons] || documentTypeIcons["Diğer"]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-1">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-base font-medium">Hızlı Onay</h2>
        </div>
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          {currentIndex + 1} / {totalDocuments}
        </Badge>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-3">
          {/* Document Header */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium">{currentDocument.documentName}</h3>
              </div>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {currentDocument.status}
              </span>
            </div>
          </div>

          {/* Compact Document Info */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 leading-tight">Personel</p>
                <p className="text-sm truncate">{currentDocument.personelName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Briefcase className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 leading-tight">Firma</p>
                <p className="text-sm truncate">{currentDocument.company}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FolderOpen className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 leading-tight">Proje Grubu</p>
                <p className="text-sm truncate">{currentDocument.projectGroup}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 leading-tight">Proje</p>
                <p className="text-sm truncate">{currentDocument.project}</p>
              </div>
            </div>

            <div className="flex items-center col-span-2">
              <svg
                className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div>
                <p className="text-xs text-gray-500 leading-tight">Yükleme Tarihi</p>
                <p className="text-sm">{currentDocument.uploadDate}</p>
              </div>
            </div>
          </div>

          {/* Document Preview - Directly visible */}
          <div className="mt-4 border rounded-lg overflow-hidden bg-white">
            <img
              src="/placeholder.svg?height=300&width=250"
              alt="Belge Önizleme"
              className="w-full object-contain h-[220px]"
            />
          </div>

          {/* Action Buttons - Moved up */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              onClick={handleReject}
              className="py-3.5 px-4 bg-red-100 text-red-700 rounded-lg font-medium text-sm"
            >
              Reddet
            </button>
            <button
              onClick={handleSkip}
              className="py-3.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm"
            >
              Atla
            </button>
            <button
              onClick={handleApprove}
              className="py-3.5 px-4 bg-green-600 text-white rounded-lg font-medium text-sm"
            >
              Onayla
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="border-t bg-white">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalDocuments) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tamamlama Bildirimi */}
      {showCompletionNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center max-w-xs mx-auto">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">İşlem Tamamlandı</h3>
            <p className="text-center text-gray-600">{approvedDocuments.length} evrak başarıyla onaylandı.</p>
          </div>
        </div>
      )}
    </div>
  )
}

