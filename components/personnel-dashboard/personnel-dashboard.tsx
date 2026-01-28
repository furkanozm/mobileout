"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "../personnel/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/router"
import { LeaveParametersScreen } from "@/components/leave-parameters/leave-parameters-screen"

interface PersonnelDashboardProps {
  onNavigate: (route: string) => void
}

export function PersonnelDashboard({ onNavigate }: PersonnelDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

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
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Onaylandı
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Reddedildi
          </Badge>
        )
      default:
        return null
    }
  }

  const handleLogout = useCallback(() => {
    // Perform logout actions here (e.g., clear local storage, reset state)
    localStorage.removeItem("authToken") // Remove the auth token or any other stored credentials
    // Redirect to login page
    router.push("/login")
  }, [router])

  const renderContent = (route: string) => {
    switch (route) {
      case "leave-parameters":
        return <LeaveParametersScreen onMenuClick={() => setIsSidebarOpen(true)} onNavigate={onNavigate} />
      default:
        return (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">İzin Bilgileri</h3>
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-bold text-blue-600">{leaveInfo.balance.days} gün</p>
                <span className="text-sm text-gray-600">{leaveInfo.balance.type}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="font-medium">Son Kullanılan İzin</p>
                    <p className="text-sm text-gray-600">
                      {leaveInfo.lastUsed.startDate} - {leaveInfo.lastUsed.endDate}
                    </p>
                  </div>
                </div>
                {getStatusBadge(leaveInfo.lastUsed.status)}
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <Header title="Ana Sayfa" onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="flex-1 p-4 overflow-y-auto">{renderContent("default")}</main>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
        onLogout={handleLogout}
      />
    </div>
  )
}

