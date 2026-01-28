"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Check, Download, Loader2, PenToolIcon as Tool, X } from "lucide-react"
import { useState } from "react"
import { IOSPopup } from "@/components/shared/ios-popup"

interface WorkType {
  name: string
  count: number
  cost: number
}

interface BulkQuickApprovalSummaryProps {
  loading: boolean
  data: {
    totalPersonnel: number
    totalDailyWages: number
    totalDays: number
    totalPersonnelCost: number
    totalCost: number
    invoicePeriod: string
    pendingCount: number
    workTypes: WorkType[]
  }
  onCancel: () => void
  onConfirm: () => void
  onFilterClick: () => void
  formatCurrency: (amount: number) => string
}

export function BulkQuickApprovalSummary({
  loading,
  data,
  onCancel,
  onConfirm,
  onFilterClick,
  formatCurrency,
}: BulkQuickApprovalSummaryProps) {
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [activeTab, setActiveTab] = useState<"summary" | "services">("summary")
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)

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

  return (
    <div className="w-full max-w-md flex-1">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                <p className="text-base text-gray-600">Puantaj verileri hesaplanıyor...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-blue-700 text-base">Bekleyen Puantaj Özeti</h3>
                  <Badge variant="warning" className="text-xs px-2 py-0.5 whitespace-nowrap">
                    {data.pendingCount} Bekleyen
                  </Badge>
                </div>

                <div className="flex items-center text-xs mb-3">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 mr-1.5 flex-shrink-0" />
                  <span className="text-blue-600 mr-1 whitespace-nowrap">Dönem:</span>
                  <span className="font-semibold whitespace-nowrap">{data.invoicePeriod}</span>
                </div>

                {/* Tabs */}
                <div className="mb-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`py-2 px-4 text-xs font-medium ${
                        activeTab === "summary"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Özet
                    </button>
                    <button
                      onClick={() => setActiveTab("services")}
                      className={`py-2 px-4 text-xs font-medium ${
                        activeTab === "services"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Servisler & Ek Hizmetler
                    </button>
                  </div>

                  {/* Summary Tab Content */}
                  {activeTab === "summary" && (
                    <>
                      <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-xs my-3">
                        <div className="bg-blue-50 p-2 rounded-md">
                          <span className="text-blue-600 block mb-1">Personel:</span>
                          <span className="font-semibold text-sm">{data.totalPersonnel}</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-md">
                          <span className="text-blue-600 block mb-1">Yevmiye:</span>
                          <span className="font-semibold text-sm">{data.totalDailyWages}</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-md">
                          <span className="text-blue-600 block mb-1">Gün:</span>
                          <span className="font-semibold text-sm">{data.totalDays}</span>
                        </div>
                      </div>

                      {/* Yapılan İşçilikler Section */}
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <Tool className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                          <h4 className="text-xs font-semibold text-blue-700">Yapılan İşçilikler</h4>
                        </div>

                        <div className="space-y-2">
                          {data.workTypes.map((work, index) => (
                            <div key={index} className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></div>
                                <span className="text-xs">{work.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{work.count} kişi</span>
                                <span className="text-xs font-medium">{formatCurrency(work.cost)}₺</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Services Tab Content */}
                  {activeTab === "services" && (
                    <>
                      <div className="my-3">
                        <div className="flex items-center mb-2">
                          <Tool className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                          <h4 className="text-xs font-semibold text-blue-700">Servisler</h4>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></div>
                              <span className="text-xs">Personel Taşıma</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{data.totalPersonnel} kişi</span>
                              <span className="text-xs font-medium">
                                {formatCurrency(data.totalPersonnelCost * 0.12)}₺
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <Tool className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                          <h4 className="text-xs font-semibold text-blue-700">Ek Hizmetler</h4>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></div>
                              <span className="text-xs">Ekipman Kiralama</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{data.totalDays} gün</span>
                              <span className="text-xs font-medium">
                                {formatCurrency(data.totalPersonnelCost * 0.15)}₺
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-1.5"></div>
                              <span className="text-xs">Yemek Hizmeti</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{data.totalPersonnel} kişi</span>
                              <span className="text-xs font-medium">
                                {formatCurrency(data.totalPersonnelCost * 0.08)}₺
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Invoice Summary Section - Always visible */}
                <div className="bg-blue-50 p-3 rounded-lg mb-3">
                  <h4 className="text-xs font-semibold text-blue-700 mb-2">Fatura Özeti</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Personel Maliyeti:</span>
                      <span className="text-xs font-medium">{formatCurrency(data.totalPersonnelCost)}₺</span>
                    </div>

                    {/* Service cost - 12% of personnel cost */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Servis Maliyeti:</span>
                      <span className="text-xs font-medium">{formatCurrency(data.totalPersonnelCost * 0.12)}₺</span>
                    </div>

                    {/* Additional services - Equipment (15%) + Food (8%) */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Ek Hizmet Maliyeti:</span>
                      <span className="text-xs font-medium">
                        {formatCurrency(data.totalPersonnelCost * 0.15 + data.totalPersonnelCost * 0.08)}₺
                      </span>
                    </div>

                    {/* Total invoice - Personnel + Service (12%) + Equipment (15%) + Food (8%) */}
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-xs font-semibold text-blue-700">Toplam Fatura:</span>
                      <Badge variant="success" className="font-semibold text-xs">
                        {formatCurrency(
                          data.totalPersonnelCost +
                            data.totalPersonnelCost * 0.12 +
                            data.totalPersonnelCost * 0.15 +
                            data.totalPersonnelCost * 0.08,
                        )}
                        ₺
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Download Report Button */}
                <div className="mt-4 mb-4">
                  <Button
                    variant="outline"
                    className="w-full text-sm font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={handleDownloadClick}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Maliyet Raporu İndir
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Floating action buttons */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center px-4 pb-2">
        <div className="bg-white rounded-2xl shadow-md flex items-center p-3">
          <div className="flex gap-4">
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12 shadow-sm opacity-90 hover:opacity-100 disabled:opacity-50"
              onClick={onCancel}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              className="rounded-full h-12 w-12 shadow-sm bg-green-600 hover:bg-green-700 opacity-90 hover:opacity-100 disabled:opacity-50"
              onClick={onConfirm}
              disabled={loading}
            >
              <Check className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <IOSPopup
        isOpen={showDownloadConfirm}
        onClose={() => setShowDownloadConfirm(false)}
        message="Onayda bekleyen tüm günlük puantaj için detaylı maliyet raporu indirmek ister misin?"
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
    </div>
  )
}

