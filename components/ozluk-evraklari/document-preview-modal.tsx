"use client"

import { X, Download, Share } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    name: string
    type: string
    status: string
    validity: string
  } | null
}

export function DocumentPreviewModal({ isOpen, onClose, document }: DocumentPreviewModalProps) {
  if (!document) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl relative">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <button onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </button>
            <div className="text-center font-medium">Belge Detayı</div>
            <div className="flex items-center gap-2">
              <button className="p-2">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{document.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{document.type}</p>
              <div className="mt-2 flex items-center">
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
            <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=300"
                alt={document.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

