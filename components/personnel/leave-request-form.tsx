"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LeaveBalance {
  type: string
  total: number
  used: number
  remaining: number
}

const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  { type: "Yıllık İzin", total: 14, used: 5, remaining: 9 },
  { type: "Mazeret İzni", total: 7, used: 2, remaining: 5 },
  { type: "Hastalık İzni", total: 10, used: 0, remaining: 10 },
]

export default function LeaveRequestForm() {
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [requestedDays, setRequestedDays] = useState<number>(0)
  const [currentBalance, setCurrentBalance] = useState<LeaveBalance | null>(null)

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

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start <= end) {
        const workDays = calculateWorkingDays(start, end)
        setRequestedDays(workDays)
      } else {
        setRequestedDays(0)
      }
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (selectedLeaveType) {
      const balance = MOCK_LEAVE_BALANCES.find((b) => b.type === selectedLeaveType)
      setCurrentBalance(balance || null)
    } else {
      setCurrentBalance(null)
    }
  }, [selectedLeaveType])

  const remainingAfterRequest = currentBalance ? Math.max(0, currentBalance.remaining - requestedDays) : 0

  const isValidRequest =
    startDate && endDate && selectedLeaveType && new Date(startDate) <= new Date(endDate) && remainingAfterRequest >= 0

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold bg-slate-50 p-3 rounded-md">İzin Bilgileri</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">İzin Türü</label>
          <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
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

        {currentBalance && (
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
          <label className="text-sm text-gray-600 mb-1 block">Başlangıç Tarihi</label>
          <div className="relative">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-10" />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Bitiş Tarihi</label>
          <div className="relative">
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-10" />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Açıklama</label>
          <Textarea placeholder="İzin talebiniz için açıklama ekleyin..." className="h-20 resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1">
            İptal
          </Button>
          <Button className="flex-1 bg-black" disabled={!isValidRequest}>
            Gönder
          </Button>
        </div>
      </div>
    </div>
  )
}

