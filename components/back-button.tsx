import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button variant="ghost" size="icon" className="absolute top-2 left-2 z-10" onClick={onClick}>
      <ChevronLeft className="h-6 w-6" />
    </Button>
  )
}

