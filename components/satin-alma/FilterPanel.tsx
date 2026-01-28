"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import { MOCK_PURCHASE_REQUESTS } from "./mock-data"
import type { FilterState } from "./types"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  currentFilters: FilterState
}

export function FilterPanel({ isOpen, onClose, onApplyFilters, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    const defaultFilters: FilterState = {
      status: "all",
      requestType: "all",
      date: "",
      searchTerm: "",
      isForProject: "all",
    }
    setFilters(defaultFilters)
    onApplyFilters(defaultFilters)
    onClose()
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  if (!isOpen) return null

  const availableDates = Array.from(new Set(MOCK_PURCHASE_REQUESTS.map((request) => request.requestDate))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex flex-col h-full">
        <header className="flex items-center p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold ml-2">Filtreler</h1>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label>Talep Tarihi</Label>
              <Select value={filters.date} onValueChange={(value) => handleFilterChange("date", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tarih seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString("tr-TR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durum</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
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
              <Label>Talep Tipi</Label>
              <Select value={filters.requestType} onValueChange={(value) => handleFilterChange("requestType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Talep tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="internal">Kurum İçi</SelectItem>
                  <SelectItem value="contractor">Yüklenici</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Proje İçin mi?</Label>
              <Select value={filters.isForProject} onValueChange={(value) => handleFilterChange("isForProject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="yes">Evet</SelectItem>
                  <SelectItem value="no">Hayır</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Arama</Label>
              <Input
                placeholder="Talep no, firma veya proje ara..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Temizle
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Uygula
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

