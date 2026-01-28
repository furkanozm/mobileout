"use client"

import { useState, useMemo } from "react"
import type { ApprovalStatus, TimesheetFilters } from "./types"
import { SAMPLE_DATA } from "./constants"

export function useTimesheetState() {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [approvedTimesheets, setApprovedTimesheets] = useState<Set<string>>(new Set(["20240213", "20240214"]))
  const [rejectedTimesheets, setRejectedTimesheets] = useState<Set<string>>(new Set())
  const [selectedTimesheets, setSelectedTimesheets] = useState<Set<string>>(new Set())
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [showRejectAlert, setShowRejectAlert] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [approvalFilter, setApprovalFilter] = useState<ApprovalStatus>("all")
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({})
  const [allSelected, setAllSelected] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [selectedTimesheetForChangelog, setSelectedTimesheetForChangelog] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTimesheetId, setExpandedTimesheetId] = useState<string | null>(null)
  const [timesheetFilters, setTimesheetFilters] = useState<TimesheetFilters>({
    date: "",
    status: "all",
    id: "",
    search: "",
  })

  const getApprovalStatus = (timesheetId: string) => {
    if (!timesheetId) return "pending"
    if (approvedTimesheets.has(timesheetId)) return "approved"
    if (rejectedTimesheets.has(timesheetId)) return "rejected"
    return "pending"
  }

  const filteredTimesheets = useMemo(() => {
    // If searching by TCKN, ignore all other filters and search all timesheets
    if (searchTerm && searchTerm.match(/^[0-9]+$/)) {
      return SAMPLE_DATA.filter((timesheet) => timesheet.entries.some((entry) => entry.tckn === searchTerm)).map(
        (timesheet) => ({
          ...timesheet,
          entries: timesheet.entries.filter((entry) => entry.tckn === searchTerm),
        }),
      )
    }

    // Otherwise, apply all filters normally
    return SAMPLE_DATA.filter((timesheet) => {
      // Apply date filter
      if (selectedDate && timesheet.date !== selectedDate) {
        return false
      }

      // Apply approval status filter
      switch (approvalFilter) {
        case "pending":
          return !approvedTimesheets.has(timesheet.id) && !rejectedTimesheets.has(timesheet.id)
        case "approved":
          return approvedTimesheets.has(timesheet.id)
        case "rejected":
          return rejectedTimesheets.has(timesheet.id)
        case "all":
          return true
        default:
          return true
      }
    })
      .filter((timesheet) => {
        // Apply ID filter
        if (selectedId) {
          return timesheet.id.toLowerCase().includes(selectedId.toLowerCase())
        }
        return true
      })
      .filter((timesheet) => {
        // Apply personnel name search filter
        if (searchTerm && !searchTerm.match(/^[0-9]+$/)) {
          return timesheet.entries.some((entry) => entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        return true
      })
  }, [selectedDate, approvalFilter, approvedTimesheets, rejectedTimesheets, selectedId, searchTerm])

  // Auto-expand timesheet containing searched personnel
  useMemo(() => {
    if (searchTerm && filteredTimesheets.length > 0) {
      const timesheetWithPerson = filteredTimesheets.find((timesheet) =>
        timesheet.entries.some(
          (entry) =>
            entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || entry.tckn.includes(searchTerm),
        ),
      )
      if (timesheetWithPerson) {
        setExpandedTimesheetId(timesheetWithPerson.id)
      }
    }
  }, [searchTerm, filteredTimesheets])

  return {
    selectedDate,
    setSelectedDate,
    approvedTimesheets,
    setApprovedTimesheets,
    rejectedTimesheets,
    setRejectedTimesheets,
    selectedTimesheets,
    setSelectedTimesheets,
    selectedEntries,
    setSelectedEntries,
    showApproveAlert,
    setShowApproveAlert,
    showRejectAlert,
    setShowRejectAlert,
    rejectionReason,
    setRejectionReason,
    approvalFilter,
    setApprovalFilter,
    rejectionReasons,
    setRejectionReasons,
    allSelected,
    setAllSelected,
    showChangelog,
    setShowChangelog,
    selectedTimesheetForChangelog,
    setSelectedTimesheetForChangelog,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    expandedTimesheetId,
    setExpandedTimesheetId,
    getApprovalStatus,
    filteredTimesheets,
    timesheetFilters,
    setTimesheetFilters,
  }
}

