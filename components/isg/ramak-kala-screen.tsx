"use client"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, User, MapPin, Plus, Info, Shield } from "lucide-react"

// Add status props to the component definition
interface RamakKalaScreenProps {
  onBack: () => void
  status: string
  onStatusChange: (status: string) => void
}

// Update the component to use the status props
export function RamakKalaScreen({ onBack, status, onStatusChange }: RamakKalaScreenProps) {
  // Mock veri yapısına firma, proje grubu ve proje lokasyonu bilgilerini ekleyelim
  const nearMisses = [
    {
      id: 1,
      title: "Asansör Arızası",
      date: "14 Mayıs 2024",
      location: "B Blok - Asansör 2",
      reportedBy: "Emre Şahin",
      status: "reviewed",
      riskLevel: "high",
      company: "ABC İnşaat A.Ş.",
      projectGroup: "Konut Projeleri",
      projectLocation: "İstanbul / Kadıköy",
    },
    {
      id: 2,
      title: "Kaygan Zemin",
      date: "10 Mayıs 2024",
      location: "Ana Koridor - Kat 1",
      reportedBy: "Zeynep Kara",
      status: "pending",
      riskLevel: "medium",
      company: "XYZ Yapı Ltd.",
      projectGroup: "Altyapı Projeleri",
      projectLocation: "Ankara / Çankaya",
    },
    {
      id: 3,
      title: "Elektrik Kablosu Açıkta",
      date: "5 Mayıs 2024",
      location: "Toplantı Salonu C",
      reportedBy: "Ali Yıldız",
      status: "action-taken",
      riskLevel: "medium",
      company: "DEF Mühendislik",
      projectGroup: "Endüstriyel Projeler",
      projectLocation: "İzmir / Bornova",
    },
    {
      id: 4,
      title: "Düşmeye Meyilli Malzeme İstifleme",
      date: "28 Nisan 2024",
      location: "Depo - Raf B5",
      reportedBy: "Selin Demir",
      status: "closed",
      riskLevel: "high",
      company: "GHI Holding",
      projectGroup: "Ticari Projeler",
      projectLocation: "Bursa / Nilüfer",
    },
  ]

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <Badge variant="destructive">Yüksek Risk</Badge>
      case "medium":
        return <Badge variant="warning">Orta Risk</Badge>
      case "low":
        return <Badge variant="outline">Düşük Risk</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            İnceleme Bekliyor
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            İncelendi
          </Badge>
        )
      case "action-taken":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Önlem Alındı
          </Badge>
        )
      case "closed":
        return <Badge variant="success">Kapatıldı</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const handleAddNew = () => {
    // Add functionality for adding a new near miss
    console.log("Add new near miss")
    // This would typically open a form or modal
  }

  // Add a function to update status when needed
  const updateStatus = (newStatus: string) => {
    onStatusChange(newStatus)
  }

  // Add status controls in the UI where appropriate
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title="Ramak Kala Listesi"
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
          {nearMisses.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Kart içeriğine firma, proje grubu ve proje lokasyonu bilgilerini ekleyelim */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {getRiskLevelBadge(item.riskLevel)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>Bildiren: {item.reportedBy}</span>
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
                          className="mr-2 text-yellow-600"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">{item.company}</span>
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
                          className="mr-2 text-yellow-600"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span className="text-xs">
                          {item.projectGroup} - {item.projectLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm">Durum:</span>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="flex justify-around items-center p-2 border-t bg-gray-50">
                  <Button className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0">
                    <Info className="h-4 w-4 text-white" />
                  </Button>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <Button className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0">
                    <Shield className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-yellow-600 hover:bg-yellow-700"
        onClick={handleAddNew}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

