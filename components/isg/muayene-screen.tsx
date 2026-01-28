"use client"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Stethoscope, Plus, Info, CheckCircle, FileText } from "lucide-react"

interface MuayeneScreenProps {
  onBack: () => void
  status: string
  onStatusChange: (status: string) => void
}

export function MuayeneScreen({ onBack, status, onStatusChange }: MuayeneScreenProps) {
  // Mock data for medical examinations
  const examinations = [
    {
      id: 1,
      employeeName: "Ahmet Yılmaz",
      department: "Üretim",
      date: "20 Mayıs 2024",
      time: "09:30",
      examinationType: "Periyodik Muayene",
      status: "scheduled",
      company: "ABC İnşaat A.Ş.",
      projectGroup: "Konut Projeleri",
      projectLocation: "İstanbul / Kadıköy",
    },
    {
      id: 2,
      employeeName: "Ayşe Kaya",
      department: "Muhasebe",
      date: "15 Mayıs 2024",
      time: "11:00",
      examinationType: "İşe Giriş Muayenesi",
      status: "completed",
      company: "XYZ Yapı Ltd.",
      projectGroup: "Altyapı Projeleri",
      projectLocation: "Ankara / Çankaya",
    },
    {
      id: 3,
      employeeName: "Mehmet Demir",
      department: "Lojistik",
      date: "12 Mayıs 2024",
      time: "14:30",
      examinationType: "Periyodik Muayene",
      status: "completed",
      company: "DEF Mühendislik",
      projectGroup: "Endüstriyel Projeler",
      projectLocation: "İzmir / Bornova",
    },
    {
      id: 4,
      employeeName: "Zeynep Çelik",
      department: "İnsan Kaynakları",
      date: "25 Mayıs 2024",
      time: "10:15",
      examinationType: "İşe Giriş Muayenesi",
      status: "scheduled",
      company: "GHI Holding",
      projectGroup: "Ticari Projeler",
      projectLocation: "Bursa / Nilüfer",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Planlandı
          </Badge>
        )
      case "completed":
        return <Badge variant="success">Tamamlandı</Badge>
      case "cancelled":
        return <Badge variant="destructive">İptal Edildi</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const handleAddNew = () => {
    // Add functionality for adding a new medical examination
    console.log("Add new medical examination")
    // This would typically open a form or modal
  }

  const updateStatus = (newStatus: string) => {
    onStatusChange(newStatus)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title="Muayene Listesi"
        onBackClick={onBack}
        rightContent={
          <div className="flex space-x-2">
            <select
              className="text-sm rounded border-gray-200"
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="pending">Bekliyor</option>
              <option value="in-progress">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="attention">Dikkat</option>
            </select>
          </div>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-3 mt-4">
          {examinations.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{exam.employeeName}</h3>
                    {getStatusBadge(exam.status)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-purple-600" />
                      <span>Departman: {exam.department}</span>
                    </div>
                    <div className="flex items-center">
                      <Stethoscope className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{exam.examinationType}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{exam.time}</span>
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
                          className="mr-2 text-purple-600"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">{exam.company}</span>
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
                          className="mr-2 text-purple-600"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span className="text-xs">
                          {exam.projectGroup} - {exam.projectLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-around items-center p-2 border-t bg-gray-50">
                  <Button className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0">
                    <Info className="h-4 w-4 text-white" />
                  </Button>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <Button className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0">
                    {exam.status === "scheduled" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <FileText className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700"
        onClick={handleAddNew}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

