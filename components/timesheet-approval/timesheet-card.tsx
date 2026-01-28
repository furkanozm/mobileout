"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Clock,
  DollarSign,
  Check,
  X,
  CheckCircle2,
  ClipboardCheck,
  Wallet,
  Hammer,
  Truck,
  Package,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Update the interface to match the data structure
interface TimesheetCardProps {
  timesheet: {
    id: string
    date: string
    totalEmployees: number
    totalOvertimeHours: number
    totalCost: number
    extraOvertimeHours?: number
    missingHours?: number
    company: string
    projectGroup?: string
    project?: string
    entries: Array<{
      id: string
      employeeName: string
      tckn: string
      laborType: string
      overtimeHours: number
      wage: number
      cost: number
      startTime: string
      endTime: string
      extraOvertimeHours?: number
      missingHours?: number
    }>
  }
  onApprove?: () => void
  onReject?: () => void
  approvalStatus: "pending" | "approved" | "rejected"
  pendingCount: number
}

// Update the component implementation to use the proper data structure
export function TimesheetCard({ timesheet, onApprove, onReject, approvalStatus, pendingCount }: TimesheetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [bottomNavHeight, setBottomNavHeight] = useState(56) // Default height
  const [status, setStatus] = useState(approvalStatus)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "approved" | "rejected"
    message: string
  }>({ show: false, type: "approved", message: "" })
  const [noPendingItems, setNoPendingItems] = useState(pendingCount === 0)

  // Detect bottom nav height on mount
  useEffect(() => {
    const detectBottomNavHeight = () => {
      const bottomNav = document.querySelector(".bottom-nav")
      if (bottomNav) {
        setBottomNavHeight(bottomNav.clientHeight)
      }
    }

    detectBottomNavHeight()
    window.addEventListener("resize", detectBottomNavHeight)

    return () => {
      window.removeEventListener("resize", detectBottomNavHeight)
    }
  }, [])

  // Auto-hide notification after delay
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }))
        // Check if no pending items after approval/rejection
        if (pendingCount === 0) {
          setNoPendingItems(true)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.show, pendingCount])

  // Handle approve action
  const handleApprove = () => {
    setStatus("approved")
    setNotification({
      show: true,
      type: "approved",
      message: `${timesheet.date} tarihli puantaj başarıyla onaylandı.`,
    })
    if (onApprove) onApprove()
  }

  // Handle reject action
  const handleReject = () => {
    setStatus("rejected")
    setNotification({
      show: true,
      type: "rejected",
      message: `${timesheet.date} tarihli puantaj reddedildi.`,
    })
    if (onReject) onReject()
  }

  // Calculate daily wages count (number of personnel * days)
  const dailyWagesCount = timesheet.entries.length

  // Calculate FM hours if available
  const fmHours = timesheet.entries.reduce((sum, entry) => sum + (entry.extraOvertimeHours || 0), 0)

  // Calculate total paid salary (hakediş)
  const totalPaidSalary = timesheet.entries.reduce((sum, entry) => sum + entry.wage * 7.5, 0)

  // Calculate service costs (12% of personnel cost)
  const serviceCost = Math.round(totalPaidSalary * 0.12)

  // Calculate additional service costs (15% of personnel cost)
  const additionalServiceCost = Math.round(totalPaidSalary * 0.15)

  // Calculate total invoice amount
  const totalInvoiceAmount = totalPaidSalary + serviceCost + additionalServiceCost

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Calculate labor types and counts
  const laborTypeCounts = timesheet.entries.reduce(
    (acc, entry) => {
      const laborType = entry.laborType
      if (!acc[laborType]) {
        acc[laborType] = 0
      }
      acc[laborType]++
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div ref={cardRef} className="relative pb-24">
      {/* Top Notification - Inside phone screen */}
      <div
        className={cn(
          "absolute inset-x-4 transform transition-all duration-300 ease-in-out",
          notification.show ? "top-4 opacity-100" : "-top-full opacity-0",
        )}
      >
        <div className="flex items-center gap-2 bg-black text-white p-3 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      </div>

      {noPendingItems ? (
        // No pending items message
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 p-8">
          <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Onaylanacak Puantaj Kalmadı</h3>
            <p className="text-gray-500 max-w-xs">
              Tüm puantajlar onaylandı. Yeni puantajlar eklendiğinde burada görüntülenecektir.
            </p>
            <div className="border border-blue-200 rounded-lg p-4 mt-4 bg-blue-50 text-blue-700 text-sm">
              Puantaj onay işlemleriniz başarıyla tamamlandı.
            </div>
          </div>
        </div>
      ) : (
        // Regular timesheet content
        <>
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-300 ease-in-out">
            <Tabs defaultValue="details" className="w-full">
              <div className="p-4">
                {/* Header with date and status */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{timesheet.date}</h3>
                    <p className="text-sm text-muted-foreground">#{timesheet.id}</p>
                  </div>
                  <Badge variant={status === "pending" ? "warning" : status === "approved" ? "success" : "destructive"}>
                    {status === "pending" ? "Beklemede" : status === "approved" ? "Onaylandı" : "Reddedildi"}
                  </Badge>
                </div>

                {/* Project Information */}
                <div className="text-sm text-muted-foreground mb-3">
                  {timesheet.company} | {timesheet.projectGroup || "Sera Projeleri"} |{" "}
                  {timesheet.project || "Antalya Domates Serası"}
                </div>

                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="details" className="text-xs">
                    Detaylar
                  </TabsTrigger>
                  <TabsTrigger value="services" className="text-xs">
                    Servisler & Ek Hizmetler
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-0 transition-all duration-300 ease-in-out">
                  {/* Bordered Summary Section - Smaller cards with soft blue background */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50/50 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Personel</p>
                        <p className="text-base font-medium">{timesheet.totalEmployees}</p>
                      </div>
                    </div>
                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50/50 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Günlük Çalışma S.</p>
                        <p className="text-base font-medium">{dailyWagesCount}</p>
                      </div>
                    </div>
                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50/50 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Ödenen Maaş</p>
                        <p className="text-base font-medium">{formatCurrency(totalPaidSalary)}₺</p>
                      </div>
                    </div>
                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50/50 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Toplam Maliyet</p>
                        <p className="text-base font-medium">{formatCurrency(timesheet.totalCost)}₺</p>
                      </div>
                    </div>
                    {fmHours > 0 && (
                      <div className="border border-blue-200 rounded-lg p-2 bg-blue-50/50 flex items-center gap-2 col-span-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">FM Saati</p>
                          <p className="text-base font-medium">{fmHours} saat</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Labor Types Section */}
                  <div className="border border-blue-200 rounded-lg overflow-hidden mb-3">
                    <div className="bg-blue-50 p-2 border-b border-blue-200">
                      <div className="flex items-center gap-2">
                        <Hammer className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium">Yapılan İşçilikler</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(laborTypeCounts).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center gap-1">
                            <span className="text-sm text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                              {type}
                            </span>
                            <div className="inline-flex items-center border rounded-md px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap flex-shrink-0">
                              {count} adet
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="mt-0 transition-all duration-300 ease-in-out">
                  <div className="space-y-3 mb-3">
                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50">
                      <div className="flex items-center mb-2">
                        <Truck className="h-4 w-4 text-blue-600 mr-1.5" />
                        <p className="text-sm font-medium text-blue-700">Servis Hizmetleri</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-1.5 bg-white rounded-md border border-gray-100">
                          <span className="text-sm">Personel Taşıma</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {formatCurrency(serviceCost)}₺
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-2 bg-blue-50">
                      <div className="flex items-center mb-2">
                        <Package className="h-4 w-4 text-blue-600 mr-1.5" />
                        <p className="text-sm font-medium text-blue-700">Ek Hizmetler</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-1.5 bg-white rounded-md border border-gray-100">
                          <span className="text-sm">Ekipman Kiralama</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {formatCurrency(additionalServiceCost)}₺
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Invoice Summary Section */}
            <div className="bg-gray-50 p-3 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Fatura Özeti</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="flex flex-col">
                  <span className="text-gray-500">Personel</span>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs font-medium text-green-700 border-green-200 bg-green-50 justify-center"
                  >
                    {formatCurrency(totalPaidSalary)}₺
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Servis</span>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs font-medium text-blue-700 border-blue-200 bg-blue-50 justify-center"
                  >
                    {formatCurrency(serviceCost)}₺
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Ek Hizmet</span>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs font-medium text-purple-700 border-purple-200 bg-purple-50 justify-center"
                  >
                    {formatCurrency(additionalServiceCost)}₺
                  </Badge>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-800">Fatura Toplamı:</span>
                  <Badge className="text-sm font-bold bg-blue-600 text-white px-2 py-0.5">
                    {formatCurrency(totalInvoiceAmount)}₺
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="mt-4 border rounded-lg overflow-hidden bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 border-b">
              <div className="col-span-6 p-3 border-r">
                <div className="font-medium">Personel Listesi</div>
              </div>
              <div className="col-span-3 p-3 border-r text-center">
                <div className="text-sm font-medium text-gray-600">Hakediş</div>
              </div>
              <div className="col-span-3 p-3 text-center">
                <div className="text-sm font-medium text-green-600">Maliyet</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {timesheet.entries.map((entry) => (
                <div key={entry.id} className="grid grid-cols-12">
                  <div className="col-span-6 p-3 border-r">
                    <div className="font-medium">{entry.employeeName}</div>
                    <div className="text-xs text-gray-500">TCKN: {entry.tckn}</div>
                    <div className="text-xs text-blue-600">{entry.laborType}</div>
                  </div>
                  <div className="col-span-3 p-3 border-r">
                    <div className="text-center">
                      <div className="font-medium text-gray-600">{entry.wage * 7.5}₺</div>
                      <div className="text-xs text-gray-500">{entry.overtimeHours}</div>
                    </div>
                  </div>
                  <div className="col-span-3 p-3">
                    <div className="text-center font-medium text-green-600">{entry.cost}₺</div>
                  </div>
                </div>
              ))}

              {/* Table Footer */}
              <div className="grid grid-cols-12 bg-gray-50">
                <div className="col-span-6 p-3 border-r">
                  <div className="font-medium">Toplam</div>
                </div>
                <div className="col-span-3 p-3 border-r">
                  <div className="text-center font-medium text-gray-600">{totalPaidSalary}₺</div>
                </div>
                <div className="col-span-3 p-3">
                  <div className="text-center font-medium text-green-600">{timesheet.totalCost}₺</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed inset-x-0 bottom-40 z-50 flex justify-center">
        <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex justify-center gap-4">
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12 opacity-60 hover:opacity-100 transition-opacity"
            onClick={handleReject}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 opacity-60 hover:opacity-100 transition-opacity"
            onClick={handleApprove}
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

