export interface TimesheetEntry {
  id: string
  employeeName: string
  laborType: string
  overtimeHours: number
  cost: number
  company: string
  projectGroup: string
  project: string
  date: string
  startTime: string
  endTime: string
  department: string
  wage: number
  tckn: string
  extraOvertimeHours?: number
  missingHours?: number
}

export interface DailyTimesheet {
  id: string
  date: string
  totalHours: number
  overtimeHours: number
  cost: number
  projectGroup: string
  project: string
  company: string
  personnel?: Array<{
    id: string
    name: string
    laborType: string
    hours: number
    task?: string
    wage?: number
    tckn?: string
  }>
  movements?: Array<{
    time: string
    action: string
    user: string
  }>
  entries: TimesheetEntry[]
  totalEmployees: number
  extraOvertimeHours?: number
  missingHours?: number
}

export type ApprovalStatus = "all" | "pending" | "approved" | "rejected"

export interface TimesheetFilters {
  date: string
  status: ApprovalStatus
  id: string
  search: string
}

