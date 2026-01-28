"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe, MoreVertical, Filter, X, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RequestList } from "./personnel-request/request-list"
import { MOCK_REQUESTS } from "./personnel-request/mock-data"
import { NewRequestForm } from "./personnel-request/new-request-form"
import { RequestDetailScreen } from "./personnel-request/request-detail-screen"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CancelRequestModal } from "./personnel-request/cancel-request-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface PersonnelRequestProps {
  onBack: () => void
}

interface PersonnelRequest {
  id: string
  date: string
  status: string
  jobType: string
  company: string
  projectGroup: string
}

export function PersonnelRequestScreen({ onBack }: PersonnelRequestProps) {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    id: "",
  })
  const [selectedRequest, setSelectedRequest] = useState<PersonnelRequest | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    date: "",
    status: "",
    jobType: "",
    searchTerm: "",
  })

  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.sort((a, b) => {
      if (a.status === "approved" && b.status !== "approved") return -1
      if (b.status === "approved" && a.status !== "approved") return 1
      return 0
    }).filter((request) => {
      if (filterOptions.date && request.date !== filterOptions.date) return false
      if (filterOptions.status && request.status !== filterOptions.status) return false
      if (filterOptions.jobType && request.jobType !== filterOptions.jobType) return false
      if (
        filterOptions.searchTerm &&
        !request.id.includes(filterOptions.searchTerm) &&
        !request.company.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())
      )
        return false
      return true
    })
  }, [filterOptions])

  const cancelableRequests = useMemo(() => {
    return filteredRequests.filter(
      (request) => request.status === "pending" && selectedRequests.has(request.id),
    ) as PersonnelRequest[]
  }, [filteredRequests, selectedRequests])

  const handleSelectRequest = useCallback((id: string, checked: boolean) => {
    setSelectedRequests((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      setShowDeleteButton(newSet.size > 0)
      return newSet
    })
  }, [])

  const handleHistoryClick = (id: string) => {
    console.log("Show history for request:", id)
  }

  const handleInfoClick = (id: string) => {
    const request = MOCK_REQUESTS.find((r) => r.id === id)
    if (request) {
      setSelectedRequest(request)
    }
  }

  const handleDeleteAll = useCallback(() => {
    setSelectedRequests(new Set())
    setShowDeleteButton(false)
  }, [])

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRequests(new Set())
      setShowDeleteButton(false)
    } else {
      const allIds = new Set(filteredRequests.map((request) => request.id))
      setSelectedRequests(allIds)
      setShowDeleteButton(true)
    }
    setIsAllSelected(!isAllSelected)
  }, [isAllSelected, filteredRequests])

  const handleFilterClick = () => {
    setIsFilterOpen(true)
  }

  const canCancelRequests = useMemo(() => {
    return cancelableRequests.length > 0
  }, [cancelableRequests])

  const handleCancelRequests = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = (reason: string) => {
    // Update the MOCK_REQUESTS array directly
    MOCK_REQUESTS.forEach((request) => {
      if (selectedRequests.has(request.id) && request.status === "pending") {
        request.status = "cancelled"
      }
    })

    // Force a re-render by updating filterOptions
    setFilterOptions((prev) => ({ ...prev }))

    // Clear selections and close modal
    setSelectedRequests(new Set())
    setShowCancelModal(false)

    // Show toast notification
    toast({
      title: "Talepler İptal Edildi",
      description: `${cancelableRequests.length} adet talep başarıyla iptal edildi.`,
    })
  }

  if (showNewRequestForm) {
    return <NewRequestForm onBack={() => setShowNewRequestForm(false)} />
  }

  return (
    <div className="h-full flex flex-col bg-blue-50 relative">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center ml-4">
            <Globe className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
          </div>
        </div>
      </header>

      <div className="bg-blue-50 border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Personel Talepleri</h1>
        <div className="flex space-x-2">
          {!selectedRequest && (
            <>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSelectAll}>
                {isAllSelected ? "Seçimi Kaldır" : "Hepsini Seç"}
              </Button>
              <Button variant="outline" size="icon" onClick={handleFilterClick}>
                <Filter className="h-4 w-4" />
                {Object.values(filterOptions).filter(Boolean).length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full" />
                )}
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDeleteAll}>Tümünü Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedRequest ? (
        <RequestDetailScreen request={selectedRequest} onBack={() => setSelectedRequest(null)} />
      ) : (
        <>
          <div className="flex-grow overflow-auto">
            <ScrollArea className="h-full">
              <RequestList
                requests={filteredRequests}
                selectedRequests={selectedRequests}
                onSelectRequest={handleSelectRequest}
                expandedId={expandedId}
                onExpandedChange={setExpandedId}
                onHistoryClick={handleHistoryClick}
                onInfoClick={handleInfoClick}
                isAllSelected={isAllSelected}
              />
            </ScrollArea>
          </div>
          {canCancelRequests && (
            <div className="p-4 bg-white border-t">
              <Button onClick={handleCancelRequests} className="w-full bg-red-600 hover:bg-red-700 text-white">
                <X className="w-4 h-4 mr-2" />
                Talepten Vazgeç ({cancelableRequests.length})
              </Button>
            </div>
          )}
          {/* Replace the existing button with: */}
          <Button
            onClick={() => setShowNewRequestForm(true)}
            className="absolute bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            size="icon"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Yeni Personel Talebi</span>
          </Button>
        </>
      )}

      {/* Modal */}
      {showCancelModal && (
        <CancelRequestModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          selectedRequests={cancelableRequests}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out h-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Filtreler</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Select
                      value={filterOptions.date}
                      onValueChange={(value) => setFilterOptions((prev) => ({ ...prev, date: value }))}
                    >
                      <SelectTrigger id="date">
                        <SelectValue placeholder="Tarih seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {Array.from(new Set(MOCK_REQUESTS.map((r) => r.date))).map((date) => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Durum</Label>
                    <Select
                      value={filterOptions.status}
                      onValueChange={(value) => setFilterOptions((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="pending">Beklemede</SelectItem>
                        <SelectItem value="approved">Onaylandı</SelectItem>
                        <SelectItem value="rejected">Reddedildi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobType">İş Türü</Label>
                    <Select
                      value={filterOptions.jobType}
                      onValueChange={(value) => setFilterOptions((prev) => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder="İş türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {Array.from(new Set(MOCK_REQUESTS.map((r) => r.jobType))).map((jobType) => (
                          <SelectItem key={jobType} value={jobType}>
                            {jobType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="searchTerm">Arama</Label>
                    <Input
                      id="searchTerm"
                      placeholder="ID veya firma ara..."
                      value={filterOptions.searchTerm}
                      onChange={(e) => setFilterOptions((prev) => ({ ...prev, searchTerm: e.target.value }))}
                    />
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsFilterOpen(false)}>
                  Filtreleri Uygula
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}

