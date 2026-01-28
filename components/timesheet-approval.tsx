"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TimesheetDetail } from "./timesheet-detail"
import { IOSAlert } from "./ui/ios-alert"

interface TimesheetApprovalProps {
  onBack: () => void
}

interface TimesheetEntry {
  id: string
  employeeName: string
  laborType: string
  overtimeHours: number
  wage: number
  cost: number
  date: string
  department: string
  startTime: string
  endTime: string
}

const sampleData: TimesheetEntry[] = [
  {
    id: "1",
    employeeName: "Ahmet Yılmaz",
    laborType: "Üretim İşçiliği",
    overtimeHours: 2.5,
    wage: 150,
    cost: 375,
    date: "15.02.2024",
    department: "Üretim Departmanı",
    startTime: "17:00",
    endTime: "19:30",
  },
  {
    id: "2",
    employeeName: "Mehmet Demir",
    laborType: "Montaj İşçiliği",
    overtimeHours: 3,
    wage: 160,
    cost: 480,
    date: "15.02.2024",
    department: "Montaj Departmanı",
    startTime: "17:00",
    endTime: "20:00",
  },
  {
    id: "3",
    employeeName: "Ayşe Kaya",
    laborType: "Kalite Kontrol",
    overtimeHours: 2,
    wage: 175,
    cost: 350,
    date: "15.02.2024",
    department: "Kalite Departmanı",
    startTime: "17:00",
    endTime: "19:00",
  },
]

export function TimesheetApproval({ onBack }: TimesheetApprovalProps) {
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null)
  const [approvedEntries, setApprovedEntries] = useState<Set<string>>(new Set())
  const [rejectedEntries, setRejectedEntries] = useState<Set<string>>(new Set())
  const [showApproveAllAlert, setShowApproveAllAlert] = useState(false)
  const [showRejectAllAlert, setShowRejectAllAlert] = useState(false)
  const [entryToApprove, setEntryToApprove] = useState<string | null>(null)
  const [entryToReject, setEntryToReject] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setApprovedEntries(new Set([...approvedEntries, id]))
    setRejectedEntries(new Set([...rejectedEntries].filter((x) => x !== id)))
  }

  const handleReject = (id: string) => {
    setRejectedEntries(new Set([...rejectedEntries, id]))
    setApprovedEntries(new Set([...approvedEntries].filter((x) => x !== id)))
  }

  const handleApproveAll = () => {
    const allIds = sampleData.map((entry) => entry.id)
    setApprovedEntries(new Set(allIds))
    setRejectedEntries(new Set())
  }

  const handleRejectAll = () => {
    const allIds = sampleData.map((entry) => entry.id)
    setRejectedEntries(new Set(allIds))
    setApprovedEntries(new Set())
  }

  if (selectedEntry) {
    return (
      <TimesheetDetail
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproved={approvedEntries.has(selectedEntry.id)}
        isRejected={rejectedEntries.has(selectedEntry.id)}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-blue-600 ml-4">Puantaj Onayı</h1>
      </header>

      <main className="flex-grow overflow-auto">
        <div className="p-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">15 Şubat 2024 - Günlük Puantaj</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Toplam 3 personel, 7.5 saat fazla mesai</p>
            </CardContent>
          </Card>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-4">
            {sampleData.map((entry) => (
              <Card
                key={entry.id}
                className={`relative transition-colors ${
                  approvedEntries.has(entry.id) ? "bg-green-100" : rejectedEntries.has(entry.id) ? "bg-red-50/80" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{entry.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">{entry.laborType}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEntry(entry)}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="font-medium">{entry.overtimeHours}</span> saat,{" "}
                      <span className="font-medium">{entry.cost}₺</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setEntryToReject(entry.id)}
                      >
                        <X className={`h-5 w-5 ${rejectedEntries.has(entry.id) ? "text-red-600" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setEntryToApprove(entry.id)}
                      >
                        <Check className={`h-5 w-5 ${approvedEntries.has(entry.id) ? "text-green-600" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="destructive" className="flex-1" onClick={() => setShowRejectAllAlert(true)}>
              Tümünü Reddet
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setShowApproveAllAlert(true)}>
              Tümünü Onayla
            </Button>
          </div>
        </div>
      </main>

      <IOSAlert
        isOpen={showApproveAllAlert}
        onClose={() => setShowApproveAllAlert(false)}
        onConfirm={handleApproveAll}
        title="Tümünü Onayla"
        message="Tüm puantajları onaylamak istediğinize emin misiniz?"
        confirmText="Onayla"
      />

      <IOSAlert
        isOpen={showRejectAllAlert}
        onClose={() => setShowRejectAllAlert(false)}
        onConfirm={handleRejectAll}
        title="Tümünü Reddet"
        message="Tüm puantajları reddetmek istediğinize emin misiniz?"
        confirmText="Reddet"
        confirmVariant="destructive"
      />

      <IOSAlert
        isOpen={!!entryToApprove}
        onClose={() => setEntryToApprove(null)}
        onConfirm={() => {
          if (entryToApprove) handleApprove(entryToApprove)
          setEntryToApprove(null)
        }}
        title="Puantaj Onayı"
        message={`${sampleData.find((e) => e.id === entryToApprove)?.employeeName || ""} adlı personelin fazla mesaisini onaylamak istediğinize emin misiniz?`}
        confirmText="Onayla"
      />

      <IOSAlert
        isOpen={!!entryToReject}
        onClose={() => setEntryToReject(null)}
        onConfirm={() => {
          if (entryToReject) handleReject(entryToReject)
          setEntryToReject(null)
        }}
        title="Puantaj Reddi"
        message={`${sampleData.find((e) => e.id === entryToReject)?.employeeName || ""} adlı personelin fazla mesaisini reddetmek istediğinize emin misiniz?`}
        confirmText="Reddet"
        confirmVariant="destructive"
      />
    </div>
  )
}

