"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileDown, FileText, FileImage, FileCheck, AlertTriangle } from "lucide-react"
import type { Evrak } from "./types"

interface DownloadPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedEvraklar: Evrak[]
  onDownload: () => void
}

export function DownloadPopup({ isOpen, onClose, selectedEvraklar, onDownload }: DownloadPopupProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const evrakTuruIkonlari: { [key: string]: React.ReactNode } = {
    "Kimlik Fotokopisi": <FileImage className="h-5 w-5 text-blue-500" />,
    "Sağlık Raporu": <FileCheck className="h-5 w-5 text-green-500" />,
    "İş Sözleşmesi": <FileText className="h-5 w-5 text-yellow-500" />,
    default: <AlertTriangle className="h-5 w-5 text-red-500" />,
  }

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      onDownload()
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-[320px] max-h-[80vh] overflow-hidden shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Seçili Evraklar</h2>
          </div>
          <ScrollArea className="max-h-[50vh] p-4">
            <ul className="space-y-4">
              {selectedEvraklar.map((evrak) => (
                <li key={evrak.id} className="flex items-start space-x-3">
                  {evrakTuruIkonlari[evrak.evrakTuru] || evrakTuruIkonlari.default}
                  <div>
                    <p className="font-medium">{evrak.evrakTuru}</p>
                    <p className="text-sm text-muted-foreground">
                      {evrak.personelAdi} - {evrak.tckn}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isDownloading} className="flex-1">
                İptal
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
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
    </>
  )
}

