"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { IOSPopup } from "@/components/shared/ios-popup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimesheetSummaryProps {
  selectedCount: number
  stats: {
    personnel: number
    dailyWage: number
    days: number
  }
  workTypes: Array<{
    name: string
    personCount: number
    days: number
    cost: number
  }>
  totalPersonnelCost: number
  totalCost: number
  onApprove: () => void
  onReject: () => void
}

// Örnek servis maliyetleri
const serviceCosts = [
  { name: "Personel Servisi", cost: 1250.0, trips: 45 },
  { name: "Malzeme Taşıma", cost: 850.0, trips: 12 },
]

// Örnek ek hizmet maliyetleri
const additionalServices = [
  { name: "İş Güvenliği Ekipmanları", cost: 750.0 },
  { name: "Eğitim Hizmetleri", cost: 500.0 },
  { name: "Araç Kiralama", cost: 1200.0 },
]

export function TimesheetSummary({
  selectedCount,
  stats,
  workTypes,
  totalPersonnelCost,
  totalCost,
  onApprove,
  onReject,
}: TimesheetSummaryProps) {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [activeTab, setActiveTab] = useState("ozet")

  const totalServiceCost = serviceCosts.reduce((sum, service) => sum + service.cost, 0)
  const totalAdditionalCost = additionalServices.reduce((sum, service) => sum + service.cost, 0)
  const grandTotal = totalCost + totalServiceCost + totalAdditionalCost

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
    <div className="bg-white rounded-t-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-blue-600 font-medium">Seçilen Puantaj Özeti</h3>
        <Badge variant="outline" className="text-xs">
          {selectedCount} Seçili
        </Badge>
      </div>

      <Tabs defaultValue="ozet" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="ozet">Özet</TabsTrigger>
          <TabsTrigger value="servisler">Servisler</TabsTrigger>
          <TabsTrigger value="ek-hizmetler">Ek Hizmetler</TabsTrigger>
        </TabsList>

        <TabsContent value="ozet">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-blue-600 text-xs block mb-1">Personel:</span>
              <span className="font-medium">{stats.personnel}</span>
            </div>
            <div>
              <span className="text-blue-600 text-xs block mb-1">Yevmiye:</span>
              <span className="font-medium">{stats.dailyWage}</span>
            </div>
            <div>
              <span className="text-blue-600 text-xs block mb-1">Gün:</span>
              <span className="font-medium">{stats.days}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-blue-600 text-xs font-medium mb-2">Yapılan İşçilikler</h4>
            <div className="space-y-2">
              {workTypes.map((work, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{work.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">
                      {work.personCount} kişi {work.days} yev.
                    </span>
                    <span className="font-medium">{work.cost.toFixed(2)}₺</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-4 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 text-xs">Personel Hakediş:</span>
              <span className="font-medium">{totalPersonnelCost.toFixed(2)}₺</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 text-xs">Servis Maliyetleri:</span>
              <span className="font-medium">{totalServiceCost.toFixed(2)}₺</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 text-xs">Ek Hizmet Maliyetleri:</span>
              <span className="font-medium">{totalAdditionalCost.toFixed(2)}₺</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-blue-600 text-xs">Toplam Maliyet:</span>
              <Badge variant="success" className="ml-1">
                {grandTotal.toFixed(2)}₺
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="servisler">
          <div className="space-y-3">
            <h4 className="text-blue-600 text-xs font-medium">Servis Maliyetleri</h4>
            {serviceCosts.map((service, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{service.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">{service.trips} sefer</span>
                  <span className="font-medium">{service.cost.toFixed(2)}₺</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-blue-600 text-xs">Toplam Servis Maliyeti:</span>
              <Badge variant="success" className="ml-1">
                {totalServiceCost.toFixed(2)}₺
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ek-hizmetler">
          <div className="space-y-3">
            <h4 className="text-blue-600 text-xs font-medium">Ek Hizmet Maliyetleri</h4>
            {additionalServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{service.name}</span>
                </div>
                <span className="font-medium text-xs">{service.cost.toFixed(2)}₺</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-blue-600 text-xs">Toplam Ek Hizmet Maliyeti:</span>
              <Badge variant="success" className="ml-1">
                {totalAdditionalCost.toFixed(2)}₺
              </Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Download Report Button */}
      <Button
        variant="outline"
        className="w-full text-sm font-medium text-blue-600 border-blue-200 hover:bg-blue-50 mb-4"
        onClick={handleDownloadClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Maliyet Raporu İndir
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="destructive" className="w-full" onClick={onReject}>
          {selectedCount} Adet Reddet
        </Button>
        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={onApprove}>
          {selectedCount} Adet Onayla
        </Button>
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

