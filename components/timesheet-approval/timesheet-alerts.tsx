"use client"

import { IOSAlert } from "../ui/ios-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TimesheetAlertsProps {
  showApproveAlert: boolean
  showRejectAlert: boolean
  onApproveClose: () => void
  onRejectClose: () => void
  onApproveConfirm: () => void
  onRejectConfirm: () => void
  onRejectReasonChange: (reason: string) => void
  rejectionReasons: string[]
}

export function TimesheetAlerts({
  showApproveAlert,
  showRejectAlert,
  onApproveClose,
  onRejectClose,
  onApproveConfirm,
  onRejectConfirm,
  onRejectReasonChange,
  rejectionReasons,
}: TimesheetAlertsProps) {
  const [customRejectionReason, setCustomRejectionReason] = useState("")

  return (
    <>
      <IOSAlert
        isOpen={showApproveAlert}
        onClose={onApproveClose}
        onConfirm={onApproveConfirm}
        title="Puantaj Onayı"
        message="Seçili günlük puantajları onaylamak istediğinize emin misiniz?"
        confirmText="Onayla"
      />

      <IOSAlert
        isOpen={showRejectAlert}
        onClose={onRejectClose}
        onConfirm={() => {
          if (customRejectionReason !== "") {
            onRejectReasonChange(customRejectionReason)
          }
          onRejectConfirm()
        }}
        title="Puantaj Reddi"
        message={
          <>
            <p className="mb-4">Seçili günlük puantajları reddetmek istediğinize emin misiniz?</p>
            <Select
              onValueChange={(value) => {
                if (value === "Diğer") {
                  setCustomRejectionReason("")
                }
                onRejectReasonChange(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Red nedeni seçin" />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
                <SelectItem value="Diğer">Diğer</SelectItem>
              </SelectContent>
            </Select>
            {customRejectionReason !== "" && (
              <Input
                placeholder="Red nedenini yazın"
                value={customRejectionReason}
                onChange={(e) => setCustomRejectionReason(e.target.value)}
                className="mt-2"
              />
            )}
          </>
        }
        confirmText="Reddet"
        confirmVariant="destructive"
      />
    </>
  )
}

