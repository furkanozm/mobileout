"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface IOSToastProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  duration?: number
  titleClassName?: string
  descriptionClassName?: string
}

export function IOSToast({
  open,
  onClose,
  title,
  description,
  duration = 3000,
  titleClassName,
  descriptionClassName,
}: IOSToastProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [open, onClose, duration])

  if (!open) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-gray-800/90 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-start p-4">
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-semibold", titleClassName)}>{title}</h3>
            {description && <p className={cn("mt-1 text-gray-200", descriptionClassName)}>{description}</p>}
          </div>
          <button onClick={onClose} className="ml-4 inline-flex text-gray-400 hover:text-white focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

