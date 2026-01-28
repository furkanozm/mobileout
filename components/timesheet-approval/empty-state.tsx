"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface EmptyStateProps {
  onShowAll: () => void
}

export function EmptyState({ onShowAll }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
      <Check className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Tüm Puantajlar Onaylandı</h3>
      <p className="text-gray-500 mb-6">Onay bekleyen puantaj bulunmamaktadır.</p>
      <Button variant="outline" className="border-blue-600 text-blue-600" onClick={onShowAll}>
        Tüm Puantajları Göster
      </Button>
    </div>
  )
}

