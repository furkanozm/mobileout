"use client"
import { X } from "lucide-react"

interface IOSToastProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
}

export function IOSToast({ open, onClose, title, description }: IOSToastProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[343px] animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-500">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="p-6">
          <h3 className="text-base font-semibold mb-2">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  )
}

