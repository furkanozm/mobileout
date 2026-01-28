"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddProfessionButtonProps {
  onAdd: () => void
}

export function AddProfessionButton({ onAdd }: AddProfessionButtonProps) {
  return (
    <Button
      type="button"
      onClick={onAdd}
      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 h-12"
    >
      <Plus className="h-5 w-5 mr-2" />
      Yeni Meslek Kodu Ekle
    </Button>
  )
}

