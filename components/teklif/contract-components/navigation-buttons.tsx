"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface NavigationButtonsProps {
  onBack: () => void
  onNext: (e: React.FormEvent) => void
}

export function NavigationButtons({ onBack, onNext }: NavigationButtonsProps) {
  return (
    <div className="p-4 pb-6 bg-white border-t mt-auto">
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 text-sm">
          Geri
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 text-sm bg-blue-600 hover:bg-blue-700">
          Devam Et
        </Button>
      </div>
    </div>
  )
}

