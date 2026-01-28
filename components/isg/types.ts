export interface Training {
  id: number
  title: string
  company: string
  projectGroup: string
  project: string
  isgCompany: string
  isgSpecialist: string
  date: string
  startTime: string
  endTime: string
  photos?: string[]
  documents?: string[]
}

export interface Participant {
  id: number
  name: string
  department: string
  position: string
  status: "attended" | "absent" | "pending"
  photo?: string
  rejectionReason?: string
  tckn: string
}

export interface Personnel {
  id: number
  name: string
  department: string
  position: string
  photo?: string
  isActive: boolean
  tckn: string
}

