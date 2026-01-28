"use client"

import { useState } from "react"
import { X, Check, Clock, DollarSign, FolderKanban, PenToolIcon as Tool, Truck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface PersonnelListScreenProps {
  onBack: () => void
  personnel: any[]
  timesheetId: string
  date: string
  onApprove: () => void
  onReject: () => void
  company?: string
  projectGroup?: string
  project?: string
  isDetailView?: boolean
}

export function PersonnelListScreen({
  onBack,
  personnel,
  timesheetId,
  date,
  onApprove,
  onReject,
  company = "Sera Tarım A.Ş.",
  projectGroup = "Sera Projeleri",
  project = "Antalya Domates Serası",
  isDetailView = false,
}: PersonnelListScreenProps) {
  const [selectedPersonnel, setSelectedPersonnel] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("personnel")

  // Lokal quick approval state (ileride parent ile senkronize edilebilir)
  const [isQuickApprovalEnabled, setIsQuickApprovalEnabled] = useState(false)
  const [isBulkQuickApprovalEnabled, setIsBulkQuickApprovalEnabled] = useState(false)

  // Mock personnel data with costs
  const mockPersonnel = [
    {
      id: "1",
      name: "Ahmet Yılmaz",
      tckn: "12345678901",
      workType: "Budama",
      hours: 7.5,
      rate: 70,
      totalEarnings: 525,
      totalCost: 892.5, // Example: earnings + employer costs
      dailyWages: 1,
      additionalLaborType: "Budama",
    },
    {
      id: "2",
      name: "Mehmet Kaya",
      tckn: "23456789012",
      workType: "Sulama",
      hours: 7.5,
      rate: 70,
      totalEarnings: 525,
      totalCost: 892.5,
      dailyWages: 1,
      additionalLaborType: null,
    },
    {
      id: "3",
      name: "Ayşe Demir",
      tckn: "34567890123",
      workType: "İlaçlama",
      hours: 7.5,
      rate: 70,
      totalEarnings: 525,
      totalCost: 892.5,
      dailyWages: 1,
      additionalLaborType: "İlaçlama",
    },
  ]

  // Mock additional services data
  const mockAdditionalServices = [
    { id: "1", name: "Ekstra Sulama", cost: 250 },
    { id: "2", name: "Gece Nöbeti", cost: 350 },
    { id: "3", name: "KKD (Kişisel Koruyucu Donanım)", cost: 180 },
    { id: "4", name: "Ferdi Kaza Sigortası", cost: 120 },
  ]

  // Mock services data with categories
  const mockServices = [
    { id: "1", name: "Araç Kiralama", cost: 500, details: "Kamyonet - 1 gün", category: "sefer" },
    { id: "2", name: "Ekipman Kiralama", cost: 300, details: "Sulama Sistemi", category: "sefer" },
    { id: "3", name: "Personel Servisi", cost: 25, details: "Tek Yön", category: "kisiBasiSefer" },
    { id: "4", name: "Öğle Yemeği", cost: 40, details: "Kumanya", category: "kisiBasiSefer" },
  ]

  // Extra cost
  const extraCost = 1000 // Ekstra Servis Sefer - 1000 TL

  // Group services by category
  const seferServices = mockServices.filter((service) => service.category === "sefer")
  const kisiBasiServices = mockServices.filter((service) => service.category === "kisiBasiSefer")

  // Calculate total cost
  const totalCost = mockPersonnel.reduce((sum, person) => sum + person.totalCost, 0)
  const totalHours = mockPersonnel.reduce((sum, person) => sum + person.hours, 0)
  const totalAdditionalServicesCost = 900 // Fixed at 900₺ as requested
  const totalSeferServicesCost = seferServices.reduce((sum, service) => sum + service.cost, 0)
  const totalKisiBasiServicesCost =
    kisiBasiServices.reduce((sum, service) => sum + service.cost, 0) * mockPersonnel.length
  const totalServicesCost = totalSeferServicesCost + totalKisiBasiServicesCost
  const totalOtherCosts = totalAdditionalServicesCost + totalServicesCost + extraCost

  // Render different content based on view mode
  const renderPersonnelTabContent = () => {
    if (isDetailView) {
      // Detail view - no quick approval toggle
      return (
        <TabsContent value="personnel" className="mt-0">
          {/* Summary Stats - No border-t in detail view */}
          <div className="p-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                {/* Company and Project Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200 font-medium px-3 py-1 text-sm"
                    >
                      {company}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md border border-blue-100">
                    <FolderKanban className="h-3.5 w-3.5 text-blue-600" />
                    <div className="text-sm">
                      <span className="font-medium">{projectGroup}</span>
                      <span className="mx-1">•</span>
                      <span>{project}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium">Yevmiye Sayısı:</span>
                    </div>
                    <div className="text-base font-bold">
                      {mockPersonnel.reduce((sum, person) => sum + person.dailyWages, 0)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Tool className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium whitespace-nowrap">Ek Hiz.:</span>
                    </div>
                    <div className="text-base font-bold">{totalAdditionalServicesCost}₺</div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Truck className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium">Servisler:</span>
                    </div>
                    <div className="text-base font-bold">{totalServicesCost}₺</div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium whitespace-nowrap">Top. Mal.:</span>
                    </div>
                    <div className="text-base font-bold">
                      {mockPersonnel.reduce((sum, person) => sum + person.totalCost, 0) +
                        totalAdditionalServicesCost +
                        totalServicesCost +
                        extraCost}
                      ₺
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      )
    } else {
      // Normal view - with quick approval toggle
      return (
        <TabsContent value="personnel" className="mt-0">
          {/* Quick Approval Toggle */}
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="personnel-quick-approval"
                  checked={isQuickApprovalEnabled}
                  onCheckedChange={(value) => {
                    setIsQuickApprovalEnabled(value)
                    // Hızlı Onay kapatılırsa Toplu Hızlı Onay'ı da kapat
                    if (!value) {
                      setIsBulkQuickApprovalEnabled(false)
                    }
                  }}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Hızlı Onay</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="personnel-bulk-quick-approval"
                  checked={isBulkQuickApprovalEnabled}
                  onCheckedChange={setIsBulkQuickApprovalEnabled}
                  disabled={!isQuickApprovalEnabled}
                  className="data-[state=checked]:bg-green-600"
                />
                <span
                  className={`text-sm font-medium ${
                    isQuickApprovalEnabled ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  Toplu Hızlı Onay
                </span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-4 border-t">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                {/* Company and Project Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200 font-medium px-3 py-1 text-sm"
                    >
                      {company}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md border border-blue-100">
                    <FolderKanban className="h-3.5 w-3.5 text-blue-600" />
                    <div className="text-sm">
                      <span className="font-medium">{projectGroup}</span>
                      <span className="mx-1">•</span>
                      <span>{project}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium">Yevmiye Sayısı:</span>
                    </div>
                    <div className="text-base font-bold">
                      {mockPersonnel.reduce((sum, person) => sum + person.dailyWages, 0)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Tool className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium whitespace-nowrap">Ek Hiz.:</span>
                    </div>
                    <div className="text-base font-bold">{totalAdditionalServicesCost}₺</div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <Truck className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium">Servisler:</span>
                    </div>
                    <div className="text-base font-bold">{totalServicesCost}₺</div>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <div className="flex items-center text-blue-600">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-medium whitespace-nowrap">Top. Mal.:</span>
                    </div>
                    <div className="text-base font-bold">
                      {mockPersonnel.reduce((sum, person) => sum + person.totalCost, 0) +
                        totalAdditionalServicesCost +
                        totalServicesCost +
                        extraCost}
                      ₺
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      )
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative">
      {/* Tabs and Quick Approval Toggle */}
      <div className="bg-white border-b">
        <Tabs defaultValue="personnel" className="w-full" onValueChange={setActiveTab}>
          <div className="px-2 pt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="personnel">Personel Mal.</TabsTrigger>
              <TabsTrigger value="other">Diğer...</TabsTrigger>
            </TabsList>
          </div>

          {/* Render different content based on view mode */}
          {renderPersonnelTabContent()}

          <TabsContent value="other" className="mt-0 p-4 border-t">
            <div className="space-y-4">
              {/* Additional Services Section */}
              <div className="bg-white rounded-lg border p-3 shadow-sm">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Tool className="h-4 w-4 mr-1 text-blue-600" />
                  Ek Hizmetler
                </h3>

                {/* KKD Subheading */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-600">KKD</h4>
                  <div className="text-sm font-medium text-green-600">500₺</div>
                </div>

                {/* Ferdi Kaza Sigortası Subheading */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-600">Ferdi Kaza Sigortası</h4>
                  <div className="text-sm font-medium text-green-600">400₺</div>
                </div>

                {/* Total Additional Services */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Ek Hizmetler Toplamı</div>
                    <div className="text-sm font-bold text-green-600">900₺</div>
                  </div>
                </div>
              </div>

              {/* Services Section - Combined */}
              <div className="bg-white rounded-lg border p-3 shadow-sm">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-blue-600" />
                  Servisler
                </h3>

                {/* Sefer Subheading */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-600">Sefer</h4>
                  <div className="text-sm font-medium text-green-600">{totalSeferServicesCost}₺</div>
                </div>

                {/* Kişi Başı Subheading */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-600">Kişi Başı ({mockPersonnel.length} kişi)</h4>
                  <div className="text-sm font-medium text-green-600">{totalKisiBasiServicesCost}₺</div>
                </div>

                {/* Total Services */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Servisler Toplamı</div>
                    <div className="text-sm font-bold text-green-600">{totalServicesCost}₺</div>
                  </div>
                </div>
              </div>

              {/* Extra Cost Section */}
              <div className="bg-white rounded-lg border p-3 shadow-sm">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                  Sonradan eklenen Ekstra Maliyet
                </h3>

                {/* Extra Service */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-600">Ekstra Servis Sefer</h4>
                  <div className="text-sm font-medium text-amber-500">1000₺</div>
                </div>

                {/* Total Extra Cost */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Ekstra Maliyet Toplamı</div>
                    <div className="text-sm font-bold text-amber-500">1000₺</div>
                  </div>
                </div>
              </div>

              {/* Total Other Costs */}
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                    Ek maliyetler toplamı
                  </div>
                  <div className="font-bold text-green-600">{totalOtherCosts}₺</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Personnel List - Only show when personnel tab is active */}
      {activeTab === "personnel" && (
        <div className="flex-1 overflow-auto bg-white">
          <div className="mx-2 my-2 border border-gray-200 rounded-md overflow-hidden">
            {/* Column Headers */}
            <div className="grid grid-cols-12 border-b bg-gray-50 sticky top-0 z-10">
              <div className="col-span-1 px-2 py-2 border-r flex items-center justify-center">
                <div className="text-xs font-medium text-gray-600">S</div>
              </div>
              <div className="col-span-5 px-3 py-2 border-r">
                <div className="text-sm font-medium">Personel Listesi</div>
              </div>
              <div className="col-span-3 px-3 py-2 border-r flex items-center justify-center">
                <div className="text-sm font-medium text-gray-600">Hakediş</div>
              </div>
              <div className="col-span-3 px-3 py-2 flex items-center justify-center">
                <div className="text-sm font-medium text-green-600">Maliyet</div>
              </div>
            </div>

            <div className="divide-y">
              {mockPersonnel.map((person, index) => (
                <div key={person.id} className="grid grid-cols-12 border-b border-gray-200">
                  <div className="col-span-1 p-2 border-r flex items-center justify-center">
                    <div className="text-xs font-medium text-gray-600">{index + 1}</div>
                  </div>
                  <div className="col-span-5 p-3 border-r">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-xs text-gray-500">{person.tckn}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="blue" className="text-xs">
                        {person.workType}
                      </Badge>
                    </div>
                    {/* If the employee has an additional labor type, display it */}
                    {person.additionalLaborType && person.additionalLaborType !== person.workType && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {person.additionalLaborType}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 p-3 border-r flex flex-col justify-center items-center">
                    <div className="text-gray-600 font-medium pb-2 border-b w-full text-center">
                      {person.totalEarnings}₺
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      <span>{person.hours} saat</span>
                    </div>
                  </div>
                  <div className="col-span-3 p-3 flex items-center justify-center">
                    <div className="text-green-600 font-medium">{person.totalCost}₺</div>
                  </div>
                </div>
              ))}

              {/* Total Cost Summary */}
              <div className="grid grid-cols-12 bg-gray-50">
                <div className="col-span-1 p-2 border-r"></div>
                <div className="col-span-5 p-3 border-r">
                  <div className="font-medium">Toplam</div>
                </div>
                <div className="col-span-3 p-3 border-r flex items-center justify-center">
                  <div className="font-medium text-gray-600">
                    {mockPersonnel.reduce((sum, person) => sum + person.totalEarnings, 0)}₺
                  </div>
                </div>
                <div className="col-span-3 p-3 flex items-center justify-center">
                  <div className="font-medium text-green-600">
                    {mockPersonnel.reduce((sum, person) => sum + person.totalCost, 0)}₺
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty space for "Diğer..." tab */}
      {activeTab === "other" && <div className="flex-1 bg-gray-50"></div>}

      {/* Floating Action Buttons - Only show in non-detail view */}
      {!isDetailView && (
        <div className="fixed bottom-28 left-0 right-0 flex justify-center px-4 pb-2">
          <div className="bg-white rounded-xl shadow-md flex gap-4 p-3 opacity-60 hover:opacity-100 transition-opacity">
            <Button variant="destructive" size="icon" className="rounded-full h-12 w-12 shadow-sm" onClick={onReject}>
              <X className="h-6 w-6" />
            </Button>
            <Button className="rounded-full h-12 w-12 shadow-sm bg-green-600 hover:bg-green-700" onClick={onApprove}>
              <Check className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

