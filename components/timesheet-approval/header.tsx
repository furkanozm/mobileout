"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Filter, Globe } from "lucide-react"

interface HeaderProps {
  onBack: () => void
  onFilterClick: () => void
  hasActiveFilters: boolean
}

export function TimesheetHeader({ onBack, onFilterClick, hasActiveFilters }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="flex items-center ml-4">
        <Globe className="h-6 w-6 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onFilterClick} className="relative">
        <Filter className="h-6 w-6" />
        {hasActiveFilters && <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full" />}
      </Button>
    </header>
  )
}

