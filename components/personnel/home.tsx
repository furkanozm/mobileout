"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText, Wallet, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HomeProps {
  onNavigate: (route: string) => void
}

export function Home({ onNavigate }: HomeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data for leave information
  const leaveInfo = {
    balance: {
      days: 14,
      type: "Yıllık Ücretli İzin",
    },
    lastUsed: {
      days: 3,
      startDate: "15.05.2024",
      endDate: "17.05.2024",
      status: "pending",
    },
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Onay Bekliyor
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <div className="bg-white border-b px-4 py-3 flex items-center sticky top-0 z-20">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 mr-2"
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
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center">
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
              className="h-5 w-5 text-blue-600 mr-1"
            >
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
            <h2 className="text-blue-600 font-semibold">OutsourceHub</h2>
          </div>
        </div>
      </div>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">Hoş Geldiniz</h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card onClick={() => onNavigate("payrolls")} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Wallet className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-sm text-center">Son Bordro</div>
                <div className="text-xl font-bold">10.500 ₺</div>
                <div className="text-xs text-gray-500">Nisan 2024</div>
              </div>
            </CardContent>
          </Card>

          <Card onClick={() => onNavigate("documents")} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <FileText className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-sm text-center">Belgelerim</div>
                <div className="text-xl font-bold">2</div>
                <div className="text-xs text-gray-500">Onay Bekleyen</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card onClick={() => onNavigate("leaves")} className="cursor-pointer hover:shadow-md transition-shadow mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">İzin Bilgileri</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">{leaveInfo.balance.days} gün</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{leaveInfo.balance.type}</p>
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-sm font-medium">Son Kullanılan İzin</p>
                <p className="text-xs text-gray-600">
                  {leaveInfo.lastUsed.startDate} - {leaveInfo.lastUsed.endDate}
                </p>
              </div>
              {getStatusBadge(leaveInfo.lastUsed.status)}
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => onNavigate("employment-history")}
          className="cursor-pointer hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">İşe Girişlerim</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <p className="text-sm text-gray-600">Son İş Yeri: TechCorp A.Ş.</p>
            <p className="text-xs text-gray-500">01.03.2022 - Devam Ediyor</p>
          </CardContent>
        </Card>
      </main>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={onNavigate} />
    </div>
  )
}

