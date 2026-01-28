"use client"
import { useState, useEffect, memo } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge-extended"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, AlertTriangle, Plus, Info, FileText } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface KazalarScreenProps {
  onBack: () => void
  status: string
  onStatusChange: (status: string) => void
  onViewDetail?: (id: number) => void
  onAddNew?: () => void
  accidents: Array<{
    id: number
    title: string
    date: string
    time: string
    location: string
    severity: string
    status: string
    description: string
    company: string
    projectGroup: string
    projectLocation: string
  }>
}

// Mock veri yapısına firma, proje grubu ve proje lokasyonu bilgilerini ekleyelim
const accidents = [
  {
    id: 1,
    title: "Kayma Kazası",
    date: "14 Mayıs 2024",
    time: "14:30",
    location: "Üretim Alanı - Kat 2",
    severity: "high",
    status: "open",
    description: "Islak zeminde kayma sonucu hafif yaralanma.",
    company: "ABC İnşaat A.Ş.",
    projectGroup: "Konut Projeleri",
    projectLocation: "İstanbul / Kadıköy",
  },
  {
    id: 2,
    title: "Elektrik Çarpması",
    date: "10 Mayıs 2024",
    time: "11:15",
    location: "Elektrik Panosu",
    severity: "medium",
    status: "investigated",
    description: "Elektrik panosunda çalışma sırasında hafif elektrik çarpması.",
    company: "XYZ Yapı Ltd.",
    projectGroup: "Altyapı Projeleri",
    projectLocation: "Ankara / Çankaya",
  },
  {
    id: 3,
    title: "Malzeme Düşmesi",
    date: "5 Mayıs 2024",
    time: "09:45",
    location: "İnşaat Alanı - Blok B",
    severity: "low",
    status: "closed",
    description: "Yüksekten malzeme düşmesi, yaralanma olmadı.",
    company: "DEF Mühendislik",
    projectGroup: "Endüstriyel Projeler",
    projectLocation: "İzmir / Bornova",
  },
  {
    id: 4,
    title: "Yangın Başlangıcı",
    date: "28 Nisan 2024",
    time: "16:30",
    location: "Depo Alanı",
    severity: "high",
    status: "closed",
    description: "Elektrik kontağından kaynaklı küçük yangın başlangıcı, hızlı müdahale ile söndürüldü.",
    company: "GHI Holding",
    projectGroup: "Ticari Projeler",
    projectLocation: "Bursa / Nilüfer",
  },
]

// Memoize the filter sidebar to prevent unnecessary re-renders
const KazaFilterSidebar = memo(
  ({
    onClose,
    initialFilters,
    onApplyFilters,
  }: {
    onClose: () => void
    initialFilters: {
      dateStart: string
      dateEnd: string
      severity: string[]
      status: string[]
      location: string
    }
    onApplyFilters: (filters: any) => void
  }) => {
    // Create a local state that doesn't depend on props for updates
    const [localFilters, setLocalFilters] = useState({
      dateStart: initialFilters.dateStart || "",
      dateEnd: initialFilters.dateEnd || "",
      severity: [...(initialFilters.severity || [])],
      status: [...(initialFilters.status || [])],
      location: initialFilters.location || "",
    })

    // Update local filters when initialFilters change
    useEffect(() => {
      setLocalFilters({
        dateStart: initialFilters.dateStart || "",
        dateEnd: initialFilters.dateEnd || "",
        severity: [...(initialFilters.severity || [])],
        status: [...(initialFilters.status || [])],
        location: initialFilters.location || "",
      })
    }, [initialFilters])

    const handleCheckboxChange = (category: "severity" | "status", value: string) => {
      setLocalFilters((prev) => {
        const current = [...prev[category]]
        if (current.includes(value)) {
          return { ...prev, [category]: current.filter((v) => v !== value) }
        } else {
          return { ...prev, [category]: [...current, value] }
        }
      })
    }

    const handleApply = () => {
      onApplyFilters(localFilters)
      onClose()
    }

    const handleClear = () => {
      const clearedFilters = {
        dateStart: "",
        dateEnd: "",
        severity: [],
        status: [],
        location: "",
      }
      setLocalFilters(clearedFilters)
      onApplyFilters(clearedFilters)
      onClose()
    }

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Filtrele</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Tarih Aralığı</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-500">Başlangıç</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 mt-1"
                    value={localFilters.dateStart}
                    onChange={(e) => setLocalFilters({ ...localFilters, dateStart: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Bitiş</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 mt-1"
                    value={localFilters.dateEnd}
                    onChange={(e) => setLocalFilters({ ...localFilters, dateEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Risk Seviyesi</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.severity.includes("high")}
                    onChange={() => handleCheckboxChange("severity", "high")}
                  />
                  <span>Yüksek Risk</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.severity.includes("medium")}
                    onChange={() => handleCheckboxChange("severity", "medium")}
                  />
                  <span>Orta Risk</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.severity.includes("low")}
                    onChange={() => handleCheckboxChange("severity", "low")}
                  />
                  <span>Düşük Risk</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Durum</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.status.includes("open")}
                    onChange={() => handleCheckboxChange("status", "open")}
                  />
                  <span>Açık</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.status.includes("investigated")}
                    onChange={() => handleCheckboxChange("status", "investigated")}
                  />
                  <span>İncelendi</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={localFilters.status.includes("closed")}
                    onChange={() => handleCheckboxChange("status", "closed")}
                  />
                  <span>Kapatıldı</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Lokasyon</h3>
              <input
                type="text"
                placeholder="Lokasyon ara..."
                className="w-full border rounded p-2"
                value={localFilters.location}
                onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleClear}>
              Temizle
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
              Uygula
            </Button>
          </div>
        </div>
      </div>
    )
  },
)

// Add display name for the memoized component
KazaFilterSidebar.displayName = "KazaFilterSidebar"

export function KazalarScreen({
  onBack,
  status,
  onStatusChange,
  onViewDetail = () => {},
  onAddNew = () => {},
  accidents = accidents, // Provide a default empty array
}: KazalarScreenProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateStart: "",
    dateEnd: "",
    severity: [] as string[],
    status: [] as string[],
    location: "",
  })

  // Apply filters to accidents
  const filteredAccidents = accidents.filter((accident) => {
    // Filter by date range
    if (filters.dateStart && new Date(accident.date) < new Date(filters.dateStart)) {
      return false
    }
    if (filters.dateEnd && new Date(accident.date) > new Date(filters.dateEnd)) {
      return false
    }

    // Filter by severity
    if (filters.severity.length > 0 && !filters.severity.includes(accident.severity)) {
      return false
    }

    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(accident.status)) {
      return false
    }

    // Filter by location
    if (filters.location && !accident.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    return true
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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
      case "investigated":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            İncelendi
          </Badge>
        )
      case "closed":
        return <Badge variant="success">Kapatıldı</Badge>
      case "open":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Açık
          </Badge>
        )
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title="Kazalar"
        onBackClick={onBack}
        rightContent={
          <Button variant="ghost" size="icon" onClick={() => setFilterOpen(true)} className="text-gray-600">
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
          {filteredAccidents.length > 0 ? (
            filteredAccidents.map((accident) => (
              <Card key={accident.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{accident.title}</h3>
                      {getSeverityBadge(accident.severity)}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{accident.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{accident.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{accident.location}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{accident.description}</span>
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
                          <span className="text-xs">{accident.company}</span>
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
                            {accident.projectGroup} - {accident.projectLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm">Durum:</span>
                      {getStatusBadge(accident.status)}
                    </div>
                  </div>

                  <div className="flex justify-around items-center p-2 border-t bg-gray-50">
                    <Button
                      className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0"
                      onClick={() => onViewDetail(accident.id)}
                    >
                      <Info className="h-4 w-4 text-white" />
                    </Button>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <Button
                      className="rounded-full w-9 h-9 bg-blue-600 hover:bg-blue-700 p-0"
                      onClick={() => window.alert(`Kaza raporu görüntüleniyor: ${accident.title}`)}
                    >
                      <FileText className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Filtrelere uygun kaza kaydı bulunamadı.</p>
              <Button
                variant="link"
                className="mt-2 text-blue-600"
                onClick={() =>
                  setFilters({
                    dateStart: "",
                    dateEnd: "",
                    severity: [],
                    status: [],
                    location: "",
                  })
                }
              >
                Filtreleri temizle
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        onClick={onAddNew}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Filter Sidebar */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
          <KazaFilterSidebar
            onClose={() => setFilterOpen(false)}
            initialFilters={filters}
            onApplyFilters={setFilters}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

