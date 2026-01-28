"use client"

import { Button } from "@/components/ui/button"

interface IOSPopupProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function IOSPopup({ isOpen, onClose, message }: IOSPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-64 overflow-hidden">
        <div className="p-4 text-center">
          <p className="text-base font-medium mb-4">{message}</p>
          <Button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Tamam
          </Button>
        </div>
      </div>
    </div>
  )
}

