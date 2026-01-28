"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface RejectionDialogProps {
  title: string
  message: string
  rejectionReason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
  onCancel: () => void
}

export function RejectionDialog({
  title,
  message,
  rejectionReason,
  onReasonChange,
  onConfirm,
  onCancel,
}: RejectionDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="w-[80%] max-w-[280px] bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="pt-5 pb-3 px-4">
          <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm text-center">{message}</p>

          <RadioGroup value={rejectionReason} onValueChange={onReasonChange} className="space-y-2">
            <div className="flex items-center space-x-2 px-1">
              <RadioGroupItem value="İzinli" id="izinli" />
              <Label htmlFor="izinli" className="text-sm">
                İzinli
              </Label>
            </div>
            <div className="flex items-center space-x-2 px-1">
              <RadioGroupItem value="Raporlu" id="raporlu" />
              <Label htmlFor="raporlu" className="text-sm">
                Raporlu
              </Label>
            </div>
            <div className="flex items-center space-x-2 px-1">
              <RadioGroupItem value="Görevli" id="gorevli" />
              <Label htmlFor="gorevli" className="text-sm">
                Görevli
              </Label>
            </div>
            <div className="flex items-center space-x-2 px-1">
              <RadioGroupItem value="Diğer" id="diger" />
              <Label htmlFor="diger" className="text-sm">
                Diğer
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button
              className="py-3 text-gray-600 font-medium text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              İptal
            </button>
            <button
              className={`py-3 font-medium text-sm transition-colors ${
                !rejectionReason ? "text-gray-400" : "text-red-600 hover:bg-red-50 active:bg-red-100"
              }`}
              onClick={onConfirm}
              disabled={!rejectionReason}
            >
              Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

