import { ChevronLeft, Menu, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onBack: () => void
  onFilterClick: () => void
  activeFilter: string
}

export function Header({ onBack, onFilterClick, activeFilter }: HeaderProps) {
  return (
    <header className="bg-white border-b px-4 h-14 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onFilterClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-blue-600">OutsourceHub</span>
        </div>
      </div>
    </header>
  )
}

