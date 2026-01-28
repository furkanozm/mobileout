"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  Clock,
  DollarSign,
  Briefcase,
  User,
  Calendar,
  Timer,
  Building2,
  FolderGit2,
  Folder,
  Users,
} from "lucide-react"
import { IOSAlert } from "./ui/ios-alert"

interface TimesheetDetailProps {
  onBack: () => void
  entry: {
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
    company: string
    projectGroup: string
    project: string
    subcontractor: string
    additionalLaborType?: string // Add this new field
  }
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isApproved: boolean
  isRejected: boolean
}

export function TimesheetDetail({ onBack, entry, onApprove, onReject, isApproved, isRejected }: TimesheetDetailProps) {
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [showRejectAlert, setShowRejectAlert] = useState(false)

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-blue-600 ml-4">Puantaj Detayı</h1>
      </header>

      <main className="flex-grow p-4 overflow-auto custom-scrollbar">
        <Card className={`mb-4 transition-colors ${isApproved ? "bg-green-100" : isRejected ? "bg-red-50/80" : ""}`}>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="font-semibold text-lg">{entry.employeeName}</h2>
                <p className="text-sm text-muted-foreground">{entry.department}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Firma</p>
                  <p className="text-sm text-muted-foreground">{entry.company}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FolderGit2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Proje Grubu</p>
                  <p className="text-sm text-muted-foreground">{entry.projectGroup}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Folder className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Proje</p>
                  <p className="text-sm text-muted-foreground">{entry.project}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Alt Yüklenici</p>
                  <p className="text-sm text-muted-foreground">{entry.subcontractor}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">İşçilik Türü</p>
                  <p className="text-sm text-muted-foreground">{entry.laborType}</p>
                </div>
              </div>

              {entry.additionalLaborType && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ek İşçilik Türü</p>
                    <p className="text-sm text-muted-foreground">{entry.additionalLaborType}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tarih</p>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mesai Saatleri</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startTime} - {entry.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Toplam Mesai</p>
                  <p className="text-sm font-bold">{entry.overtimeHours} saat</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ücret Bilgisi</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Saat ücreti: <span className="font-bold text-gray-700">{entry.wage}₺</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toplam tutar: <span className="font-bold text-gray-700">{entry.cost}₺</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowRejectAlert(true)}
            disabled={isRejected}
          >
            Reddet
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowApproveAlert(true)}
            disabled={isApproved}
          >
            Onayla
          </Button>
        </div>
      </main>

      <IOSAlert
        isOpen={showApproveAlert}
        onClose={() => setShowApproveAlert(false)}
        onConfirm={() => onApprove(entry.id)}
        title="Puantaj Onayı"
        message={`${entry.employeeName} adlı personelin ${entry.overtimeHours} saatlik fazla mesaisini onaylamak istediğinize emin misiniz?`}
        confirmText="Onayla"
      />

      <IOSAlert
        isOpen={showRejectAlert}
        onClose={() => setShowRejectAlert(false)}
        onConfirm={() => onReject(entry.id)}
        title="Puantaj Reddi"
        message={`${entry.employeeName} adlı personelin ${entry.overtimeHours} saatlik fazla mesaisini reddetmek istediğinize emin misiniz?`}
        confirmText="Reddet"
        confirmVariant="destructive"
      />
    </div>
  )
}

