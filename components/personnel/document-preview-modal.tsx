"use client"

import { useState, useEffect } from "react"
import { X, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    name: string
    type: string
    status: string
    validity: string
  } | null
  onDownload: () => void
}

export function DocumentPreviewModal({ isOpen, onClose, document, onDownload }: DocumentPreviewModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after mount
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!document) return null

  return (
    <div
      className="absolute inset-0 z-20 flex items-end justify-center bg-black/50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className={cn(
          "w-full max-w-full bg-white flex flex-col rounded-t-xl overflow-hidden transition-transform duration-300 ease-out",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80%" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center font-medium">Belge Detayı</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Document Info */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">{document.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{document.type}</p>

            {/* Document Details - Moved to top */}
            <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Belge ID:</span>
                <span className="text-sm font-medium">{document.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Yükleme Tarihi:</span>
                <span className="text-sm font-medium">01.01.2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Son Güncelleme:</span>
                <span className="text-sm font-medium">15.03.2023</span>
              </div>
            </div>

            <div className="mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  document.status === "valid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {document.status === "valid" ? "Geçerli" : "Geçersiz"}
              </span>
              <span className="text-sm text-gray-500 ml-2">Geçerlilik: {document.validity}</span>
            </div>
          </div>

          {/* Document Preview */}
          <div className="p-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <img
                src="/placeholder.svg?height=400&width=300"
                alt={document.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Description - Font size reduced */}
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Belge Açıklaması</h4>
                <p className="mt-1 text-xs">Bu belge, {document.name} için geçerli bir resmi evraktır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

