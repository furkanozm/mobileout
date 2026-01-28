"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeaveParametersScreenProps {
  onBack?: () => void
}

export function LeaveParametersScreen({ onBack }: LeaveParametersScreenProps) {
  const [activeTab, setActiveTab] = useState("annual")
  const [approvalRequired, setApprovalRequired] = useState(false)

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold ml-2">İzin Parametreleri</h1>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Save className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="annual" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="annual">Yıllık İzin</TabsTrigger>
            <TabsTrigger value="sick">Hastalık İzni</TabsTrigger>
            <TabsTrigger value="other">Diğer İzinler</TabsTrigger>
          </TabsList>

          <TabsContent value="annual" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Yıllık İzin Hakediş Kuralları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-days-1">1-5 yıl arası</Label>
                    <Input id="min-days-1" type="number" defaultValue="14" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-days-2">5-15 yıl arası</Label>
                    <Input id="min-days-2" type="number" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-days-3">15+ yıl</Label>
                    <Input id="min-days-3" type="number" defaultValue="26" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="auto-calculate" defaultChecked />
                  <Label htmlFor="auto-calculate">Otomatik hesapla</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">İzin Onay Süreci</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approval-required"
                    checked={approvalRequired}
                    onCheckedChange={(checked) => setApprovalRequired(checked as boolean)}
                  />
                  <Label htmlFor="approval-required">Onay var mı?</Label>
                </div>

                {/* Conditional approval flow */}
                {approvalRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="approval-flow">Onay Akışı</Label>
                    <Select defaultValue="manager-hr">
                      <SelectTrigger id="approval-flow">
                        <SelectValue placeholder="Onay akışı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Sadece Yönetici</SelectItem>
                        <SelectItem value="manager-hr">Yönetici ve İK</SelectItem>
                        <SelectItem value="manager-hr-director">Yönetici, İK ve Direktör</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-approve" />
                  <Label htmlFor="auto-approve">3 günden az izinleri otomatik onayla</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-consecutive-days">Tek seferde kullanılacak maksimum izin (gün)</Label>
                  <Input id="max-consecutive-days" type="number" defaultValue="21" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Departman İzin Planlaması</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-dept-leave">Departmandan aynı anda izinde olabilecek maksimum kişi</Label>
                  <Input id="max-dept-leave" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-staff-required">Minimum bulunması gereken personel sayısı</Label>
                  <Input id="min-staff-required" type="number" defaultValue="2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sick" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hastalık İzni Kuralları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-sick-days">Yıllık Maksimum Hastalık İzni (gün)</Label>
                  <Input id="max-sick-days" type="number" defaultValue="10" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="require-report" defaultChecked />
                  <Label htmlFor="require-report">Rapor zorunluluğu</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-days">Kaç günden sonra rapor zorunlu</Label>
                  <Input id="report-days" type="number" defaultValue="3" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Diğer İzin Türleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marriage-leave">Evlilik İzni (gün)</Label>
                  <Input id="marriage-leave" type="number" defaultValue="3" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bereavement-leave">Ölüm İzni (gün)</Label>
                  <Input id="bereavement-leave" type="number" defaultValue="3" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paternity-leave">Doğum İzni - Baba (gün)</Label>
                  <Input id="paternity-leave" type="number" defaultValue="5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maternity-leave">Doğum İzni - Anne (hafta)</Label>
                  <Input id="maternity-leave" type="number" defaultValue="16" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 bg-white border-t">
        <Button className="w-full">Değişiklikleri Kaydet</Button>
      </div>
    </div>
  )
}

