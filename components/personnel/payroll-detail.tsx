"use client"

import { useState } from "react"
import { Globe, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface PayrollDetailProps {
  payroll: {
    id: string
    month: string
    amount: string
    missingDays: string
    isCurrentPeriod: boolean
  }
  onBack: () => void
  onNavigate: (route: string) => void
  onMenuClick: () => void
}

export function PayrollDetail({ payroll, onBack, onNavigate, onMenuClick }: PayrollDetailProps) {
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simüle edilmiş indirme işlemi
    setTimeout(() => {
      setIsDownloading(false)
      toast({
        title: "Bordro İndirildi",
        description: `${payroll.month} bordrosu indirildi.`,
        duration: 2000,
      })
    }, 1000)
  }

  const payrollData = {
    brutMaas: "10.000 ₺",
    netMaas: "8.500 ₺",
    gelirVergisi: "1.000 ₺",
    sgkPrimi: "500 ₺",
    eksikGun: payroll.missingDays === "Eksik gün yok" ? "Yok" : payroll.missingDays,
  }

  return (
    <div className="h-full flex flex-col bg-[#EFF6FF]">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-blue-600">OutsourceHub</h1>
        </div>
        <div className="w-[88px]" />
      </div>

      <h2 className="text-lg font-semibold mt-4 mb-2 px-4">{payroll.month} Bordrosu</h2>

      <div className="flex-1 p-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Brüt Maaş</span>
              <span className="text-sm font-medium">{payrollData.brutMaas}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Net Maaş</span>
              <span className="text-sm font-medium">{payrollData.netMaas}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Gelir Vergisi</span>
              <span className="text-sm font-medium">{payrollData.gelirVergisi}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">SGK Primi</span>
              <span className="text-sm font-medium">{payrollData.sgkPrimi}</span>
            </div>

            <div className="flex flex-col py-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eksik Gün</span>
                <span className="text-sm font-medium">{payrollData.eksikGun}</span>
              </div>
              <div className="flex justify-end mt-2">
                <Badge
                  variant={payroll.isCurrentPeriod ? "success" : "destructive"}
                  className={`whitespace-nowrap ${payroll.isCurrentPeriod ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {payroll.isCurrentPeriod ? "Mevcut Dönem" : "Geçmiş Dönem"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

