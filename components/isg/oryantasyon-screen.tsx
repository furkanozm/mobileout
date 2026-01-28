"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, Plus, Info, Filter, X } from "lucide-react"
import { useState } from "react"
import { OryantasyonFormScreen } from "./oryantasyon-form-screen"
import { OryantasyonDetailScreen } from "./oryantasyon-detail-screen"
import { OryantasyonParticipantsScreen } from "./oryantasyon-participants-screen"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Add status props to the component definition
interface OryantasyonScreenProps {
  onBack: () => void
  status: string
  onStatusChange: (status: string) => void
}

// Update the component to use the status props
export function OryantasyonScreen({ onBack, status, onStatusChange }: OryantasyonScreenProps) {
  // Mock data for orientation trainings
  const trainings = [
    {
      id: 1,
      title: "Yeni Personel Oryantasyonu",
      date: "20 Mayıs 2024",
      time: "09:00 - 11:00",
      location: "Eğitim Salonu A",
      participants: 15,
      status: "upcoming",
      documents: 4,
      company: "ABC Holding",
      projectGroup: "İnşaat Projeleri",
      project: "İstanbul Rezidans",
      trainer: "Ahmet Yılmaz",
      photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    },
    {
      id: 2,
      title: "Saha Çalışanları Oryantasyonu",
      date: "12 Mayıs 2024",
      time: "13:30 - 15:30",
      location: "Saha Ofisi",
      participants: 8,
      status: "completed",
      documents: 3,
      company: "XYZ İnşaat",
      projectGroup: "Altyapı Projeleri",
      project: "Ankara Metro",
      trainer: "Mehmet Kaya",
      photos: ["/placeholder.svg?height=300&width=400"],
    },
    {
      id: 3,
      title: "Ofis Çalışanları Oryantasyonu",
      date: "5 Mayıs 2024",
      time: "10:00 - 12:00",
      location: "Ana Toplantı Salonu",
      participants: 12,
      status: "completed",
      documents: 2,
      company: "123 Sanayi",
      projectGroup: "Üretim Projeleri",
      project: "Fabrika Genişletme",
      trainer: "Ayşe Demir",
      photos: [],
    },
  ]

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<(typeof trainings)[0] | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: [] as string[],
    company: [] as string[],
    projectGroup: [] as string[],
  })

  // Extract unique values for filters
  const companies = [...new Set(trainings.map((t) => t.company))]
  const projectGroups = [...new Set(trainings.map((t) => t.projectGroup))]

  const handleAddNew = () => {
    setSelectedTraining(null)
    setShowForm(true)
  }

  const handleViewDetails = (training: (typeof trainings)[0]) => {
    setSelectedTraining(training)
    setShowDetail(true)
  }

  const handleViewParticipants = (training: (typeof trainings)[0]) => {
    setSelectedTraining(training)
    setShowParticipants(true)
  }

  const handleBackToList = () => {
    setShowForm(false)
    setShowDetail(false)
    setShowParticipants(false)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const handleFilterChange = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters((prev) => {
      if (category === "searchQuery") {
        return { ...prev, searchQuery: value }
      } else {
        const currentValues = [...prev[category]]
        if (checked) {
          currentValues.push(value)
        } else {
          const index = currentValues.indexOf(value)
          if (index !== -1) {
            currentValues.splice(index, 1)
          }
        }
        return { ...prev, [category]: currentValues }
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      status: [],
      company: [],
      projectGroup: [],
    })
  }

  // Filter trainings based on selected filters
  const filteredTrainings = trainings.filter((training) => {
    // Search query filter
    if (filters.searchQuery && !training.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(training.status)) {
      return false
    }

    // Company filter
    if (filters.company.length > 0 && !filters.company.includes(training.company)) {
      return false
    }

    // Project group filter
    if (filters.projectGroup.length > 0 && !filters.projectGroup.includes(training.projectGroup)) {
      return false
    }

    return true
  })

  // Custom header with filter button
  const CustomHeader = () => (
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <div className="flex items-center">
        <button onClick={onBack} className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Oryantasyon Eğitimleri</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  )

  // Add a function to update status when needed
  const updateStatus = (newStatus: string) => {
    onStatusChange(newStatus)
  }

  if (showForm) {
    return <OryantasyonFormScreen onBack={handleBackToList} training={selectedTraining} />
  }

  if (showDetail && selectedTraining) {
    return <OryantasyonDetailScreen onBack={handleBackToList} training={selectedTraining} />
  }

  if (showParticipants && selectedTraining) {
    return <OryantasyonParticipantsScreen onBack={handleBackToList} training={selectedTraining} />
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Custom header with filter button */}
      {/* Custom header with filter button */}
      <div className="flex items-center justify-between bg-white p-4 border-b">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Oryantasyon Eğitimleri</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-3 mt-4">
          {filteredTrainings.length > 0 ? (
            filteredTrainings.map((training) => (
              <Card key={training.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{training.title}</h3>
                      <Badge variant={training.status === "completed" ? "success" : "outline"}>
                        {training.status === "completed" ? "Tamamlandı" : "Planlandı"}
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
                          className="h-4 w-4 mr-2 text-blue-600"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>{training.company}</span>
                      </div>
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
                          className="h-4 w-4 mr-2 text-blue-600"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span>
                          {training.projectGroup} - {training.project}
                        </span>
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">Sonuç Bulunamadı</h3>
              <p className="text-sm text-gray-500 mt-1">Filtreleri değiştirerek tekrar deneyin.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Filter Sidebar - Now contained within the phone screen */}
      <div
        className={`absolute inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      >
        <div
          className={`absolute top-0 right-0 bottom-0 w-[50%] max-w-[180px] bg-white shadow-xl transition-transform duration-300 ease-out ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-base">Filtreler</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={toggleSidebar}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-3">
              {/* Search */}
              <div className="mb-4">
                <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">
                  Ara
                </Label>
                <Input
                  id="search"
                  placeholder="Eğitim adı ara..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value, true)}
                  className="text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <Label className="text-sm font-medium mb-1.5 block">Durum</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-completed"
                      checked={filters.status.includes("completed")}
                      onCheckedChange={(checked) => handleFilterChange("status", "completed", checked === true)}
                    />
                    <Label htmlFor="status-completed" className="text-sm">
                      Tamamlandı
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-upcoming"
                      checked={filters.status.includes("upcoming")}
                      onCheckedChange={(checked) => handleFilterChange("status", "upcoming", checked === true)}
                    />
                    <Label htmlFor="status-upcoming" className="text-sm">
                      Planlandı
                    </Label>
                  </div>
                </div>
              </div>

              {/* Company Filter */}
              <div className="mb-4">
                <Label className="text-sm font-medium mb-1.5 block">Firma</Label>
                <div className="space-y-2">
                  {companies.map((company) => (
                    <div key={company} className="flex items-center space-x-2">
                      <Checkbox
                        id={`company-${company}`}
                        checked={filters.company.includes(company)}
                        onCheckedChange={(checked) => handleFilterChange("company", company, checked === true)}
                      />
                      <Label htmlFor={`company-${company}`} className="text-sm">
                        {company}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Group Filter */}
              <div className="mb-4">
                <Label className="text-sm font-medium mb-1.5 block">Proje Grubu</Label>
                <div className="space-y-2">
                  {projectGroups.map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group}`}
                        checked={filters.projectGroup.includes(group)}
                        onCheckedChange={(checked) => handleFilterChange("projectGroup", group, checked === true)}
                      />
                      <Label htmlFor={`group-${group}`} className="text-sm">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="p-3 border-t">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-1 h-auto" onClick={toggleSidebar}>
                Uygula
              </Button>
              <Button variant="outline" className="w-full mt-2 text-sm py-1 h-auto" onClick={clearFilters}>
                Temizle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handleAddNew}
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}

