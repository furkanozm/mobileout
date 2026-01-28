"use client"

import { TimesheetListItem } from "./timesheet-list-item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { IOSPopup } from "@/components/shared/ios-popup"

interface BulkActionCardProps {
  selectedCount: number
  personnel: number
  dailyWage: number
  days: number
  workTypes: Array<{
    name: string
    personCount: number
    days: number
    cost: number
  }>
  personnelCost: number
  totalCost: number
  onApprove: () => void
  onReject: () => void
}

function BulkActionCard({
  selectedCount,
  personnel,
  dailyWage,
  days,
  workTypes,
  personnelCost,
  totalCost,
  onApprove,
  onReject,
}: BulkActionCardProps) {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)

  const handleDownloadClick = () => {
    setShowDownloadConfirm(true)
  }

  const handleConfirmDownload = () => {
    setShowDownloadConfirm(false)
    setShowEmailSent(true)
    setTimeout(() => {
      setShowEmailSent(false)
    }, 2000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-blue-600 font-medium">Seçilen Puantaj Özeti</h3>
        <Badge variant="outline" className="text-xs">
          {selectedCount} Seçili
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 bg-blue-50 p-3 rounded-lg">
        <div>
          <span className="text-blue-600 text-xs block mb-1">Personel:</span>
          <span className="font-medium">{personnel}</span>
        </div>
        <div>
          <span className="text-blue-600 text-xs block mb-1">Yevmiye:</span>
          <span className="font-medium">{dailyWage}</span>
        </div>
        <div>
          <span className="text-blue-600 text-xs block mb-1">Gün:</span>
          <span className="font-medium">{days}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-blue-600 text-xs font-medium mb-2">Yapılan İşçilikler</h4>
        <div className="space-y-2">
          {workTypes.map((work, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{work.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">
                  {work.personCount} kişi {work.days} yev.
                </span>
                <span className="font-medium">{work.cost.toFixed(2)}₺</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-blue-600 text-xs">Personel Hakediş:</span>{" "}
          <span className="font-medium">{personnelCost.toFixed(2)}₺</span>
        </div>
        <div>
          <span className="text-blue-600 text-xs">Toplam Mal.:</span>{" "}
          <Badge variant="success" className="ml-1">
            {totalCost.toFixed(2)}₺
          </Badge>
        </div>
      </div>

      {/* Download Report Button */}
      <Button
        variant="outline"
        className="w-full text-sm font-medium text-blue-600 border-blue-200 hover:bg-blue-50 mb-4"
        onClick={handleDownloadClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Maliyet Raporu İndir
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="destructive" className="w-full" onClick={onReject}>
          {selectedCount} Adet Reddet
        </Button>
        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={onApprove}>
          {selectedCount} Adet Onayla
        </Button>
      </div>

      <IOSPopup
        isOpen={showDownloadConfirm}
        onClose={() => setShowDownloadConfirm(false)}
        message="Onayda bekleyen tüm günlük puantaj için detaylı maliyet raporu indirmek ister misin?"
        confirmText="Evet"
        cancelText="Hayır"
        onConfirm={handleConfirmDownload}
      />

      <IOSPopup
        isOpen={showEmailSent}
        onClose={() => setShowEmailSent(false)}
        message="Rapor mail adresinize gönderilecek"
        confirmText="Tamam"
      />
    </div>
  )
}

interface TimesheetListProps {
  timesheets: Array<{
    id: string
    date: string
    projectId?: string
    projectGroup?: string
    project?: string
    company?: string
    personnel?: Array<{
      id: string
      name: string
      laborType: string
      additionalLaborType?: string // Add this new field
      hours: number
      task?: string
      wage?: number
    }>
    totalHours?: number
    cost?: number
    status?: "pending" | "approved" | "rejected"
    laborTypes?: string[] // Add this to track all labor types
  }>
  selectedItems: Set<string>
  onToggleSelection: (id: string) => void
  onSelectAll: () => void
  onShowPersonnelList: (id: string) => void
  getApprovalStatus: (id: string) => "pending" | "approved" | "rejected"
  pendingCount: number
  approvedCount: number
  onApproveSelected: () => void
  onRejectSelected: () => void
  personnel: number
  dailyWage: number
  days: number
  workTypes: Array<{
    name: string
    personCount: number
    days: number
    cost: number
  }>
  personnelCost: number
  totalCost: number
}

export function TimesheetList({
  timesheets = [],
  selectedItems,
  onToggleSelection,
  onSelectAll,
  onShowPersonnelList,
  getApprovalStatus,
  pendingCount,
  approvedCount,
  onApproveSelected,
  onRejectSelected,
  personnel,
  dailyWage,
  days,
  workTypes,
  personnelCost,
  totalCost,
}: TimesheetListProps) {
  const [activeFilter, setActiveFilter] = useState<"pending" | "approved" | "all">("pending")
  const [filteredTimesheets, setFilteredTimesheets] = useState(timesheets)

  useEffect(() => {
    // Filter timesheets based on active filter
    let filtered = timesheets

    if (activeFilter === "pending") {
      filtered = timesheets.filter((timesheet) => getApprovalStatus(timesheet.id) === "pending")
    } else if (activeFilter === "approved") {
      filtered = timesheets.filter((timesheet) => getApprovalStatus(timesheet.id) === "approved")
    }

    setFilteredTimesheets(filtered)
  }, [timesheets, getApprovalStatus, activeFilter])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-50 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={activeFilter === "pending" ? "default" : "warning"}
                className={cn(
                  "text-xs cursor-pointer transition-all",
                  activeFilter === "pending" && "bg-yellow-600 hover:bg-yellow-700 text-white",
                )}
                onClick={() => setActiveFilter("pending")}
              >
                {pendingCount} Bekleyen
              </Badge>
              <Badge
                variant={activeFilter === "approved" ? "default" : "success"}
                className={cn(
                  "text-xs cursor-pointer transition-all",
                  activeFilter === "approved" && "bg-green-600 hover:bg-green-700 text-white",
                )}
                onClick={() => setActiveFilter("approved")}
              >
                {approvedCount} Onaylı
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className={cn("text-xs ml-auto", selectedItems.size === filteredTimesheets.length && "text-blue-600")}
          >
            {selectedItems.size === filteredTimesheets.length && filteredTimesheets.length > 0
              ? "Tümünü Kaldır"
              : "Tümünü Seç"}
          </Button>
        </div>
      </div>

      {/* Timesheet List */}
      <div className="flex-1 overflow-auto divide-y">
        {filteredTimesheets.map((timesheet, index) => (
          <TimesheetListItem
            key={timesheet.id}
            timesheet={timesheet}
            index={index}
            isSelected={selectedItems.has(timesheet.id)}
            approvalStatus={getApprovalStatus(timesheet.id)}
            onToggleSelection={onToggleSelection}
            onShowPersonnelList={onShowPersonnelList}
          />
        ))}
      </div>

      {selectedItems.size > 0 && (
        <BulkActionCard
          selectedCount={selectedItems.size}
          personnel={personnel}
          dailyWage={dailyWage}
          days={days}
          workTypes={workTypes}
          personnelCost={personnelCost}
          totalCost={totalCost}
          onApprove={onApproveSelected}
          onReject={onRejectSelected}
        />
      )}
    </div>
  )
}

