import { Button } from "@/components/ui/button"
import { ChevronLeft, Menu, Globe } from "lucide-react"

interface TimesheetHeaderProps {
  onBack: () => void
  onMenuToggle: () => void
}

export function TimesheetHeader({ onBack, onMenuToggle }: TimesheetHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="flex items-center gap-2">
        <Globe className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-blue-600">OutsourceHub</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onMenuToggle}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  )
}

