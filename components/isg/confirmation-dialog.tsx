"use client"
import { Info } from "lucide-react"

interface ConfirmationDialogProps {
  title: string
  message: string
  confirmLabel: string
  confirmClass: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="w-[80%] max-w-[280px] bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="pt-5 pb-3 px-4 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button
              className="py-3 text-gray-600 font-medium text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              İptal
            </button>
            <button className={`py-3 font-medium text-sm transition-colors ${confirmClass}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

