import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Zap } from "lucide-react"

interface QuickApprovalSwitchProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
}

export function QuickApprovalSwitch({ isEnabled, onToggle }: QuickApprovalSwitchProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <div className="flex items-center gap-2">
        <Zap className={`h-5 w-5 ${isEnabled ? "text-blue-600" : "text-gray-400"}`} />
        <Label htmlFor="quick-approval" className="text-[15px] font-medium cursor-pointer">
          Hızlı Onay
        </Label>
      </div>
      <Switch id="quick-approval" checked={isEnabled} onCheckedChange={onToggle} />
    </div>
  )
}

