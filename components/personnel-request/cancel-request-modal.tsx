"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PersonnelRequest } from "./types"

interface CancelRequestModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRequests: PersonnelRequest[]
  onConfirm: (reason: string) => void
}

const CANCEL_REASONS = ["İhtiyaç Kalmadı", "Proje İptal Edildi", "Personel Bulundu", "Bütçe Yetersizliği", "Diğer"]

export function CancelRequestModal({ isOpen, onClose, selectedRequests, onConfirm }: CancelRequestModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/50 flex items-end justify-center">
      <div ref={modalRef} className="bg-white rounded-t-[20px] w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <h2 className="text-lg font-semibold flex-1">Talepleri İptal Et</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>İptal Edilecek Talepler ({selectedRequests.length})</Label>
              <div className="space-y-2">
                {selectedRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-red-50/80 border border-red-100 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{request.date}</p>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        İptal Edilecek
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.company} • {request.projectGroup}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">İptal Nedeni</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="cancelReason" className="bg-white">
                <SelectValue placeholder="İptal nedeni seçin" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[100]">
                {CANCEL_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onConfirm(selectedReason)}
            disabled={!selectedReason}
          >
            Talepleri İptal Et
          </Button>
        </div>
      </div>
    </div>
  )
}

