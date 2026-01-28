"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, User, FileText } from "lucide-react"

interface BottomNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-4 bg-white border-t">
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-0.5 ${currentTab === "home" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("home")}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Ana Sayfa</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-0.5 ${currentTab === "search" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("search")}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Arama</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-0.5 ${currentTab === "documents" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("documents")}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px]">Belgeler</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-0.5 ${currentTab === "profile" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("profile")}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profil</span>
      </Button>
    </nav>
  )
}

