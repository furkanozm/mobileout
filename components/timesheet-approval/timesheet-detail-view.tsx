"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Check, X, Globe, History } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IOSAlert } from "../ui/ios-alert"
import { useState } from "react"
import type { DailyTimesheet } from "./types"
import { Clock } from "lucide-react"

interface TimesheetDetailViewProps {
  timesheet: DailyTimesheet
  onBack: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isApproved: boolean
  isRejected: boolean
  onChangelogClick: () => void
}

export function TimesheetDetailView({
  timesheet,
  onBack,
  onApprove,
  onReject,
  isApproved,
  isRejected,
  onChangelogClick,
}: TimesheetDetailViewProps) {
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [showRejectAlert, setShowRejectAlert] = useState(false)

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center ml-4">
            <Globe className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-blue-600">OutsourceHub</h1>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onChangelogClick}>
          <History className="h-4 w-4 mr-2" />
          Onay Geçmişi
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{timesheet.date}</h2>
                  <p className="text-sm text-muted-foreground border-b border-gray-200 pb-1">
                    Puantaj ID: <span className="font-medium">{timesheet.id}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Firma:</span>
                    <span className="text-sm ml-2">{timesheet.company}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Proje Grubu:</span>
                    <span className="text-sm ml-2">{timesheet.projectGroup}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Proje:</span>
                    <span className="text-sm ml-2">{timesheet.project}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <span className="text-sm font-medium">Toplam Personel:</span>
                    <span className="text-sm ml-2">{timesheet.totalEmployees}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Toplam Mesai:</span>
                    <span className="text-sm ml-2">{timesheet.totalOvertimeHours} saat</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personel</TableHead>
                  <TableHead>İşçilik Türü</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheet.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.employeeName}</TableCell>
                    <TableCell>{entry.laborType}</TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">FM Süresi</p>
                          <p className="text-sm font-bold">{entry.overtimeHours} saat</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{entry.cost}₺</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowRejectAlert(true)}
            disabled={isRejected}
          >
            <X className="h-4 w-4 mr-2" />
            Reddet
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowApproveAlert(true)}
            disabled={isApproved}
          >
            <Check className="h-4 w-4 mr-2" />
            Onayla
          </Button>
        </div>
      </div>

      <IOSAlert
        isOpen={showApproveAlert}
        onClose={() => setShowApproveAlert(false)}
        onConfirm={() => {
          onApprove(timesheet.id)
          setShowApproveAlert(false)
        }}
        title="Puantaj Onayı"
        message={`${timesheet.totalEmployees} personelin toplam ${timesheet.totalOvertimeHours} saatlik fazla mesaisini onaylamak istediğinize emin misiniz?`}
        confirmText="Onayla"
      />

      <IOSAlert
        isOpen={showRejectAlert}
        onClose={() => setShowRejectAlert(false)}
        onConfirm={() => {
          onReject(timesheet.id)
          setShowRejectAlert(false)
        }}
        title="Puantaj Reddi"
        message={`${timesheet.totalEmployees} personelin toplam ${timesheet.totalOvertimeHours} saatlik fazla mesaisini reddetmek istediğinize emin misiniz?`}
        confirmText="Reddet"
        confirmVariant="destructive"
      />
    </div>
  )
}

