import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface ApprovalNotificationProps {
  type: "approved" | "rejected"
  show: boolean
}

export function ApprovalNotification({ type, show }: ApprovalNotificationProps) {
  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "w-[300px] h-[100px] flex items-center justify-center rounded-lg shadow-lg",
          type === "approved" ? "bg-green-100 border-4 border-green-500" : "bg-red-100 border-4 border-red-500",
        )}
      >
        <div className="flex items-center space-x-2">
          {type === "approved" ? <Check className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-red-600" />}
          <span className="text-lg font-semibold">{type === "approved" ? "Onaylandı" : "Reddedildi"}</span>
        </div>
      </div>
    </div>
  )
}

