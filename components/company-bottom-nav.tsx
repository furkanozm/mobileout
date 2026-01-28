"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, User } from "lucide-react"

interface CompanyBottomNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export function CompanyBottomNav({ currentTab, onTabChange }: CompanyBottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around h-[60px] z-10">
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-1 ${currentTab === "home" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("home")}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs">Ana Sayfa</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-1 ${currentTab === "search" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("search")}
      >
        <Search className="h-5 w-5" />
        <span className="text-xs">Arama</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-1 ${currentTab === "profile" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("profile")}
      >
        <User className="h-5 w-5" />
        <span className="text-xs">Hesabım</span>
      </Button>
    </nav>
  )
}

