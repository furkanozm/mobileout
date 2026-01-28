"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Loader2, Truck, Package } from "lucide-react"
import { useState } from "react"
import { IOSPopup } from "@/components/shared/ios-popup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SummaryCardProps {
  loading: boolean
  data: {
    totalPersonnel: number
    totalDailyWages: number
    totalDays: number
    totalPersonnelCost: number
    totalCost: number
    invoicePeriod: string
    workTypes?: Array<{
      name: string
      count: number
      dailyWages?: number
      cost: number
    }>
  }
  selectedCount: number
  formatCurrency: (amount: number) => string
}

export function SummaryCard({ loading, data, selectedCount, formatCurrency }: SummaryCardProps) {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)

  const handleDownloadClick = () => {
    setShowDownloadConfirm(true)
  }

  const handleConfirmDownload = () => {
    setShowDownloadConfirm(false)
    setShowEmailSent(true)
    setTimeout(() => {
      setShowEmailSent(false)
    }, 2000)
  }

  // Helper function to round to 2 decimal places
  const roundAmount = (amount: number): number => {
    return Math.round(amount * 100) / 100
  }

  // Calculate unit cost (per person)
  const calculateUnitCost = (totalCost: number, count: number): number => {
    if (count === 0) return 0
    return roundAmount(totalCost / count)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-3 transition-all duration-300 ease-in-out border-2 border-blue-200">
      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
          <p className="text-sm text-gray-600">Hesaplanıyor...</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="details" className="text-xs">
                Personel Maliyeti
              </TabsTrigger>
              <TabsTrigger value="services" className="text-xs">
                Diğer...
              </TabsTrigger>
            </TabsList>

            <div className="pb-2 mb-3 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-blue-700">Puantaj Özeti</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-800 font-medium">
                    {selectedCount} Seçili
                  </Badge>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white bg-blue-600 hover:bg-blue-700 h-6 w-6 p-0"
                    onClick={handleDownloadClick}
                    aria-label="Rapor İndir"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-200 rounded-full"></div>
            </div>

            <div className="flex items-center text-xs mb-2">
              <Calendar className="h-3.5 w-3.5 text-blue-600 mr-1.5 flex-shrink-0" />
              <span className="text-blue-600 mr-1 whitespace-nowrap">Dönem:</span>
              <span className="font-semibold whitespace-nowrap">{data.invoicePeriod}</span>
            </div>

            <TabsContent value="details" className="mt-0 transition-all duration-300 ease-in-out">
              <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-xs mb-3">
                <div className="bg-blue-50 p-1.5 rounded-md border border-blue-200 flex items-center justify-between">
                  <span className="text-blue-600 whitespace-nowrap">Personel:</span>
                  <span className="font-semibold text-xs">{data.totalPersonnel}</span>
                </div>
                <div className="bg-blue-50 p-1.5 rounded-md border border-blue-200 flex items-center justify-between">
                  <span className="text-blue-600 whitespace-nowrap">Günlük Ç.:</span>
                  <span className="font-semibold text-xs">{data.totalDailyWages}</span>
                </div>
                <div className="bg-blue-50 p-1.5 rounded-md border border-blue-200 flex items-center justify-between">
                  <span className="text-blue-600 whitespace-nowrap">Gün:</span>
                  <span className="font-semibold text-xs">{data.totalDays}</span>
                </div>
              </div>

              {data.workTypes && data.workTypes.length > 0 && (
                <div className="mb-3">
                  <div className="space-y-2">
                    {data.workTypes.map((work, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></div>
                          <span className="text-xs">{work.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">{work.count} kişi</span>
                          <span className="text-xs text-gray-400 mx-1.5">|</span>
                          <span className="text-xs text-gray-500">{work.dailyWages} G.Ç</span>
                          <span className="text-xs text-gray-400 mx-1.5">|</span>
                          <span className="text-xs font-medium">{formatCurrency(work.cost)}₺</span>
                          <span className="text-xs text-gray-400 mx-1.5">|</span>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded">
                            {formatCurrency(calculateUnitCost(work.cost, work.count))}₺
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 whitespace-nowrap">P.Hakediş:</span>
                  <Badge
                    variant="outline"
                    className="font-semibold text-xs text-green-700 border-green-200 bg-green-50 px-2"
                  >
                    {formatCurrency(data.totalPersonnelCost)}₺
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">Toplam Mal.:</span>
                  <Badge variant="success" className="font-semibold text-xs px-2">
                    {formatCurrency(data.totalCost)}₺
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-0 transition-all duration-300 ease-in-out">
              <div className="space-y-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-md border border-blue-300">
                  <div className="flex items-center mb-1">
                    <Truck className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                    <span className="text-xs font-semibold text-blue-700">Servis Hizmetleri</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center p-1.5 bg-white rounded-md border border-gray-200">
                      <span className="text-xs">Personel Taşıma</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{data.totalPersonnel} kişi</span>
                        <span className="text-xs text-gray-400 mx-1.5">|</span>
                        <span className="text-xs font-medium">
                          {formatCurrency(roundAmount(data.totalPersonnelCost * 0.12))}₺
                        </span>
                        <span className="text-xs text-gray-400 mx-1.5">|</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded">
                          {formatCurrency(roundAmount((data.totalPersonnelCost * 0.12) / data.totalPersonnel))}₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-md border border-blue-300">
                  <div className="flex items-center mb-1">
                    <Package className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                    <span className="text-xs font-semibold text-blue-700">Ek Hizmetler</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center p-1.5 bg-white rounded-md border border-gray-200">
                      <span className="text-xs">Ekipman Kiralama</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{data.totalDailyWages} G.Ç</span>
                        <span className="text-xs text-gray-400 mx-1.5">|</span>
                        <span className="text-xs font-medium">
                          {formatCurrency(roundAmount(data.totalPersonnelCost * 0.15))}₺
                        </span>
                        <span className="text-xs text-gray-400 mx-1.5">|</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded">
                          {formatCurrency(roundAmount((data.totalPersonnelCost * 0.15) / data.totalDailyWages))}₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs p-2 bg-blue-50 rounded-md border border-blue-300">
                  <span className="text-blue-600">Ek Hizmetler Toplamı:</span>
                  <div className="flex items-center">
                    <Badge variant="outline" className="font-semibold text-xs">
                      {formatCurrency(roundAmount(data.totalPersonnelCost * 0.27))}₺
                    </Badge>
                    <span className="text-xs text-gray-400 mx-1.5">|</span>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded">
                      {formatCurrency(
                        roundAmount((data.totalPersonnelCost * 0.27) / (data.totalPersonnel + data.totalDailyWages)),
                      )}
                      ₺
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <IOSPopup
            isOpen={showDownloadConfirm}
            onClose={() => setShowDownloadConfirm(false)}
            message="Seçilen puantajlar için detaylı maliyet raporu indirmek ister misin?"
            confirmText="Evet"
            cancelText="Hayır"
            onConfirm={handleConfirmDownload}
          />

          <IOSPopup
            isOpen={showEmailSent}
            onClose={() => setShowEmailSent(false)}
            message="Rapor mail adresinize gönderilecek"
            confirmText="Tamam"
          />
        </>
      )}
    </div>
  )
}

