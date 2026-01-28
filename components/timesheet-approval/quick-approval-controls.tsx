"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface QuickApprovalControlsProps {
  isEnabled: boolean
  onToggle: (value: boolean) => void
  isBulkEnabled: boolean
  onBulkToggle: (value: boolean) => void
  isBulkSelectionActive?: boolean
  isSummaryVisible?: boolean
}

export function QuickApprovalControls({
  isEnabled,
  onToggle,
  isBulkEnabled,
  onBulkToggle,
  isBulkSelectionActive = false,
  isSummaryVisible = false,
}: QuickApprovalControlsProps) {
  // Don't render anything when bulk selection is active or summary is visible
  if (isBulkSelectionActive || isSummaryVisible) {
    return null
  }

  return (
    <div className="bg-white px-3 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <Switch
          id="quick-approval"
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-blue-600"
        />
        <Label htmlFor="quick-approval" className="text-sm font-medium">
          Hızlı Onay
        </Label>
      </div>

      {isEnabled && (
        <div className="flex items-center space-x-2">
          <Switch
            id="bulk-quick-approval"
            checked={isBulkEnabled}
            onCheckedChange={onBulkToggle}
            className="data-[state=checked]:bg-green-600"
          />
          <Label htmlFor="bulk-quick-approval" className="text-sm font-medium">
            Toplu Hızlı Onay
          </Label>
        </div>
      )}
    </div>
  )
}

