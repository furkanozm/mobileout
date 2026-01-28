"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sidebar } from "./sidebar"
import { useToast } from "@/components/ui/use-toast"

interface LeaveBalance {
  type: string
  total: number
  used: number
  remaining: number
}

interface LeavesProps {
  onNavigate: (route: string) => void
}

const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  { type: "Yıllık İzin", total: 14, used: 5, remaining: 9 },
  { type: "Mazeret İzni", total: 7, used: 2, remaining: 5 },
  { type: "Hastalık İzni", total: 10, used: 0, remaining: 10 },
]

const MOCK_LEAVES = [
  {
    id: 1,
    type: "Yıllık İzin",
    startDate: "2024-12-10",
    endDate: "2024-12-15",
    status: "Onaylandı",
    days: 5,
  },
  {
    id: 2,
    type: "Mazeret İzni",
    startDate: "2024-11-05",
    endDate: "2024-11-05",
    status: "Reddedildi",
    days: 1,
  },
  {
    id: 3,
    type: "Yıllık İzin",
    startDate: "2025-01-20",
    endDate: "2025-01-25",
    status: "Beklemede",
    days: 5,
  },
]

export function Leaves({ onNavigate }: LeavesProps) {
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false)
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [requestedDays, setRequestedDays] = useState<number>(0)
  const [currentBalance, setCurrentBalance] = useState<LeaveBalance | null>(null)
  const [comment, setComment] = useState("")
  const [leaves, setLeaves] = useState(MOCK_LEAVES)

  // Calculate working days between two dates (excluding Sundays)
  const calculateWorkingDays = (start: Date, end: Date) => {
    let count = 0
    const current = new Date(start)

    while (current <= end) {
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (current.getDay() !== 0) {
        // Skip Sundays
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    if (endDate) {
      const start = new Date(e.target.value)
      const end = new Date(endDate)

      if (start <= end) {
        const workDays = calculateWorkingDays(start, end)
        setRequestedDays(workDays)
      } else {
        setRequestedDays(0)
      }
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
    if (startDate) {
      const start = new Date(startDate)
      const end = new Date(e.target.value)

      if (start <= end) {
        const workDays = calculateWorkingDays(start, end)
        setRequestedDays(workDays)
      } else {
        setRequestedDays(0)
      }
    }
  }

  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value)
    const balance = MOCK_LEAVE_BALANCES.find((b) => b.type === value)
    setCurrentBalance(balance || null)
  }

  const remainingAfterRequest = currentBalance ? Math.max(0, currentBalance.remaining - requestedDays) : 0

  const isValidRequest =
    startDate && endDate && selectedLeaveType && new Date(startDate) <= new Date(endDate) && remainingAfterRequest >= 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Onaylandı":
        return "bg-green-100 text-green-800"
      case "Reddedildi":
        return "bg-red-100 text-red-800"
      case "Beklemede":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const resetForm = () => {
    setSelectedLeaveType("")
    setStartDate("")
    setEndDate("")
    setRequestedDays(0)
    setCurrentBalance(null)
  }

  const handleOpenForm = () => {
    resetForm()
    setShowNewLeaveForm(true)
  }

  const handleCloseForm = () => {
    setShowNewLeaveForm(false)
  }

  const handleSubmit = () => {
    // Create new leave request
    const newLeave = {
      id: leaves.length + 1,
      type: selectedLeaveType,
      startDate,
      endDate,
      status: "Beklemede",
      days: requestedDays,
    }

    // Add to list
    setLeaves((prev) => [newLeave, ...prev])

    // Show success message
    toast({
      title: "İzin talebi gönderildi",
      description: "Talebiniz yöneticinize iletilmiştir.",
      duration: 3000,
    })

    // Close form and reset
    handleCloseForm()
    resetForm()
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <h2 className="text-blue-600 font-semibold">İzinler</h2>
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

      <main className="flex-1 p-4 relative overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">İzin Bilgileri</h2>
        </div>

        {/* İzin Bakiyeleri */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {MOCK_LEAVE_BALANCES.map((balance) => (
            <Card key={balance.type} className="p-2 text-center">
              <p className="text-xs text-gray-500">{balance.type}</p>
              <p className="text-lg font-semibold">{balance.remaining}</p>
              <p className="text-xs text-gray-500">gün</p>
            </Card>
          ))}
        </div>

        {/* İzin Listesi */}
        <div className="space-y-3 pb-24">
          {leaves.map((leave) => (
            <div key={leave.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border">
              <div>
                <p className="font-medium">{leave.type}</p>
                <p className="text-sm text-gray-500">
                  {new Date(leave.startDate).toLocaleDateString("tr-TR")} -{" "}
                  {new Date(leave.endDate).toLocaleDateString("tr-TR")}
                </p>
                <p className="text-sm text-gray-500">{leave.days} gün</p>
              </div>
              <div className="flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(leave.status)}`}>{leave.status}</span>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        className="absolute bottom-24 right-4 rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 shadow-lg flex items-center justify-center z-10"
        onClick={handleOpenForm}
      >
        <Plus className="h-8 w-8" />
      </Button>

      {/* iOS Style Bottom Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-white rounded-t-2xl transition-transform duration-300 ease-in-out transform ${
          showNewLeaveForm ? "translate-y-0" : "translate-y-full"
        } border-t border-gray-200 shadow-lg z-20`}
        style={{ maxHeight: "calc(100% - 64px)" }}
      >
        {/* Handle/Drag indicator */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1"></div>

        <div className="flex flex-col h-[calc(100%-4px)] max-h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <h2 className="text-lg font-semibold">Yeni İzin Talebi</h2>
            <button onClick={handleCloseForm} className="p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div>
                <Select value={selectedLeaveType} onValueChange={handleLeaveTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="İzin Türü Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_LEAVE_BALANCES.map((balance) => (
                      <SelectItem key={balance.type} value={balance.type}>
                        {balance.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Date inputs side by side */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full"
                  placeholder="Başlangıç Tarihi"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="w-full"
                  placeholder="Bitiş Tarihi"
                />
              </div>
              {currentBalance && (startDate || endDate) && (
                <Card className="p-3 bg-slate-50 space-y-2 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mevcut Bakiye:</span>
                    <Badge variant="secondary" className="text-base">
                      {currentBalance.remaining} gün
                    </Badge>
                  </div>

                  {requestedDays > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Talep Edilen:</span>
                        <Badge variant="outline" className="text-base">
                          {requestedDays} gün
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm">İşlem Sonrası Bakiye:</span>
                        <Badge variant={remainingAfterRequest >= 0 ? "secondary" : "destructive"} className="text-base">
                          {remainingAfterRequest} gün
                        </Badge>
                      </div>
                      {remainingAfterRequest < 0 && <p className="text-xs text-red-500 mt-1">Yetersiz izin bakiyesi</p>}
                      {requestedDays > 0 && (
                        <p className="text-xs text-gray-500 mt-1">* Pazar günleri izin süresine dahil edilmemiştir</p>
                      )}
                    </>
                  )}
                </Card>
              )}
              <div>
                <Textarea
                  placeholder="İzin talebiniz için açıklama ekleyin..."
                  className="h-20 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="h-16"></div> {/* Spacer for fixed buttons */}
            </div>
          </div>

          <div className="px-6 py-3 border-t bg-white">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCloseForm}>
                İptal
              </Button>
              <Button className="flex-1 bg-black" disabled={!isValidRequest} onClick={handleSubmit}>
                Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for bottom sheet */}
      {showNewLeaveForm && <div className="absolute inset-0 bg-black bg-opacity-25 z-10" onClick={handleCloseForm} />}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={onNavigate} />
    </div>
  )
}

export default Leaves

