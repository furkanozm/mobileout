"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PurchaseRequest } from "./types"

interface PurchaseRequestSummaryProps {
  request: PurchaseRequest
}

export function PurchaseRequestSummary({ request }: PurchaseRequestSummaryProps) {
  // Add a safety check for undefined items
  const items = request?.items || []

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Talep No:</span>
              <span>{request?.id || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Durum:</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-400">
                Beklemede
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Talep Tarihi:</span>
              <span>{request?.requestDate || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Termin Tarihi:</span>
              <span>{request?.deadline || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Talep Tipi:</span>
              <span>{request?.requestType === "internal" ? "Kurum İçi" : "Yüklenici"}</span>
            </div>
            {request?.requestType === "contractor" && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Yüklenici:</span>
                  <span>{request?.contractor || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cari Dönem Faturasına Dahil</span>
                  <span className="font-medium">{request?.includeInCurrentBillingPeriod ? "Evet" : "Hayır"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ayrı Fatura Kesilecek</span>
                  <span className="font-medium">{request?.separateInvoice ? "Evet" : "Hayır"}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="font-medium">Proje İçin mi?:</span>
              <span>{request?.isForProject ? "Evet" : "Hayır"}</span>
            </div>
            {request?.isForProject && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Proje ID:</span>
                <span>{request?.projectId || "N/A"}</span>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Talep Edilen Ürünler</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <div className="flex justify-between">
                  <span>{item.product}</span>
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{item.productGroup}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Talep Nedeni:</span>
            <span>{request?.reason || "N/A"}</span>
          </div>
        </Card>
      </div>
    </ScrollArea>
  )
}

