"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBarProps {
  pendingCount: number
  approvedCount: number
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
}

export function StatusBar({ pendingCount, approvedCount, selectedCount, totalCount, onSelectAll }: StatusBarProps) {
  return (
    <div className="bg-white border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="text-xs">
          {pendingCount} Bekleyen
        </Badge>
        <Badge variant="success" className="text-xs">
          {approvedCount} Onaylı
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSelectAll}
        className={cn("text-xs", selectedCount === totalCount && "text-blue-600")}
      >
        {selectedCount === totalCount ? "Tümünü Kaldır" : "Tümünü Seç"}
      </Button>
    </div>
  )
}

