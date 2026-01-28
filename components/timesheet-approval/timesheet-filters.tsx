"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import type { DailyTimesheet } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface TimesheetFiltersProps {
  selectedDate: string
  approvalFilter: string
  selectedId: string
  onDateChange: (date: string) => void
  onFilterChange: (filter: string) => void
  onIdChange: (id: string) => void
  timesheets: DailyTimesheet[]
  searchTerm: string
  onSearchChange: (value: string) => void
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  startDate?: string
  endDate?: string
  onStartDateChange?: (date: string) => void
  onEndDateChange?: (date: string) => void
}

export function TimesheetFilters({
  selectedDate,
  approvalFilter,
  selectedId,
  onDateChange,
  onFilterChange,
  onIdChange,
  timesheets,
  searchTerm,
  onSearchChange,
  isOpen,
  onClose,
  onApply,
  startDate = "",
  endDate = "",
  onStartDateChange = () => {},
  onEndDateChange = () => {},
}: TimesheetFiltersProps) {
  const [filterType, setFilterType] = useState<"single" | "period">(startDate && endDate ? "period" : "single")

  // Get unique dates from timesheets and sort them
  const uniqueDates = [...new Set(timesheets.map((t) => t.date))].sort((a, b) => {
    const [dayA, monthA, yearA] = a.split(".").map(Number)
    const [dayB, monthB, yearB] = b.split(".").map(Number)

    if (yearA !== yearB) return yearA - yearB
    if (monthA !== monthB) return monthA - monthB
    return dayA - dayB
  })

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-hidden" style={{ display: isOpen ? "block" : "none" }}>
      <div className="flex flex-col h-full">
        <header className="flex items-center p-4 border-b bg-white">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Filtreler</h1>
        </header>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tarih Filtreleme Tipi</Label>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "single" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFilterType("single")}
                >
                  Tek Gün
                </Button>
                <Button
                  variant={filterType === "period" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFilterType("period")}
                >
                  Dönem
                </Button>
              </div>
            </div>

            {filterType === "single" ? (
              <div className="space-y-2">
                <Label>Günlük Puantaj</Label>
                <Select
                  value={selectedDate}
                  onValueChange={(value) => {
                    onDateChange(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="G. Puantaj Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_dates">Tümü</SelectItem>
                    {uniqueDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Başlangıç Tarihi</Label>
                  <Select value={startDate} onValueChange={onStartDateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Başlangıç Tarihi Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueDates.map((date) => (
                        <SelectItem key={`start-${date}`} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bitiş Tarihi</Label>
                  <Select value={endDate} onValueChange={onEndDateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bitiş Tarihi Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueDates.map((date) => (
                        <SelectItem key={`end-${date}`} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={approvalFilter}
                onValueChange={(value) => {
                  onFilterChange(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="pending">Onay Bekleyenler</SelectItem>
                  <SelectItem value="approved">Onaylananlar</SelectItem>
                  <SelectItem value="rejected">Reddedilenler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Puantaj ID</Label>
              <Input
                placeholder="Puantaj ID ile ara..."
                value={selectedId}
                onChange={(e) => onIdChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClose()
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>TCKN veya Ad Soyad</Label>
              <Input
                placeholder="TCKN, Ad Soyad..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClose()
                  }
                }}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onDateChange("all_dates")
                onFilterChange("all")
                onIdChange("")
                onSearchChange("")
                if (onStartDateChange) onStartDateChange("")
                if (onEndDateChange) onEndDateChange("")
                setFilterType("single")
                onClose()
              }}
            >
              Temizle
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onApply}>
              Uygula
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

