"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Briefcase, Building2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmploymentHistoryProps {
  onNavigate: (route: string) => void
}

export interface EmploymentRecord {
  id: number
  startDate: string
  endDate: string | null
  company: string
  project: string
  projectGroup: string
  entryDeclarationFile?: string
  exitDeclarationFile?: string
  status: "active" | "completed"
}

export function EmploymentHistory({ onNavigate }: EmploymentHistoryProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const employmentHistory: EmploymentRecord[] = [
    {
      id: 1,
      startDate: "01.03.2022",
      endDate: null,
      company: "TechCorp A.Ş.",
      project: "Web Geliştirme",
      projectGroup: "Frontend Ekibi",
      entryDeclarationFile: "techcorp_entry_declaration.pdf",
      status: "active",
    },
    {
      id: 2,
      startDate: "15.06.2020",
      endDate: "28.02.2022",
      company: "InnoSoft Ltd.",
      project: "Mobil Uygulama Geliştirme",
      projectGroup: "iOS Ekibi",
      entryDeclarationFile: "innosoft_entry_declaration.pdf",
      exitDeclarationFile: "innosoft_exit_declaration.pdf",
      status: "completed",
    },
    {
      id: 3,
      startDate: "01.09.2018",
      endDate: "31.05.2020",
      company: "DataSys Bilişim",
      project: "Veri Analizi",
      projectGroup: "BI Ekibi",
      entryDeclarationFile: "datasys_entry_declaration.pdf",
      exitDeclarationFile: "datasys_exit_declaration.pdf",
      status: "completed",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <h2 className="text-blue-600 font-semibold">İş Geçmişi</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
      <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">İş Geçmişim</h1>
        {employmentHistory.map((record) => (
          <Card
            key={record.id}
            className={cn(
              "mb-4",
              record.status === "active" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={cn("h-5 w-5", record.status === "active" ? "text-green-600" : "text-red-600")}
                  />
                  <h3 className="font-medium">{record.company}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {record.startDate} - {record.endDate || "D.Ediyor"}
                  </span>
                  {record.status === "active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => onNavigate(`employment-detail/${record.id}`)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Detaylar</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600">{record.project}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600">{record.projectGroup}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={onNavigate} />
    </div>
  )
}

