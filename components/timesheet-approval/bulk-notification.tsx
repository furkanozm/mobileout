import { Check, X } from "lucide-react"

interface BulkNotificationProps {
  show: boolean
  type: "approved" | "rejected"
  count: number
}

export function BulkNotification({ show, type, count }: BulkNotificationProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
        <div className={`rounded-full p-3 mb-3 ${type === "approved" ? "bg-green-100" : "bg-red-100"}`}>
          {type === "approved" ? <Check className="h-8 w-8 text-green-600" /> : <X className="h-8 w-8 text-red-600" />}
        </div>
        <p className="text-lg font-medium">
          {type === "approved" ? `${count} Puantaj Onaylandı` : `${count} Puantaj Reddedildi`}
        </p>
      </div>
    </div>
  )
}

