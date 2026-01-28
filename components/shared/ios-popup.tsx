"use client"

interface IOSPopupProps {
  isOpen: boolean
  onClose: () => void
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

export function IOSPopup({ isOpen, onClose, message, confirmText = "Tamam", cancelText, onConfirm }: IOSPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-64 overflow-hidden">
        <div className="p-4 text-center">
          <p className="text-base font-semibold mb-4">{message}</p>
          <div className="flex justify-center">
            {cancelText && (
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm py-1.5 px-4 rounded mr-2"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onClose()
                if (onConfirm) {
                  onConfirm()
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-1.5 px-4 rounded"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

