"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, Plus, Info } from "lucide-react"
import { IsgEgitimDetailScreen } from "./isg-egitim-detail-screen"
import { IsgEgitimParticipantsScreen } from "./isg-egitim-participants-screen"
import { IsgEgitimFormScreen } from "./isg-egitim-form-screen"

interface IsgEgitimScreenProps {
  onBack: () => void
  status: string
  onStatusChange: (status: string) => void
}

export type Training = {
  id: number
  title: string
  date: string
  time: string
  location: string
  participants: number
  status: string
  documents: number
  description?: string
  photos?: string[]
  trainer?: string
  company?: string
  projectGroup?: string
  project?: string
  isgCompany?: string
  isgSpecialist?: string
  startTime?: string
  endTime?: string
  projectLocation?: string
}

export function IsgEgitimScreen({ onBack, status, onStatusChange }: IsgEgitimScreenProps) {
  const [activeView, setActiveView] = useState<"list" | "detail" | "participants" | "form">("list")
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)

  // Mock data for trainings - updated to only have "completed" or "cancelled" status
  const trainings: Training[] = [
    {
      id: 1,
      title: "Temel İSG Eğitimi",
      date: "15 Mayıs 2024",
      time: "09:00 - 12:00",
      location: "Ana Toplantı Salonu",
      participants: 24,
      status: "completed",
      documents: 3,
      description: "İş sağlığı ve güvenliği temel eğitimi. Tüm çalışanlar için zorunludur.",
      photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      trainer: "Dr. Ahmet Yılmaz",
      company: "ABC İnşaat A.Ş.",
      projectGroup: "Konut Projeleri",
      projectLocation: "İstanbul / Kadıköy",
    },
    {
      id: 2,
      title: "Yüksekte Çalışma Eğitimi",
      date: "22 Mayıs 2024",
      time: "13:30 - 16:30",
      location: "Eğitim Salonu B",
      participants: 18,
      status: "completed", // Changed from "upcoming" to "completed"
      documents: 2,
      description: "Yüksekte çalışma teknikleri ve güvenlik önlemleri eğitimi.",
      trainer: "Murat Kaya",
      company: "XYZ Yapı Ltd.",
      projectGroup: "Altyapı Projeleri",
      projectLocation: "Ankara / Çankaya",
    },
    {
      id: 3,
      title: "Acil Durum ve Yangın Eğitimi",
      date: "5 Haziran 2024",
      time: "10:00 - 12:30",
      location: "Açık Alan",
      participants: 32,
      status: "completed", // Changed from "upcoming" to "completed"
      documents: 4,
      description: "Acil durum prosedürleri ve yangın söndürme teknikleri eğitimi.",
      trainer: "Zeynep Demir",
      company: "DEF Mühendislik",
      projectGroup: "Endüstriyel Projeler",
      projectLocation: "İzmir / Bornova",
    },
    {
      id: 4,
      title: "Kimyasal Madde Güvenliği",
      date: "10 Nisan 2024",
      time: "14:00 - 16:00",
      location: "Laboratuvar",
      participants: 12,
      status: "completed",
      documents: 5,
      description: "Kimyasal maddelerin güvenli kullanımı ve depolanması eğitimi.",
      photos: ["/placeholder.svg?height=300&width=400"],
      trainer: "Prof. Dr. Ayşe Öztürk",
      company: "GHI Holding",
      projectGroup: "Ticari Projeler",
      projectLocation: "Bursa / Nilüfer",
    },
  ]

  const handleViewDetails = (training: Training) => {
    setSelectedTraining(training)
    setActiveView("detail")
  }

  const handleViewParticipants = (training: Training) => {
    setSelectedTraining(training)
    setActiveView("participants")
  }

  const handleAddNew = () => {
    setSelectedTraining(null)
    setActiveView("form")
  }

  const handleBackToList = () => {
    setActiveView("list")
    setSelectedTraining(null)
  }

  const updateStatus = (newStatus: string) => {
    onStatusChange(newStatus)
  }

  if (activeView === "detail" && selectedTraining) {
    return <IsgEgitimDetailScreen training={selectedTraining} onBack={handleBackToList} />
  }

  if (activeView === "participants" && selectedTraining) {
    return <IsgEgitimParticipantsScreen training={selectedTraining} onBack={handleBackToList} />
  }

  if (activeView === "form") {
    return <IsgEgitimFormScreen onBack={handleBackToList} training={selectedTraining} />
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title="İSG Eğitimleri"
        onBackClick={onBack}
        rightContent={
          <Button variant="ghost" size="icon" className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </Button>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-3 mt-4">
          {trainings.map((training) => (
            <Card key={training.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{training.title}</h3>
                    <Badge variant={training.status === "completed" ? "success" : "destructive"}>
                      {training.status === "completed" ? "Tamamlandı" : "İptal Edildi"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{training.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{training.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{training.participants} Katılımcı</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{training.documents} Doküman</span>
                    </div>

                    {/* Firma, Proje Grubu ve Proje Lokasyonu bilgileri */}
                    <div className="pt-1 border-t border-gray-100">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 text-blue-600"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">{training.company}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 text-blue-600"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span className="text-xs">
                          {training.projectGroup} - {training.projectLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-around items-center p-2 border-t bg-gray-50">
                  <Button
                    className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0"
                    onClick={() => handleViewDetails(training)}
                  >
                    <Info className="h-4 w-4 text-white" />
                  </Button>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <Button
                    className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0"
                    onClick={() => handleViewParticipants(training)}
                  >
                    <Users className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        onClick={handleAddNew}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

