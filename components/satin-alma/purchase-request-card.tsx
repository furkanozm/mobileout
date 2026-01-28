"use client"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PurchaseRequest } from "./types"

interface PurchaseRequestCardProps {
  request: PurchaseRequest
  onClick: () => void
  index: number
}

export function PurchaseRequestCard({ request, onClick, index }: PurchaseRequestCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Taslak", className: "bg-gray-100 text-gray-800 border-gray-400" },
      pending: { label: "Beklemede", className: "bg-yellow-100 text-yellow-800 border-yellow-400" },
      approved: { label: "Onaylandı", className: "bg-green-100 text-green-800 border-green-400" },
      rejected: { label: "Reddedildi", className: "bg-red-100 text-red-800 border-red-400" },
      deleted: { label: "Silindi", className: "bg-gray-100 text-gray-800 border-gray-400" },
    }
    return statusMap[status as keyof typeof statusMap]
  }

  const status = getStatusBadge(request.status)

  return (
    <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-700">
          <span>{index}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{request.id}</h3>
              <p className="text-sm text-muted-foreground">{request.requestDate}</p>
            </div>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            {/* Display requester info for internal requests */}
            {request.requestType === "internal" ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">Talep Eden:</span> Kurum İçi
                </p>
                <p className="text-sm">
                  <span className="font-medium">Talep Eden Kişi:</span> {request.requesterName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Departman:</span> {request.requesterDepartment}
                </p>
                {request.isFieldEmployee && request.location && (
                  <p className="text-sm">
                    <span className="font-medium">Lokasyon:</span> {request.location}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm">
                <span className="font-medium">Talep Eden:</span> {request.contractor}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Proje:</span> {request.isForProject ? request.projectId : "Proje Dışı"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Ürün Sayısı:</span> {request.items.length}
            </p>
            <p className="text-sm">
              <span className="font-medium">Termin:</span> {request.deadline}
            </p>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              variant="default"
              size="sm"
              onClick={onClick}
              className="p-2 h-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

