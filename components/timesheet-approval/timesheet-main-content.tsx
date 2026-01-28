"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, X, Check } from "lucide-react"
import { useState } from "react"
import { TimesheetList } from "./timesheet-list"

interface TimesheetMainContentProps {
  filteredTimesheets: any[]
  selectedTimesheets: Set<string>
  setSelectedTimesheets: (value: Set<string>) => void
  selectedEntries: Set<string>
  setSelectedEntries: (value: Set<string>) => void
  allSelected: boolean
  setAllSelected: (value: boolean) => void
  onSelectTimesheet: (id: string, checked: boolean) => void
  onSelectEntry: (id: string, checked: boolean) => void
  getApprovalStatus: (id: string) => string
  getRejectionReason: (id: string) => string
  onChangelogClick: (id: string) => void
  expandedId: string | null
  onExpandedChange: (id: string | null) => void
  onApproveTimesheet: (id: string) => void
  onRejectTimesheet: (id: string) => void
  showActionAlert: boolean
  actionType: "approved" | "rejected" | null
  onDetailView: (id: string) => void
  onPersonnelListClick: (timesheetId: string) => void
}

export function TimesheetMainContent({
  filteredTimesheets,
  selectedTimesheets,
  setSelectedTimesheets,
  selectedEntries,
  setSelectedEntries,
  allSelected,
  setAllSelected,
  onSelectTimesheet,
  onSelectEntry,
  getApprovalStatus,
  getRejectionReason,
  onChangelogClick,
  expandedId,
  onExpandedChange,
  onApproveTimesheet,
  onRejectTimesheet,
  showActionAlert,
  actionType,
  onDetailView,
  onPersonnelListClick,
}: TimesheetMainContentProps) {
  const [showPersonnelList, setShowPersonnelList] = useState(false)
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error" | null>(null)

  const handlePersonnelListClick = (timesheetId: string) => {
    setShowPersonnelList(true)
    setSelectedTimesheetId(timesheetId)
    const index = filteredTimesheets.findIndex((t) => t.id === timesheetId)
    if (index !== -1) {
      setCurrentIndex(index)
    }
    onPersonnelListClick(timesheetId)
  }

  const handleBack = () => {
    setShowPersonnelList(false)
    setSelectedTimesheetId(null)
  }

  const showToast = (message: string, type: "success" | "error") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
      setNotificationType(null)
    }, 3000)
  }

  const moveToNextTimesheet = () => {
    if (currentIndex < filteredTimesheets.length - 1) {
      const nextTimesheet = filteredTimesheets[currentIndex + 1]
      setCurrentIndex(currentIndex + 1)
      setSelectedTimesheetId(nextTimesheet.id)
    } else {
      handleBack()
    }
  }

  const handleApprove = async () => {
    if (!selectedTimesheetId) return

    try {
      await onApproveTimesheet(selectedTimesheetId)
      showToast("Puantaj başarıyla onaylandı", "success")
      setSelectedTimesheets((prev) => {
        const newSet = new Set(prev)
        newSet.delete(selectedTimesheetId)
        return newSet
      })
      moveToNextTimesheet()
    } catch (error) {
      showToast("Puantaj onaylanırken bir hata oluştu", "error")
    }
  }

  const handleReject = async () => {
    if (!selectedTimesheetId) return

    try {
      await onRejectTimesheet(selectedTimesheetId)
      showToast("Puantaj reddedildi", "success")
      setSelectedTimesheets((prev) => {
        const newSet = new Set(prev)
        newSet.delete(selectedTimesheetId)
        return newSet
      })
      moveToNextTimesheet()
    } catch (error) {
      showToast("Puantaj reddedilirken bir hata oluştu", "error")
    }
  }

  const remainingTimesheets = filteredTimesheets.length - (currentIndex + 1)

  if (showPersonnelList && selectedTimesheetId) {
    const selectedTimesheet = filteredTimesheets.find((t) => t.id === selectedTimesheetId)
    if (!selectedTimesheet) return null

    return (
      <div className="flex flex-col h-full bg-white relative">
        {/* Black Notification Toast */}
        {showNotification && (
          <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notificationType === "success" ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <X className="h-5 w-5 text-red-400" />
                )}
                <span>{notificationMessage}</span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1">
          {/* Personnel List View */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col h-full">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-3 border-b w-full hover:bg-gray-50 transition-colors text-left"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="font-medium">Personel Listesi</span>
              </button>

              <div className="px-4">
                {selectedTimesheet.personnel?.map((person: any) => (
                  <div key={person.id} className="py-4 border-b">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{person.name}</div>
                      <div className="text-green-500 font-medium">{person.hours * person.wage}₺</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">TCKN: {person.tckn || "12345678901"}</div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-600">
                        {person.hours} saat x {person.wage}₺
                      </div>
                    </div>
                    <Button variant="link" className="h-8 px-0 text-blue-600 font-normal">
                      Sulama
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <TimesheetList
        timesheets={filteredTimesheets}
        selectedTimesheets={selectedTimesheets}
        selectedEntries={selectedEntries}
        onSelectTimesheet={onSelectTimesheet}
        onSelectEntry={onSelectEntry}
        getApprovalStatus={getApprovalStatus}
        getRejectionReason={getRejectionReason}
        onChangelogClick={onChangelogClick}
        expandedId={expandedId}
        onExpandedChange={onExpandedChange}
        onApproveTimesheet={onApproveTimesheet}
        onDetailView={onDetailView}
        onPersonnelListClick={handlePersonnelListClick}
      />
    </div>
  )
}

