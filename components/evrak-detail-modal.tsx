"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, FileImage, FileIcon as FilePdf, ExternalLink, ChevronLeft, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IOSToast } from "./ios-toast"

interface Evrak {
  id: string
  personelAdi: string
  tckn: string
  evrakTuru: string
  tarih: string
  durum: "beklemede" | "onaylandı" | "reddedildi"
  dosyaTuru: "pdf" | "jpg"
  firma: string
  projeGrubu: string
  proje: string
}

interface EvrakDetailModalProps {
  isOpen: boolean
  onClose: () => void
  evrak: Evrak | null
  onApprove: () => void
  onReject: () => void
}

const evrakTuruIkonlari: { [key: string]: React.ReactNode } = {
  pdf: <FilePdf className="h-5 w-5 text-red-500" />,
  jpg: <FileImage className="h-5 w-5 text-blue-500" />,
}

const getEvrakImage = (evrakTuru: string) => {
  return `/placeholder.svg?height=400&width=300`
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

export function EvrakDetailModal({ isOpen, onClose, evrak, onApprove, onReject }: EvrakDetailModalProps) {
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showDownloadToast, setShowDownloadToast] = useState(false)

  const handleDownload = () => {
    // Simulate download process
    setShowDownloadToast(true)
    setTimeout(() => {
      setShowDownloadToast(false)
      setShowFullscreen(false)
      onClose()
    }, 2000)
  }

  if (!isOpen || !evrak) return null

  return (
    <ClientOnly>
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[343px] h-[600px] mx-4 bg-white rounded-xl overflow-hidden shadow-lg">
          {showFullscreen ? (
            <div className="w-full h-full flex flex-col bg-white">
              <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowFullscreen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-gray-600 truncate border">
                  document-viewer.outsourcehub.com
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
                <img
                  src={getEvrakImage(evrak.evrakTuru) || "/placeholder.svg"}
                  alt={evrak.evrakTuru}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-white flex flex-col">
              <div className="flex items-center justify-between p-3 border-b shrink-0">
                <div className="flex items-center gap-2">
                  {evrakTuruIkonlari[evrak.dosyaTuru]}
                  <h2 className="font-semibold text-base">{evrak.evrakTuru}</h2>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-sm">Personel:</span>
                      <p className="text-sm">
                        {evrak.personelAdi} <span className="text-xs text-muted-foreground ml-1">({evrak.tckn})</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Tarih:</span>
                      <p className="text-sm text-muted-foreground">{evrak.tarih}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Durum:</span>
                      <Badge
                        className={cn(
                          "px-2 py-0.5 text-xs",
                          evrak.durum === "onaylandı" && "bg-green-100 text-green-800 border-green-200",
                          evrak.durum === "reddedildi" && "bg-red-100 text-red-800 border-red-200",
                          evrak.durum === "beklemede" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                        )}
                      >
                        {evrak.durum === "onaylandı"
                          ? "Onaylandı"
                          : evrak.durum === "reddedildi"
                            ? "Reddedildi"
                            : "Beklemede"}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative border rounded-lg overflow-hidden bg-gray-50 group">
                    <img
                      src={getEvrakImage(evrak.evrakTuru) || "/placeholder.svg"}
                      alt={evrak.evrakTuru}
                      className="w-full h-auto cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]"
                      onClick={() => setShowFullscreen(true)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
                      <Button
                        className="bg-white text-blue-600 hover:bg-blue-50"
                        onClick={() => setShowFullscreen(true)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Dosyaya Git
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-3 border-t shrink-0">
                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1 h-10" onClick={onReject}>
                    <X className="mr-2 h-4 w-4" />
                    Reddet
                  </Button>
                  <Button className="flex-1 h-10 bg-green-600 hover:bg-green-700" onClick={onApprove}>
                    <Check className="mr-2 h-4 w-4" />
                    Onayla
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <IOSToast
        open={showDownloadToast}
        onClose={() => setShowDownloadToast(false)}
        title="Dosya İndirildi"
        description="Dosya başarıyla indirildi."
        duration={2}
      />
    </ClientOnly>
  )
}

