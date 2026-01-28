"use client"

import type React from "react"

import { cn } from "@/lib/utils"

import { useState, useEffect, useMemo } from "react"
import { useTimesheetState } from "./use-timesheet-state"
import { TimesheetCard } from "./timesheet-card"
import { TimesheetAlerts } from "./timesheet-alerts"
import { ChangelogPage } from "./changelog-page"
import { REJECTION_REASONS } from "./constants"
import { ApprovalNotification } from "./approval-notification"
import { TimesheetFilters } from "./timesheet-filters"
import { useRouter } from "next/navigation"
import { PersonnelListScreen } from "./personnel-list-screen"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Import our new components
import { TimesheetHeader } from "./header"
import { QuickApprovalControls } from "./quick-approval-controls"
import { TimesheetListItem } from "./timesheet-list-item"
import { EmptyState } from "./empty-state"
import { BulkQuickApprovalSummary } from "./bulk-quick-approval-summary"
import { SummaryCard } from "./summary-card"
import { ActionButtons } from "./action-buttons"
import { BulkNotification } from "./bulk-notification"
import { SidebarMenu } from "./sidebar-menu"
import { FileText } from "lucide-react"

export function TimesheetApproval({
  onBack,
  onApprovalAction,
}: {
  onBack: () => void
  onApprovalAction: (type: "approved" | "rejected") => void
}) {
  const {
    approvedTimesheets,
    setApprovedTimesheets,
    rejectedTimesheets,
    setRejectedTimesheets,
    showApproveAlert,
    setShowApproveAlert,
    showRejectAlert,
    setShowRejectAlert,
    rejectionReason,
    setRejectionReason,
    rejectionReasons,
    setRejectionReasons,
    showChangelog,
    setShowChangelog,
    selectedTimesheetForChangelog,
    setSelectedTimesheetForChangelog,
    getApprovalStatus,
    filteredTimesheets,
    selectedDate,
    setSelectedDate,
    approvalFilter,
    setApprovalFilter,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    timesheetFilters,
    setTimesheetFilters,
  } = useTimesheetState()

  const [isQuickApprovalEnabled, setIsQuickApprovalEnabled] = useState(false)
  const [currentTimesheetIndex, setCurrentTimesheetIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<"approved" | "rejected">("approved")
  const [selectedTimesheets, setSelectedTimesheets] = useState<Set<string>>(new Set())
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())
  const [allSelected, setAllSelected] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showActionAlert, setShowActionAlert] = useState(false)
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()

  // Add state for period filter
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Add state for personnel list view
  const [showPersonnelList, setShowPersonnelList] = useState(false)
  const [selectedTimesheetForPersonnel, setSelectedTimesheetForPersonnel] = useState<string | null>(null)
  const [showBulkNotification, setShowBulkNotification] = useState(false)

  const [showSummary, setShowSummary] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryData, setSummaryData] = useState({
    totalPersonnel: 0,
    totalDailyWages: 0,
    totalDays: 0,
    totalPersonnelCost: 0,
    totalCost: 0,
    extraCosts: 0,
    invoicePeriod: "",
    workTypes: [],
  })

  // Add state for bulk quick approval
  const [showBulkQuickApproval, setShowBulkQuickApproval] = useState(false)
  const [bulkQuickApprovalLoading, setBulkQuickApprovalLoading] = useState(false)
  const [bulkQuickApprovalData, setBulkQuickApprovalData] = useState({
    totalPersonnel: 0,
    totalDailyWages: 0,
    totalDays: 0,
    totalPersonnelCost: 0,
    totalCost: 0,
    extraCosts: 0,
    invoicePeriod: "",
    pendingCount: 0,
    workTypes: [
      { name: "Sulama", count: 0, cost: 0 },
      { name: "Gübreleme", count: 0, cost: 0 },
      { name: "İlaçlama", count: 0, cost: 0 },
      { name: "Hasat", count: 0, cost: 0 },
    ],
  })

  // Add state for bulk quick approval toggle
  const [isBulkQuickApprovalEnabled, setIsBulkQuickApprovalEnabled] = useState(false)

  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState<"pending" | "approved" | "all">("pending")

  // Add a new state for tracking swipe
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null)
  const [swipeCurrentY, setSwipeCurrentY] = useState<number | null>(null)

  // Initialize filters once during component mount
  useEffect(() => {
    // Only set these values once on initial render
    if (approvalFilter !== "pending") {
      setApprovalFilter("pending")
      setTimesheetFilters({
        ...timesheetFilters,
        status: "pending",
      })
    }
  }, []) // Empty dependency array means this runs once on mount

  // Replace the displayedTimesheets state with a computed value
  // This avoids the circular dependency that was causing the infinite loop
  const displayedTimesheets = useMemo(() => {
    let filtered = filteredTimesheets

    // Apply period filter if both start and end dates are set
    if (startDate && endDate) {
      filtered = filtered.filter((timesheet) => {
        // Parse dates for comparison (DD.MM.YYYY format)
        const [tsDay, tsMonth, tsYear] = timesheet.date.split(".").map(Number)
        const [startDay, startMonth, startYear] = startDate.split(".").map(Number)
        const [endDay, endMonth, endYear] = endDate.split(".").map(Number)

        const tsDate = new Date(tsYear, tsMonth - 1, tsDay)
        const startDateObj = new Date(startYear, startMonth - 1, startDay)
        const endDateObj = new Date(endYear, endMonth - 1, endDay)

        // Include if timesheet date is between start and end dates (inclusive)
        return tsDate >= startDateObj && tsDate <= endDateObj
      })
    }

    if (activeFilter === "pending") {
      return filtered.filter((timesheet) => getApprovalStatus(timesheet.id) === "pending")
    } else if (activeFilter === "approved") {
      return filtered.filter((timesheet) => getApprovalStatus(timesheet.id) === "approved")
    }
    return filtered
  }, [filteredTimesheets, getApprovalStatus, activeFilter, startDate, endDate])

  const handleApproveTimesheet = (id: string) => {
    setApprovedTimesheets(new Set([...approvedTimesheets, id]))
    setRejectedTimesheets(new Set([...rejectedTimesheets].filter((x) => x !== id)))
    if (typeof onApprovalAction === "function") {
      onApprovalAction("approved")
    }
    setShowActionAlert(true)
    setActionType("approved")
    if (isQuickApprovalEnabled) {
      moveToNextTimesheet()
    }
  }

  const handleRejectTimesheet = (id: string) => {
    setRejectedTimesheets(new Set([...rejectedTimesheets, id]))
    setApprovedTimesheets(new Set([...approvedTimesheets].filter((x) => x !== id)))
    if (typeof onApprovalAction === "function") {
      onApprovalAction("rejected")
    }
    setShowActionAlert(true)
    setActionType("rejected")
    setShowRejectAlert(true)
    if (isQuickApprovalEnabled) {
      moveToNextTimesheet()
    }
  }

  const moveToNextTimesheet = () => {
    if (currentTimesheetIndex < displayedTimesheets.length - 1) {
      setCurrentTimesheetIndex(currentTimesheetIndex + 1)
    }
  }

  const handleApproveAll = () => {
    const timesheetIds = Array.from(selectedTimesheets)

    // Yeni onaylanan puantajları ekle
    const newApprovedTimesheets = new Set(approvedTimesheets)
    timesheetIds.forEach((id) => newApprovedTimesheets.add(id))
    setApprovedTimesheets(newApprovedTimesheets)

    // Reddedilmiş puantajlardan, şimdi onaylananları çıkar
    const newRejectedTimesheets = new Set(rejectedTimesheets)
    timesheetIds.forEach((id) => newRejectedTimesheets.delete(id))
    setRejectedTimesheets(newRejectedTimesheets)

    // Bildirim göster
    setNotificationType("approved")
    setShowBulkNotification(true)
    setTimeout(() => {
      setShowBulkNotification(false)
      setSelectedTimesheets(new Set())
      setShowApproveAlert(false)

      // Set filter to "pending" to hide approved timesheets
      setApprovalFilter("pending")
      setTimesheetFilters({
        ...timesheetFilters,
        status: "pending",
      })
      setActiveFilter("pending")
    }, 1500)

    if (typeof onApprovalAction === "function") {
      onApprovalAction("approved")
    }
  }

  const handleRejectAll = () => {
    const timesheetIds = Array.from(selectedTimesheets)

    // Yeni reddedilen puantajları ekle
    const newRejectedTimesheets = new Set(rejectedTimesheets)
    timesheetIds.forEach((id) => newRejectedTimesheets.add(id))
    setRejectedTimesheets(newRejectedTimesheets)

    // Onaylanmış puantajlardan, şimdi reddedilenleri çıkar
    const newApprovedTimesheets = new Set(approvedTimesheets)
    timesheetIds.forEach((id) => newApprovedTimesheets.delete(id))
    setApprovedTimesheets(newApprovedTimesheets)

    // Bildirim göster
    setNotificationType("rejected")
    setShowBulkNotification(true)
    setTimeout(() => {
      setShowBulkNotification(false)
      setSelectedTimesheets(new Set())
      setShowRejectAlert(false)

      // Set filter to "pending" to hide rejected timesheets
      setApprovalFilter("pending")
      setTimesheetFilters({
        ...timesheetFilters,
        status: "pending",
      })
      setActiveFilter("pending")
    }, 1500)

    if (typeof onApprovalAction === "function") {
      onApprovalAction("rejected")
    }
  }

  // Handle bulk quick approval
  const handleBulkQuickApproval = (enabled: boolean) => {
    setIsBulkQuickApprovalEnabled(enabled)

    if (enabled) {
      setShowBulkQuickApproval(true)
      setBulkQuickApprovalLoading(true)

      // Calculate summary data after 3 seconds
      setTimeout(() => {
        // Get all pending timesheets
        const pendingTimesheets = filteredTimesheets.filter((t) => getApprovalStatus(t.id) === "pending")

        const pendingCount = pendingTimesheets.length

        // Calculate totals with realistic data
        const totalPersonnel = pendingTimesheets.reduce(
          (sum, t) => sum + (t.personnel?.length || Math.floor(Math.random() * 5) + 15),
          0,
        )

        // Generate a realistic daily wage count - at least twice the personnel count
        const totalDailyWages = totalPersonnel * (2 + Math.floor(Math.random() * 2)) // 2-3 times personnel count

        // Calculate total days
        const totalDays = pendingTimesheets.length

        const totalPersonnelCost = pendingTimesheets.reduce((sum, t) => {
          // Use actual cost if available, otherwise generate realistic cost
          const cost = t.cost || Math.floor(Math.random() * 1500) + 2500
          return sum + cost
        }, 0)

        // Calculate extra costs (transportation, equipment, etc.)
        const extraCosts = pendingTimesheets.reduce((sum, t) => {
          // Generate realistic extra costs (15-25% of personnel cost)
          const baseCost = t.cost || Math.floor(Math.random() * 1500) + 2500
          const extraRate = 0.15 + Math.random() * 0.1 // 15-25%
          return sum + Math.round(baseCost * extraRate)
        }, 0)

        const totalCost = totalPersonnelCost + extraCosts

        // Generate invoice period
        // Sort dates to find min and max
        const dates = pendingTimesheets
          .map((t) => t.date || "")
          .filter(Boolean)
          .sort()

        let startDate = dates.length > 0 ? dates[0] : "01.02.2024"
        // If we have a single date, create a 15-day period
        if (dates.length <= 1) {
          // Parse the start date
          const [day, month, year] = startDate.split(".").map(Number)

          // Create a date object and add 14 days to get a 15-day period
          const startDateObj = new Date(year, month - 1, day)
          const endDateObj = new Date(year, month - 1, day + 14)

          // Format the end date
          const endDay = endDateObj.getDate().toString().padStart(2, "0")
          const endMonth = (endDateObj.getMonth() + 1).toString().padStart(2, "0")
          const endYear = endDateObj.getFullYear()

          const endDate = `${endDay}.${endMonth}.${endYear}`
          startDate = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`

          const invoicePeriod = `${startDate} - ${endDate}`

          // Generate work types data
          const workTypes = [
            {
              name: "Sulama",
              count: Math.floor(totalPersonnel * 0.35),
              cost: Math.round(totalPersonnelCost * 0.35),
            },
            {
              name: "Gübreleme",
              count: Math.floor(totalPersonnel * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
            {
              name: "İlaçlama",
              count: Math.floor(totalPersonnel * 0.15),
              cost: Math.round(totalPersonnelCost * 0.15),
            },
            {
              name: "Hasat",
              count: Math.floor(totalPersonnel * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
          ]

          setBulkQuickApprovalData({
            totalPersonnel,
            totalDailyWages,
            totalDays,
            totalPersonnelCost,
            totalCost,
            extraCosts,
            invoicePeriod,
            pendingCount,
            workTypes,
          })
        } else {
          const endDate = dates[dates.length - 1]
          const invoicePeriod = `${startDate} - ${endDate}`

          // Generate work types data
          const workTypes = [
            {
              name: "Sulama",
              count: Math.floor(totalPersonnel * 0.35),
              cost: Math.round(totalPersonnelCost * 0.35),
            },
            {
              name: "Gübreleme",
              count: Math.floor(totalPersonnel * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
            {
              name: "İlaçlama",
              count: Math.floor(totalPersonnel * 0.15),
              cost: Math.round(totalPersonnelCost * 0.15),
            },
            {
              name: "Hasat",
              count: Math.floor(totalPersonnel * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
          ]

          setBulkQuickApprovalData({
            totalPersonnel,
            totalDailyWages,
            totalDays,
            totalPersonnelCost,
            totalCost,
            extraCosts,
            invoicePeriod,
            pendingCount,
            workTypes,
          })
        }

        setBulkQuickApprovalLoading(false)
      }, 3000)
    } else {
      setShowBulkQuickApproval(false)
    }
  }

  // Confirm bulk quick approval
  const confirmBulkQuickApproval = () => {
    // Get all pending timesheets
    const pendingTimesheets = filteredTimesheets.filter((t) => getApprovalStatus(t.id) === "pending")

    // Approve all pending timesheets
    const pendingIds = pendingTimesheets.map((t) => t.id)

    // Add to approved timesheets
    const newApprovedTimesheets = new Set(approvedTimesheets)
    pendingIds.forEach((id) => newApprovedTimesheets.add(id))
    setApprovedTimesheets(newApprovedTimesheets)

    // Remove from rejected timesheets if any
    const newRejectedTimesheets = new Set(rejectedTimesheets)
    pendingIds.forEach((id) => newRejectedTimesheets.delete(id))
    setRejectedTimesheets(newRejectedTimesheets)

    // Show notification
    setNotificationType("approved")
    setShowBulkNotification(true)

    // Close the modal
    setShowBulkQuickApproval(false)

    setTimeout(() => {
      setShowBulkNotification(false)

      // Set filter to "pending" to hide approved timesheets
      setApprovalFilter("pending")
      setTimesheetFilters({
        ...timesheetFilters,
        status: "pending",
      })
      setActiveFilter("pending")
    }, 1500)

    if (typeof onApprovalAction === "function") {
      onApprovalAction("approved")
    }
  }

  const currentTimesheet = displayedTimesheets[currentTimesheetIndex]

  // Toggle selection of a timesheet
  const toggleSelection = (id: string) => {
    setSelectedTimesheets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Select all timesheets
  const selectAllTimesheets = () => {
    if (selectedTimesheets.size === displayedTimesheets.length) {
      // If all are selected, deselect all
      setSelectedTimesheets(new Set())
    } else {
      // Otherwise, select all
      const allIds = new Set(displayedTimesheets.map((timesheet) => timesheet.id))
      setSelectedTimesheets(allIds)
    }
  }

  const handleFilterClick = () => {
    setIsFilterOpen(true)
  }

  const handleApplyFilters = () => {
    // Update the timesheetFilters with period filter data
    setTimesheetFilters({
      date: selectedDate,
      status: approvalFilter,
      id: selectedId,
      search: searchTerm,
      startDate,
      endDate,
    })
    setActiveFilter(approvalFilter as "pending" | "approved" | "all")
    setIsFilterOpen(false)
  }

  // Handle showing personnel list
  const handleShowPersonnelList = (timesheetId: string) => {
    setShowPersonnelList(true)
    setSelectedTimesheetForPersonnel(timesheetId)
  }

  // Handle back from personnel list
  const handleBackFromPersonnelList = () => {
    setShowPersonnelList(false)
    setSelectedTimesheetForPersonnel(null)
  }

  // Handle individual timesheet approval with filter update
  const handleApproveWithFilter = (id: string) => {
    handleApproveTimesheet(id)

    // Check if this is the last pending timesheet
    const pendingTimesheets = filteredTimesheets.filter((t) => getApprovalStatus(t.id) === "pending" && t.id !== id)

    // If no more pending timesheets, update filter to show only pending
    if (pendingTimesheets.length === 0) {
      setTimeout(() => {
        setApprovalFilter("pending")
        setTimesheetFilters({
          ...timesheetFilters,
          status: "pending",
        })
        setActiveFilter("pending")
      }, 1000)
    }
  }

  // Format currency with thousand separators
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) {
      return "0"
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Handle showing all timesheets
  const handleShowAllTimesheets = () => {
    setApprovalFilter("all")
    setTimesheetFilters({
      ...timesheetFilters,
      status: "all",
    })
    setActiveFilter("all")
  }

  // Handle filter change from badge click
  const handleFilterChange = (filter: "pending" | "approved" | "all") => {
    setActiveFilter(filter)
    setApprovalFilter(filter)
    setTimesheetFilters({
      ...timesheetFilters,
      status: filter,
    })
  }

  // Add a function to handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swipeStartY === null) return
    setSwipeCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (swipeStartY === null || swipeCurrentY === null) {
      setSwipeStartY(null)
      setSwipeCurrentY(null)
      return
    }

    // If swiped down more than 50px, close the summary
    if (swipeCurrentY - swipeStartY > 50) {
      setSelectedTimesheets(new Set())
      setShowSummary(false)
    }

    setSwipeStartY(null)
    setSwipeCurrentY(null)
  }

  // Update the renderTimesheetList function
  const renderTimesheetList = () => {
    if (displayedTimesheets.length === 0) {
      return <EmptyState onShowAll={handleShowAllTimesheets} />
    }

    return (
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-white border-b z-50">
          <div className="p-3 flex items-center gap-2">
            <Badge
              variant={activeFilter === "pending" ? "default" : "warning"}
              className={cn(
                "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                activeFilter === "pending"
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "opacity-60 hover:opacity-100",
              )}
              onClick={() => handleFilterChange("pending")}
            >
              {pendingCount} Bekleyen
            </Badge>
            <Badge
              variant={activeFilter === "approved" ? "default" : "success"}
              className={cn(
                "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                activeFilter === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "opacity-60 hover:opacity-100",
              )}
              onClick={() => handleFilterChange("approved")}
            >
              {approvedCount} Onaylı
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={selectAllTimesheets}
              className={cn(
                "text-xs ml-auto",
                selectedTimesheets.size === displayedTimesheets.length
                  ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                  : "border-gray-200",
              )}
            >
              {selectedTimesheets.size === displayedTimesheets.length ? "Tümünü Kaldır" : "Tümünü Seç"}
            </Button>
          </div>
        </div>

        <div className={cn("divide-y px-1", showSummary && "opacity-50 pointer-events-none")}>
          {displayedTimesheets.map((timesheet, index) => (
            <TimesheetListItem
              key={timesheet.id}
              timesheet={timesheet}
              index={index}
              isSelected={selectedTimesheets.has(timesheet.id)}
              approvalStatus={getApprovalStatus(timesheet.id)}
              onToggleSelection={toggleSelection}
              onShowPersonnelList={handleShowPersonnelList}
              hideViewButton={selectedTimesheets.size === displayedTimesheets.length}
            />
          ))}
        </div>
      </div>
    )
  }

  // Update the renderQuickApprovalContent function
  const renderQuickApprovalContent = () => {
    if (showBulkQuickApproval) {
      return (
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 bg-white border-b z-50 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge
                variant={activeFilter === "pending" ? "default" : "warning"}
                className={cn(
                  "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                  activeFilter === "pending"
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "opacity-60 hover:opacity-100",
                )}
                onClick={() => handleFilterChange("pending")}
              >
                {pendingCount} Bekleyen
              </Badge>
              <Badge
                variant={activeFilter === "approved" ? "default" : "success"}
                className={cn(
                  "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                  activeFilter === "approved"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "opacity-60 hover:opacity-100",
                )}
                onClick={() => handleFilterChange("approved")}
              >
                {approvedCount} Onaylı
              </Badge>
            </div>
          </div>

          <BulkQuickApprovalSummary
            loading={bulkQuickApprovalLoading}
            data={bulkQuickApprovalData}
            onCancel={() => {
              setShowBulkQuickApproval(false)
              setIsBulkQuickApprovalEnabled(false)
            }}
            onConfirm={confirmBulkQuickApproval}
            onFilterClick={handleFilterClick}
            formatCurrency={formatCurrency}
          />
        </div>
      )
    }

    if (displayedTimesheets.length === 0) {
      return <EmptyState onShowAll={handleShowAllTimesheets} />
    }

    return (
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 bg-white border-b z-50 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge
              variant={activeFilter === "pending" ? "default" : "warning"}
              className={cn(
                "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                activeFilter === "pending"
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "opacity-60 hover:opacity-100",
              )}
              onClick={() => handleFilterChange("pending")}
            >
              {pendingCount} Bekleyen
            </Badge>
            <Badge
              variant={activeFilter === "approved" ? "default" : "success"}
              className={cn(
                "text-xs px-2 py-0.5 h-6 cursor-pointer transition-all",
                activeFilter === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "opacity-60 hover:opacity-100",
              )}
              onClick={() => handleFilterChange("approved")}
            >
              {approvedCount} Onaylı
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          {currentTimesheet && (
            <TimesheetCard
              timesheet={currentTimesheet}
              onApprove={() => handleApproveWithFilter(currentTimesheet.id)}
              onReject={() => handleRejectTimesheet(currentTimesheet.id)}
              approvalStatus={getApprovalStatus(currentTimesheet.id)}
              onChangelogClick={() => {
                setSelectedTimesheetForChangelog(currentTimesheet.id)
                setShowChangelog(true)
              }}
              showActionAlert={showActionAlert}
              actionType={actionType}
              onPersonnelListClick={() => handleShowPersonnelList(currentTimesheet.id)}
            />
          )}
        </div>
      </div>
    )
  }

  // Main content renderer
  const renderContent = () => {
    // Show personnel list if active
    if (showPersonnelList && selectedTimesheetForPersonnel) {
      const selectedTimesheet = filteredTimesheets.find((t) => t.id === selectedTimesheetForPersonnel)
      if (!selectedTimesheet) return null

      return (
        <PersonnelListScreen
          onBack={handleBackFromPersonnelList}
          personnel={selectedTimesheet.personnel || []}
          timesheetId={selectedTimesheetForPersonnel}
          date={selectedTimesheet.date}
          onApprove={() => handleApproveWithFilter(selectedTimesheetForPersonnel)}
          onReject={() => handleRejectTimesheet(selectedTimesheetForPersonnel)}
        />
      )
    }

    // Show quick approval or list view based on mode
    return (
      <div className="flex-1 flex flex-col w-full">
        {isQuickApprovalEnabled ? renderQuickApprovalContent() : renderTimesheetList()}
      </div>
    )
  }

  // Calculate counts
  const pendingCount = filteredTimesheets.filter((t) => getApprovalStatus(t.id) === "pending").length
  const approvedCount = approvedTimesheets.size
  const totalCount = filteredTimesheets.length

  // Check if there are active filters
  const hasActiveFilters = !!(
    timesheetFilters?.date ||
    timesheetFilters?.status !== "all" ||
    timesheetFilters?.id ||
    timesheetFilters?.search ||
    startDate ||
    endDate
  )

  // Load summary data when timesheets are selected
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  useEffect(() => {
    if (showActionAlert) {
      const timer = setTimeout(() => {
        setShowActionAlert(false)
        setActionType(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showActionAlert])

  useEffect(() => {
    // When timesheets are selected, show summary with loading
    if (selectedTimesheets.size > 0) {
      setShowSummary(true)
      setSummaryLoading(true)

      // Calculate summary data after 3 seconds
      const timer = setTimeout(() => {
        // Calculate summary data from selected timesheets
        const selectedTimesheetData = filteredTimesheets.filter((t) => selectedTimesheets.has(t.id))

        // Calculate totals with realistic data
        const totalPersonnel = selectedTimesheetData.reduce(
          (sum, t) => sum + (t.personnel?.length || Math.floor(Math.random() * 5) + 15),
          0,
        )

        // Generate a realistic daily wage count - at least twice the personnel count
        const totalDailyWages = totalPersonnel * (2 + Math.floor(Math.random() * 2)) // 2-3 times personnel count

        // Calculate total days
        const totalDays = selectedTimesheetData.length

        const totalPersonnelCost = selectedTimesheetData.reduce((sum, t) => {
          // Use actual cost if available, otherwise generate realistic cost
          const cost = t.cost || Math.floor(Math.random() * 1500) + 2500
          return sum + cost
        }, 0)

        // Calculate extra costs (transportation, equipment, etc.)
        const extraCosts = selectedTimesheetData.reduce((sum, t) => {
          // Generate realistic extra costs (15-25% of personnel cost)
          const baseCost = t.cost || Math.floor(Math.random() * 1500) + 2500
          const extraRate = 0.15 + Math.random() * 0.1 // 15-25%
          return sum + Math.round(baseCost * extraRate)
        }, 0)

        const totalCost = totalPersonnelCost + extraCosts

        // Generate invoice period
        // Sort dates to find min and max
        const dates = selectedTimesheetData
          .map((t) => t.date || "")
          .filter(Boolean)
          .sort()

        let startDate = dates.length > 0 ? dates[0] : "01.02.2024"
        // If we have a single date, create a 15-day period
        if (dates.length <= 1) {
          // Parse the start date
          const [day, month, year] = startDate.split(".").map(Number)

          // Create a date object and add 14 days to get a 15-day period
          const startDateObj = new Date(year, month - 1, day)
          const endDateObj = new Date(year, month - 1, day + 14)

          // Format the end date
          const endDay = endDateObj.getDate().toString().padStart(2, "0")
          const endMonth = (endDateObj.getMonth() + 1).toString().padStart(2, "0")
          const endYear = endDateObj.getFullYear()

          const endDate = `${endDay}.${endMonth}.${endYear}`
          startDate = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`

          const invoicePeriod = `${startDate} - ${endDate}`

          // Generate work types data with daily wages
          const workTypes = [
            {
              name: "Sulama",
              count: Math.floor(totalPersonnel * 0.35),
              dailyWages: Math.floor(totalDailyWages * 0.35),
              cost: Math.round(totalPersonnelCost * 0.35),
            },

            {
              name: "Gübreleme",
              count: Math.floor(totalPersonnel * 0.25),
              dailyWages: Math.floor(totalDailyWages * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
            {
              name: "İlaçlama",
              count: Math.floor(totalPersonnel * 0.15),
              dailyWages: Math.floor(totalDailyWages * 0.15),
              cost: Math.round(totalPersonnelCost * 0.15),
            },
            {
              name: "Hasat",
              count: Math.floor(totalPersonnel * 0.25),
              dailyWages: Math.floor(totalDailyWages * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
          ]

          setSummaryData({
            totalPersonnel,
            totalDailyWages,
            totalDays,
            totalPersonnelCost,
            totalCost,
            extraCosts,
            invoicePeriod,
            workTypes,
          })
        } else {
          const endDate = dates[dates.length - 1]
          const invoicePeriod = `${startDate} - ${endDate}`

          // Generate work types data with daily wages
          const workTypes = [
            {
              name: "Sulama",
              count: Math.floor(totalPersonnel * 0.35),
              dailyWages: Math.floor(totalDailyWages * 0.35),
              cost: Math.round(totalPersonnelCost * 0.35),
            },
            {
              name: "Gübreleme",
              count: Math.floor(totalPersonnel * 0.25),
              dailyWages: Math.floor(totalDailyWages * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
            {
              name: "İlaçlama",
              count: Math.floor(totalPersonnel * 0.15),
              dailyWages: Math.floor(totalDailyWages * 0.15),
              cost: Math.round(totalPersonnelCost * 0.15),
            },
            {
              name: "Hasat",
              count: Math.floor(totalPersonnel * 0.25),
              dailyWages: Math.floor(totalDailyWages * 0.25),
              cost: Math.round(totalPersonnelCost * 0.25),
            },
          ]

          setSummaryData({
            totalPersonnel,
            totalDailyWages,
            totalDays,
            totalPersonnelCost,
            totalCost,
            extraCosts,
            invoicePeriod,
            workTypes,
          })
        }

        setSummaryLoading(false)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setShowSummary(false)
    }
  }, [selectedTimesheets, filteredTimesheets])

  return (
    <div className="h-full flex flex-col bg-blue-50 relative">
      {showChangelog && selectedTimesheetForChangelog ? (
        <ChangelogPage
          onBack={() => {
            setShowChangelog(false)
            setSelectedTimesheetForChangelog(null)
          }}
          timesheetId={selectedTimesheetForChangelog}
        />
      ) : (
        <>
          <div className="flex flex-col h-full">
            {/* Fixed Header */}
            <div className="sticky top-0 z-20 bg-blue-50">
              <TimesheetHeader onBack={onBack} onFilterClick={handleFilterClick} hasActiveFilters={hasActiveFilters} />

              {/* Only show QuickApprovalControls if not in personnel list view */}
              {!showPersonnelList && (
                <QuickApprovalControls
                  isEnabled={isQuickApprovalEnabled}
                  onToggle={setIsQuickApprovalEnabled}
                  isBulkEnabled={isBulkQuickApprovalEnabled}
                  onBulkToggle={handleBulkQuickApproval}
                />
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {renderContent()}
                {isFilterOpen && (
                  <div className="absolute inset-0 z-50">
                    <TimesheetFilters
                      selectedDate={selectedDate}
                      approvalFilter={approvalFilter}
                      selectedId={selectedId}
                      onDateChange={setSelectedDate}
                      onFilterChange={setApprovalFilter}
                      onIdChange={setSelectedId}
                      timesheets={filteredTimesheets}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      isOpen={isFilterOpen}
                      onClose={() => setIsFilterOpen(false)}
                      onApply={handleApplyFilters}
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                    />
                  </div>
                )}
              </div>

              {/* Summary and Action Buttons */}
              {!showPersonnelList && !isQuickApprovalEnabled && selectedTimesheets.size > 0 && (
                <>
                  {/* Blur overlay */}
                  {showSummary && (
                    <div className="fixed inset-0 bg-black/5 backdrop-blur-[1px] z-10 pointer-events-none" />
                  )}

                  {/* Summary card and action buttons */}
                  <div
                    className="p-2 bg-white border-t relative z-20 rounded-t-xl shadow-lg"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Swipe indicator */}
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />

                    {/* Close button */}
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      onClick={() => {
                        setSelectedTimesheets(new Set())
                        setShowSummary(false)
                      }}
                      aria-label="Kapat"
                    >
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
                        className="text-red-500"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    {/* Compact Summary Card */}
                    {showSummary && (
                      <>
                        <SummaryCard
                          loading={summaryLoading}
                          data={summaryData}
                          selectedCount={selectedTimesheets.size}
                          formatCurrency={formatCurrency}
                        />

                        {/* Invoice Total Summary */}
                        {!summaryLoading && (
                          <div className="flex flex-col bg-gray-50 rounded-lg p-2 mb-2 border-2 border-blue-200 shadow-md">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <FileText className="h-3.5 w-3.5 text-gray-600 mr-1.5" />
                                <span className="text-sm font-medium text-gray-700">Fatura Özeti</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="flex flex-col">
                                <span className="text-gray-500">Personel</span>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs font-medium text-green-700 border-green-200 bg-green-50 justify-center"
                                >
                                  {formatCurrency(18866)}₺
                                </Badge>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-500">Servis</span>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs font-medium text-blue-700 border-blue-200 bg-blue-50 justify-center"
                                >
                                  {formatCurrency(1908.72)}₺
                                </Badge>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-500">Ek Hizmet</span>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs font-medium text-purple-700 border-purple-200 bg-purple-50 justify-center"
                                >
                                  {formatCurrency(2385.9)}₺
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm text-gray-800">Fatura Toplamı:</span>
                                <Badge className="text-sm font-bold bg-blue-600 text-white px-2 py-0.5">
                                  {formatCurrency(23160)}₺
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Action Buttons */}
                    <ActionButtons
                      selectedCount={selectedTimesheets.size}
                      onReject={() => setShowRejectAlert(true)}
                      onApprove={() => setShowApproveAlert(true)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Menu */}
          <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onExit={onBack} />

          {/* Alerts and Notifications */}
          <TimesheetAlerts
            showApproveAlert={showApproveAlert}
            showRejectAlert={showRejectAlert}
            onApproveClose={() => setShowApproveAlert(false)}
            onRejectClose={() => setShowRejectAlert(false)}
            onApproveConfirm={handleApproveAll}
            onRejectConfirm={handleRejectAll}
            onRejectReasonChange={setRejectionReason}
            rejectionReasons={REJECTION_REASONS}
          />

          <ApprovalNotification type={notificationType} show={showNotification} />

          {/* Bulk Notification */}
          <BulkNotification
            show={showBulkNotification}
            type={notificationType}
            count={selectedTimesheets.size > 0 ? selectedTimesheets.size : bulkQuickApprovalData.pendingCount}
          />
        </>
      )}
    </div>
  )
}

