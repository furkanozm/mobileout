import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface BottomBarProps {
  show: boolean
  onDownload: () => void
}

export function BottomBar({ show, onDownload }: BottomBarProps) {
  if (!show) return null

  return (
    <div className="p-4 bg-white border-t">
      <Button onClick={onDownload} className="w-full bg-blue-600 hover:bg-blue-700">
        <Download className="w-5 h-5 mr-2" />
        Evrakları İndir
      </Button>
    </div>
  )
}

