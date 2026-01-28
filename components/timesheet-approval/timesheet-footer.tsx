import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface TimesheetFooterProps {
  onRejectAll: () => void
  onApproveAll: () => void
  isDisabled: boolean
}

export function TimesheetFooter({ onRejectAll, onApproveAll, isDisabled }: TimesheetFooterProps) {
  return (
    <div className="bg-white border-t">
      <div className="flex">
        <Button
          variant="destructive"
          className="flex-1 rounded-none h-14 bg-red-100 hover:bg-red-200 text-red-600"
          onClick={onRejectAll}
          disabled={isDisabled}
        >
          <X className="h-5 w-5 mr-2" />
          Tümünü Reddet
        </Button>
        <Button
          className="flex-1 rounded-none h-14 bg-blue-100 hover:bg-blue-200 text-blue-600"
          onClick={onApproveAll}
          disabled={isDisabled}
        >
          <Check className="h-5 w-5 mr-2" />
          Tümünü Onayla
        </Button>
      </div>
    </div>
  )
}

