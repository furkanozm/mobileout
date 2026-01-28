"use client"

import { FileText, Users, Briefcase, Calendar, Clock, MapPin, X } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PersonnelRequest } from "./types"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface RequestDetailScreenProps {
  request: PersonnelRequest
  onBack: () => void
}

export function RequestDetailScreen({ request, onBack }: RequestDetailScreenProps) {
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Varsayılan oluşturma tarihi ve saati
  const createdAtText = request.createdAt || "15.02.2024 14:30"

  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=Ege+Üniversitesi`, "_blank")
  }

  // iOS sheet animasyonu için useEffect
  useEffect(() => {
    if (isLocationSheetOpen) {
      if (overlayRef.current) {
        overlayRef.current.style.display = "block"
        setTimeout(() => {
          if (overlayRef.current) overlayRef.current.style.opacity = "1"
        }, 10)
      }

      if (sheetRef.current) {
        sheetRef.current.style.display = "block"
        setTimeout(() => {
          if (sheetRef.current) sheetRef.current.style.transform = "translateY(0)"
        }, 10)
      }
    } else {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = "0"
        setTimeout(() => {
          if (overlayRef.current) overlayRef.current.style.display = "none"
        }, 300)
      }

      if (sheetRef.current) {
        sheetRef.current.style.transform = "translateY(100%)"
        setTimeout(() => {
          if (sheetRef.current) sheetRef.current.style.display = "none"
        }, 300)
      }
    }
  }, [isLocationSheetOpen])

  return (
    <div className="h-full flex flex-col bg-blue-50 relative">
      <ScrollArea className="flex-grow pb-20">
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{request.date}</CardTitle>
                  <p className="text-sm text-muted-foreground">Talep ID: {request.id}</p>
                </div>
                <Badge
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-semibold",
                    request.status === "approved" && "bg-green-100 text-green-800",
                    (request.status === "rejected" || request.status === "cancelled") && "bg-red-100 text-red-800",
                    request.status === "pending" && "bg-yellow-100 text-yellow-800",
                  )}
                >
                  {request.status === "approved"
                    ? "Onaylandı"
                    : request.status === "rejected"
                      ? "Reddedildi"
                      : request.status === "cancelled"
                        ? "İptal Edildi"
                        : "Beklemede"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {request.company} | {request.projectGroup} | {request.project}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs border-black/70 text-black/70 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {createdAtText}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-blue-600"
                    onClick={() => setIsLocationSheetOpen(true)}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Lokasyon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <RequestDetails request={request} />
        </div>
      </ScrollArea>

      {/* iOS tarzı location sheet */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 z-40"
        style={{ display: "none" }}
        onClick={() => setIsLocationSheetOpen(false)}
      />

      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 transition-transform duration-300 transform translate-y-full"
        style={{ display: "none" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lokasyon</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsLocationSheetOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium">{request.project}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {request.company}, {request.projectGroup}
            </p>
          </div>

          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fBUGdp5cAzfDqZ1c54Ymw2BbpotFCd.png"
              alt="Location Map"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGetDirections}>
                <MapPin className="h-4 w-4 mr-2" />
                Konuma Git
              </Button>
            </div>
          </div>

          <Button className="w-full" onClick={() => setIsLocationSheetOpen(false)}>
            Kapat
          </Button>
        </div>
      </div>
    </div>
  )
}

function RequestDetails({ request }: { request: PersonnelRequest }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">İş Türü</p>
              <p className="text-sm text-muted-foreground">{request.jobType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Personel Sayısı</p>
              <p className="text-sm text-muted-foreground">{request.numberOfPeople}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Süre</p>
              <p className="text-sm text-muted-foreground">
                {request.duration} • {request.startDate} - {request.endDate}
              </p>
            </div>
          </div>
          {request.notes && (
            <div className="col-span-2 flex items-start gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Notlar</p>
                <p className="text-sm text-muted-foreground">{request.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

