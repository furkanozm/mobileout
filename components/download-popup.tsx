"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileDown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DownloadPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedEvraklar: Evrak[]
  onDownload: () => void
}

interface Evrak {
  id: string
  personelAdi: string
  tckn: string
  evrakTuru: string
}

export function DownloadPopup({ isOpen, onClose, selectedEvraklar, onDownload }: DownloadPopupProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      onDownload()
      toast({
        title: "İndirme Tamamlandı",
        description: "Seçili evraklar sisteme kayıtlı e-posta adresinize gönderilmiştir.",
      })
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[343px] max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Seçili Evraklar</h2>
        </div>
        <ScrollArea className="max-h-[50vh] p-4">
          <ul className="space-y-3">
            {selectedEvraklar.map((evrak) => (
              <li key={evrak.id}>
                <p className="font-medium">{evrak.evrakTuru}</p>
                <p className="text-sm text-muted-foreground">
                  {evrak.personelAdi} - {evrak.tckn}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isDownloading} className="flex-1">
              İptal
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isDownloading ? (
                "İndiriliyor..."
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  İndir
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

