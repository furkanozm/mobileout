"use client"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface BulkActionBarProps {
  onMarkAbsent: () => void
  onMarkAttended: () => void
}

export function BulkActionBar({ onMarkAbsent, onMarkAttended }: BulkActionBarProps) {
  return (
    <div className="absolute bottom-16 left-4 right-4 p-3 bg-white border rounded-lg shadow-md flex gap-2 z-20">
      <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={onMarkAbsent}>
        <X className="mr-1 h-4 w-4" />
        Katılmadı
      </Button>
      <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onMarkAttended}>
        <Check className="mr-1 h-4 w-4" />
        Katıldı
      </Button>
    </div>
  )
}

