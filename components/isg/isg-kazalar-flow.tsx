"use client"
import { useState } from "react"
import { KazaFormScreen } from "./kaza-form-screen"
import { KazalarScreen } from "./kazalar-screen"
import { KazaDetailScreen } from "./kaza-detail-screen"
import { useToast } from "@/components/ui/use-toast"

// Define the accident type
type Accident = {
  id: number
  title: string
  date: string
  time: string
  location: string
  severity: string
  status: string
  description: string
}

export function ISGKazalarFlow() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<"list" | "form" | "detail">("list")
  const [selectedAccidentId, setSelectedAccidentId] = useState<number | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [status, setStatus] = useState("pending")

  // Mock accidents data
  const [accidents, setAccidents] = useState<Accident[]>([
    {
      id: 1,
      title: "Kayma Kazası",
      date: "10 Nisan 2024",
      time: "14:30",
      location: "Üretim Alanı - Kat 2",
      severity: "medium",
      status: "investigated",
      description: "Islak zeminde kayma sonucu hafif yaralanma",
    },
    {
      id: 2,
      title: "Elektrik Çarpması",
      date: "25 Mart 2024",
      time: "11:15",
      location: "Elektrik Panosu - Bodrum Kat",
      severity: "high",
      status: "closed",
      description: "Bakım sırasında elektrik çarpması",
    },
    {
      id: 3,
      title: "Malzeme Düşmesi",
      date: "15 Şubat 2024",
      time: "09:45",
      location: "Depo Alanı",
      severity: "low",
      status: "open",
      description: "Raftan malzeme düşmesi sonucu hafif yaralanma",
    },
  ])

  const handleAddNew = () => {
    setScreen("form")
    setIsNewRecord(true)
  }

  const handleFormSubmit = () => {
    // In a real app, you would add the new accident to your data store
    if (isNewRecord) {
      const newAccident: Accident = {
        id: Math.max(...accidents.map((a) => a.id), 0) + 1,
        title: "Yeni Kaza Kaydı",
        date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        location: "Belirtilmedi",
        severity: "medium",
        status: "open", // Default to open for new records
        description: "Kaza detayları girilmedi",
      }

      setAccidents([...accidents, newAccident])
      setSelectedAccidentId(newAccident.id)

      toast({
        title: "Kaza kaydı oluşturuldu",
        description: "Yeni kaza kaydı başarıyla oluşturuldu.",
      })
    } else {
      toast({
        title: "Kaza kaydı güncellendi",
        description: "Kaza kaydı başarıyla güncellendi.",
      })
    }

    setScreen("detail")
  }

  const handleFormCancel = () => {
    setScreen("list")
    setIsNewRecord(false)
  }

  const handleViewDetail = (id: number) => {
    setSelectedAccidentId(id)
    setScreen("detail")
    setIsNewRecord(false)
  }

  const handleEditAccident = (id: number) => {
    setSelectedAccidentId(id)
    setScreen("form")
    setIsNewRecord(false)
  }

  const handleDeleteAccident = (id: number) => {
    // Delete the accident from the array
    setAccidents(accidents.filter((accident) => accident.id !== id))
    setScreen("list")

    toast({
      title: "Kaza kaydı silindi",
      description: "Kaza kaydı başarıyla silindi.",
    })
  }

  const handleBackToList = () => {
    setScreen("list")
    setSelectedAccidentId(null)
    setIsNewRecord(false)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  if (screen === "form") {
    return (
      <KazaFormScreen
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        accidentId={selectedAccidentId}
        isNew={isNewRecord}
      />
    )
  }

  if (screen === "detail" && selectedAccidentId !== null) {
    return (
      <KazaDetailScreen
        id={selectedAccidentId}
        onBack={handleBackToList}
        onEdit={handleEditAccident}
        onDelete={handleDeleteAccident}
        isNew={isNewRecord}
      />
    )
  }

  return (
    <KazalarScreen
      accidents={accidents}
      onAddNew={handleAddNew}
      onViewDetail={handleViewDetail}
      onBack={() => {}} // Add an empty function for onBack
      status={status}
      onStatusChange={handleStatusChange}
    />
  )
}

