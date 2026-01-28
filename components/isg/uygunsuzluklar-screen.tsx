"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, User, MapPin, Plus, Info, AlertTriangle } from "lucide-react"
import { UygunsuzlukFormScreen } from "./uygunsuzluk-form-screen"
import { UygunsuzlukDetailScreen } from "./uygunsuzluk-detail-screen"

interface UygunsuzluklarScreenProps {
  onBack: () => void
}

export function UygunsuzluklarScreen({ onBack }: UygunsuzluklarScreenProps) {
  const [view, setView] = useState<"list" | "form" | "detail">("list")
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Mock data for non-conformities
  const nonConformities = [
    {
      id: 1,
      title: "Eksik Kişisel Koruyucu Donanım",
      date: "12 Mayıs 2024",
      location: "İnşaat Alanı - Blok C",
      reportedBy: "Ahmet Yılmaz",
      status: "open",
      priority: "high",
      company: "ABC İnşaat A.Ş.",
      projectGroup: "Konut Projeleri",
      projectLocation: "İstanbul / Kadıköy",
    },
    {
      id: 2,
      title: "Uyarı İşaretleri Eksikliği",
      date: "5 Mayıs 2024",
      location: "Depo Girişi",
      reportedBy: "Mehmet Kaya",
      status: "in-progress",
      priority: "medium",
      company: "XYZ Yapı Ltd.",
      projectGroup: "Altyapı Projeleri",
      projectLocation: "Ankara / Çankaya",
    },
    {
      id: 3,
      title: "Yangın Söndürücü Kontrolü Yapılmamış",
      date: "28 Nisan 2024",
      location: "Ofis Katı - Kat 3",
      reportedBy: "Ayşe Demir",
      status: "resolved",
      priority: "medium",
      company: "DEF Mühendislik",
      projectGroup: "Endüstriyel Projeler",
      projectLocation: "İzmir / Bornova",
    },
    {
      id: 4,
      title: "Acil Çıkış Yolu Engelli",
      date: "20 Nisan 2024",
      location: "Üretim Alanı - Kat 1",
      reportedBy: "Can Öztürk",
      status: "resolved",
      priority: "high",
      company: "GHI Holding",
      projectGroup: "Ticari Projeler",
      projectLocation: "Bursa / Nilüfer",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek Öncelik</Badge>
      case "medium":
        return <Badge variant="warning">Orta Öncelik</Badge>
      case "low":
        return <Badge variant="outline">Düşük Öncelik</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Açık
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            İşlemde
          </Badge>
        )
      case "resolved":
        return <Badge variant="success">Çözüldü</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  const handleAddNew = () => {
    setView("form")
  }

  const handleViewDetail = (id: number) => {
    setSelectedId(id)
    setView("detail")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedId(null)
  }

  if (view === "form") {
    return <UygunsuzlukFormScreen onBack={handleBackToList} />
  }

  if (view === "detail") {
    return <UygunsuzlukDetailScreen onBack={handleBackToList} />
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title="Uygunsuzluklar"
        onBackClick={onBack}
        rightContent={
          <div className="flex space-x-2">
            <select className="text-sm rounded border-gray-200" defaultValue="all">
              <option value="all">Tümü</option>
              <option value="open">Açık</option>
              <option value="in-progress">İşlemde</option>
              <option value="resolved">Çözüldü</option>
            </select>
          </div>
        }
      />

      <ScrollArea className="flex-1 px-4 pb-0">
        <div className="space-y-3 mt-4 min-h-[calc(100vh-180px)]">
          {nonConformities.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
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
                          className="mr-2 text-blue-600"
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
                          className="mr-2 text-blue-600"
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
                    <span className="text-sm text-gray-700">Durum:</span>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="flex justify-around items-center p-2 border-t bg-gray-50">
                  <Button
                    className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0"
                    onClick={() => handleViewDetail(item.id)}
                  >
                    <Info className="h-4 w-4 text-white" />
                  </Button>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <Button className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0">
                    <AlertTriangle className="h-4 w-4 text-white" />
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

