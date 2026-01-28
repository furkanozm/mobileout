"use client"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingDownloadButtonProps {
  onClick: () => void
  selectedCount: number
}

export function FloatingDownloadButton({ onClick, selectedCount }: FloatingDownloadButtonProps) {
  if (selectedCount === 0) return null

  return (
    <div className="absolute bottom-[80px] right-4">
      <Button
        onClick={onClick}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 relative"
      >
        <Download className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {selectedCount}
        </span>
      </Button>
    </div>
  )
}

