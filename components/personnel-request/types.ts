export interface PersonnelRequest {
  id: string
  date: string
  company: string
  projectGroup: string
  project: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  jobType: string
  numberOfPeople: number
  duration: string
  startDate: string
  endDate: string
  notes?: string
  createdAt?: string // Opsiyonel alan
}

export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled" | "all"

