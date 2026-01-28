"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface PayrollItem {
  id: string
  month: string
  amount: string
  missingDays: string
  isCurrentPeriod: boolean
}

interface PayrollsProps {
  onNavigate: (route: string) => void
  onSelectPayroll: (payroll: PayrollItem) => void
  onMenuClick: () => void
}

export function Payrolls({ onNavigate, onSelectPayroll, onMenuClick }: PayrollsProps) {
  const payrollData: PayrollItem[] = [
    { id: "4", month: "Nisan 2024", amount: "10.500 ₺", missingDays: "1 gün eksik", isCurrentPeriod: true },
    { id: "3", month: "Mart 2024", amount: "10.500 ₺", missingDays: "Eksik gün yok", isCurrentPeriod: false },
    { id: "2", month: "Şubat 2024", amount: "10.000 ₺", missingDays: "2 gün eksik", isCurrentPeriod: false },
    { id: "1", month: "Ocak 2024", amount: "10.000 ₺", missingDays: "Eksik gün yok", isCurrentPeriod: false },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <h2 className="text-blue-600 font-semibold">Bordro</h2>
        </div>
        <button
          onClick={onMenuClick}
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
      <main className="flex-1 p-4">
        <h1 className="text-xl font-semibold mb-4">Bordrolarım</h1>
        <div className="space-y-4">
          {payrollData.map((payroll, index) => (
            <Card key={payroll.id} className="w-full">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      {payrollData.length - index}
                    </div>
                    <div>
                      <div className="font-medium">{payroll.month}</div>
                      <div className="text-sm text-gray-500">{payroll.missingDays}</div>
                      <Badge
                        variant={payroll.isCurrentPeriod ? "success" : "destructive"}
                        className={`mt-1 whitespace-nowrap text-xs ${
                          payroll.isCurrentPeriod ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payroll.isCurrentPeriod ? "Mevcut Dönem" : "Geçmiş Dönem"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 whitespace-nowrap">
                      {payroll.amount}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${
                        payroll.isCurrentPeriod
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-500"
                      }`}
                      onClick={() => payroll.isCurrentPeriod && onSelectPayroll(payroll)}
                      disabled={!payroll.isCurrentPeriod}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

