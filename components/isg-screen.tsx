"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  GraduationCap,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Stethoscope,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface IsgScreenProps {
  onBack: () => void
}

export function IsgScreen({ onBack }: IsgScreenProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const menuItems = [
    {
      id: "isg-egitim",
      title: "İsg Eğitimleri",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "oryantasyon",
      title: "Oryantasyon Eğitimleri",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "kazalar",
      title: "Kazalar",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: "uygunsuzluklar",
      title: "Uygunsuzluklar",
      icon: AlertOctagon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "ramak-kala",
      title: "Ramak Kala Listesi",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: "muayene",
      title: "Muayene Listesi",
      icon: Stethoscope,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const handleMenuItemClick = (id: string) => {
    setActiveSection(id)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="İSG" onBackClick={onBack} />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              onClick={() => handleMenuItemClick(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", item.bgColor)}>
                      <item.icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Placeholder for section content */}
      {activeSection && (
        <div className="absolute inset-0 bg-white z-10 flex flex-col">
          <Header
            title={menuItems.find((item) => item.id === activeSection)?.title || ""}
            onBackClick={() => setActiveSection(null)}
          />
          <div className="flex-1 p-4 flex items-center justify-center">
            <p className="text-gray-500">{activeSection} içeriği burada gösterilecek</p>
          </div>
        </div>
      )}
    </div>
  )
}

