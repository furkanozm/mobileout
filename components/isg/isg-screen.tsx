"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, AlertTriangle, AlertOctagon, AlertCircle, Stethoscope } from "lucide-react"
import { IsgEgitimScreen } from "./isg-egitim-screen"
import { OryantasyonScreen } from "./oryantasyon-screen"
import { KazalarScreen } from "./kazalar-screen"
import { UygunsuzluklarScreen } from "./uygunsuzluklar-screen"
import { RamakKalaScreen } from "./ramak-kala-screen"
import { MuayeneScreen } from "./muayene-screen"
import { ISGKazalarFlow } from "./isg-kazalar-flow"

interface IsgScreenProps {
  onBack: () => void
}

export function IsgScreen({ onBack }: IsgScreenProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  // Track status for each section individually
  const [sectionStatus, setSectionStatus] = useState({
    "isg-egitim": "pending",
    oryantasyon: "pending",
    kazalar: "pending",
    uygunsuzluklar: "pending",
    "ramak-kala": "pending",
    muayene: "pending",
  })

  // Function to update status for a specific section
  const updateSectionStatus = (sectionId: string, newStatus: string) => {
    setSectionStatus((prev) => ({
      ...prev,
      [sectionId]: newStatus,
    }))
  }

  const menuItems = [
    {
      id: "isg-egitim",
      title: "İsg Eğitimleri",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      component: (
        <IsgEgitimScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["isg-egitim"]}
          onStatusChange={(status) => updateSectionStatus("isg-egitim", status)}
        />
      ),
    },
    {
      id: "oryantasyon",
      title: "Oryantasyon Eğitimleri",
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      component: (
        <OryantasyonScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["oryantasyon"]}
          onStatusChange={(status) => updateSectionStatus("oryantasyon", status)}
        />
      ),
    },
    {
      id: "kazalar",
      title: "Kazalar",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      component: (
        <KazalarScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["kazalar"]}
          onStatusChange={(status) => updateSectionStatus("kazalar", status)}
        />
      ),
    },
    {
      id: "uygunsuzluklar",
      title: "Uygunsuzluklar",
      icon: <AlertOctagon className="h-6 w-6 text-orange-600" />,
      component: (
        <UygunsuzluklarScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["uygunsuzluklar"]}
          onStatusChange={(status) => updateSectionStatus("uygunsuzluklar", status)}
        />
      ),
    },
    {
      id: "ramak-kala",
      title: "Ramak Kala Listesi",
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
      component: (
        <RamakKalaScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["ramak-kala"]}
          onStatusChange={(status) => updateSectionStatus("ramak-kala", status)}
        />
      ),
    },
    {
      id: "muayene",
      title: "Muayene Listesi",
      icon: <Stethoscope className="h-6 w-6 text-purple-600" />,
      component: (
        <MuayeneScreen
          onBack={() => setActiveSection(null)}
          status={sectionStatus["muayene"]}
          onStatusChange={(status) => updateSectionStatus("muayene", status)}
        />
      ),
    },
  ]

  // If a section is active, render its component
  if (activeSection) {
    const section = menuItems.find((item) => item.id === activeSection)
    if (section) {
      if (section.id === "kazalar") {
        return (
          <ISGKazalarFlow
            onBack={() => setActiveSection(null)}
            status={sectionStatus["kazalar"]}
            onStatusChange={(status) => updateSectionStatus("kazalar", status)}
          />
        )
      }
      return section.component
    }
  }

  // Helper function to get status badge for each card
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            Tamamlandı
          </span>
        )
      case "in-progress":
        return (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            Devam Ediyor
          </span>
        )
      case "attention":
        return (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Dikkat</span>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="İSG" onBackClick={onBack} />

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] relative"
              onClick={() => setActiveSection(item.id)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                {getStatusBadge(sectionStatus[item.id])}
                {item.icon}
                <h3 className="text-sm font-medium text-center mt-2">{item.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

