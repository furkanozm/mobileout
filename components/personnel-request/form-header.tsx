"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mountain } from "lucide-react"

interface FormHeaderProps {
  title: string
  onBack: () => void
}

export function FormHeader({ title, onBack }: FormHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="flex items-center gap-2 flex-1 justify-center">
        <Mountain className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-blue-600">{title}</h1>
      </div>
      <div className="w-10" />
    </header>
  )
}

