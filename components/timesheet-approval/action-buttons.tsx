"use client"

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  selectedCount: number
  onReject: () => void
  onApprove: () => void
}

export function ActionButtons({ selectedCount, onReject, onApprove }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="destructive" className="flex-1" onClick={onReject}>
        {selectedCount} Adet Reddet
      </Button>
      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onApprove}>
        {selectedCount} Adet Onayla
      </Button>
    </div>
  )
}

