"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, X, Check, Users, Clock, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PersonnelRequest } from "./types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface RequestListProps {
  requests: PersonnelRequest[]
  selectedRequests: Set<string>
  onSelectRequest: (id: string, checked: boolean) => void
  expandedId: string | null
  onExpandedChange: (id: string | null) => void
  isAllSelected: boolean
  onInfoClick: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

// Helper function to truncate text and add tooltip if needed
const TruncatedText = ({ text, maxLength = 20 }: { text: string; maxLength?: number }) => {
  if (text.length <= maxLength) return <span>{text}</span>

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{text.substring(0, maxLength)}...</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function RequestList({
  requests,
  selectedRequests,
  onSelectRequest,
  expandedId,
  onExpandedChange,
  isAllSelected,
  onInfoClick,
  onApprove,
  onReject,
}: RequestListProps) {
  return (
    <div className="space-y-0 border-t border-l border-r w-full">
      {requests.map((request, index) => (
        <Card
          key={request.id}
          className={cn(
            "rounded-none border-b w-full transition-opacity duration-200",
            expandedId && expandedId !== request.id && "opacity-50",
          )}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200",
                  selectedRequests.has(request.id) || isAllSelected
                    ? "bg-blue-100 border-2 border-blue-600 text-blue-700 font-bold scale-110 shadow-sm"
                    : "bg-blue-50 border-2 border-blue-200 text-blue-700 hover:border-blue-300",
                )}
                onClick={() => onSelectRequest(request.id, !selectedRequests.has(request.id))}
              >
                {index + 1}
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {request.date} <span className="text-sm text-muted-foreground">#{request.id}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {request.company} • {request.projectGroup}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-black text-black">
                        <Clock className="w-3 h-3 mr-1" />
                        {request.createdAt || "15.02.2024 14:30"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="text-white bg-blue-600 hover:bg-blue-700 h-7 w-7 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onInfoClick(request.id)
                      }}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                    {onReject && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          onReject(request.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {onApprove && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          onApprove(request.id)
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Personel:</span>
                    <span className="font-medium">{request.numberOfPeople}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2.5 py-0.5 whitespace-nowrap",
                      request.status === "approved" && "bg-green-100 text-green-800 border-green-200",
                      (request.status === "rejected" || request.status === "cancelled") &&
                        "bg-red-100 text-red-800 border-red-200",
                      request.status === "pending" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                    )}
                  >
                    {request.status === "approved"
                      ? "Onaylandı"
                      : request.status === "rejected"
                        ? "Reddedildi"
                        : request.status === "cancelled"
                          ? "İptal Edildi"
                          : "Onay Bekliyor"}
                  </Badge>
                </div>

                <Separator className="my-2" />

                <div className="flex gap-4 pl-0.5">
                  <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                    <Briefcase className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-muted-foreground">Görev:</span>
                    <span className="font-medium">
                      <TruncatedText text={request.jobType} />
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                    <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-muted-foreground">Süre:</span>
                    <span className="font-medium">
                      <TruncatedText text={request.duration} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

