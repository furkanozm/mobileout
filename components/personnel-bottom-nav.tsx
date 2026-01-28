"use client"

import { Button } from "@/components/ui/button"
import { Home, FileText, User } from "lucide-react"

interface PersonnelBottomNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export function PersonnelBottomNav({ currentTab, onTabChange }: PersonnelBottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white flex items-center justify-around h-[60px] border-t border-gray-200 shadow-sm z-10 w-full">
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
        className={`flex flex-col items-center gap-1 ${currentTab === "documents" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("documents")}
      >
        <FileText className="h-5 w-5" />
        <span className="text-xs">Belgeler</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-1 ${currentTab === "profile" ? "text-blue-600" : "text-gray-600"}`}
        onClick={() => onTabChange("profile")}
      >
        <User className="h-5 w-5" />
        <span className="text-xs">Profil</span>
      </Button>
    </nav>
  )
}

