"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge-extended"
import { Check, X, User } from "lucide-react"
import type { Participant } from "./types"

interface ParticipantCardProps {
  participant: Participant
  isSelected: boolean
  onSelect: (id: number) => void
  onMarkAttendance: (id: number, status: "attended" | "absent") => void
  anySelected?: boolean
}

export function ParticipantCard({
  participant,
  isSelected,
  onSelect,
  onMarkAttendance,
  anySelected,
}: ParticipantCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge variant="success">Katıldı</Badge>
      case "absent":
        return <Badge variant="destructive">Katılmadı</Badge>
      case "pending":
        return <Badge variant="outline">Beklemede</Badge>
      default:
        return <Badge variant="outline">Belirsiz</Badge>
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2">
        <div className="flex items-center">
          <Checkbox
            id={`participant-${participant.id}`}
            checked={isSelected}
            onCheckedChange={() => onSelect(participant.id)}
            className="mr-2"
            disabled={participant.status === "absent"}
          />
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {participant.photo ? (
              <img
                src={participant.photo || "/placeholder.svg"}
                alt={participant.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 m-auto text-gray-500" />
            )}
          </div>
          <div className="ml-2 flex-1">
            <h3 className="font-medium text-sm">{participant.name}</h3>
            <p className="text-xs text-gray-500">TCKN: {participant.tckn}</p>
            <p className="text-xs text-gray-600">
              {participant.department} - {participant.position}
            </p>
            {participant.rejectionReason && (
              <p className="text-xs text-red-500">Neden: {participant.rejectionReason}</p>
            )}
          </div>
          <div>{getStatusBadge(participant.status)}</div>
        </div>

        {participant.status === "pending" && !anySelected && (
          <div className="flex gap-2 mt-2 ml-10">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 h-7 text-xs"
              onClick={() => onMarkAttendance(participant.id, "absent")}
            >
              <X className="mr-1 h-3 w-3" />
              Katılmadı
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 h-7 text-xs"
              onClick={() => onMarkAttendance(participant.id, "attended")}
            >
              <Check className="mr-1 h-3 w-3" />
              Katıldı
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

