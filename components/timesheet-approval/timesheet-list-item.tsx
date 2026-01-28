"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Users, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimesheetListItemProps {
  timesheet: any
  index: number
  isSelected: boolean
  approvalStatus: "pending" | "approved" | "rejected"
  onToggleSelection: (id: string) => void
  onShowPersonnelList: (id: string) => void
  hideViewButton?: boolean
}

export function TimesheetListItem({
  timesheet,
  index,
  isSelected,
  approvalStatus,
  onToggleSelection,
  onShowPersonnelList,
  hideViewButton,
}: TimesheetListItemProps) {
  return (
    <div className="bg-white shadow-sm w-full border-b">
      <div className="px-2 py-2">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-start gap-2 min-w-0 w-full">
            <button
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md text-sm font-medium transition-colors flex-shrink-0 mt-0.5 border border-blue-600",
                isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
              onClick={() => onToggleSelection(timesheet.id)}
            >
              {isSelected ? <Check className="h-4 w-4" /> : index + 1}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-base">{timesheet.date}</h3>
                <Badge
                  variant={approvalStatus === "approved" ? "success" : "warning"}
                  className="text-xs whitespace-nowrap"
                >
                  {approvalStatus === "approved" ? "Onaylı" : "Onay Bek."}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">#{timesheet.id}</p>
              <p className="text-xs text-muted-foreground truncate">
                {timesheet.company || "Polen"} | {timesheet.projectGroup || "Sera Projeleri"} |{" "}
                {timesheet.project || "Antalya Domates Serası"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2 mt-2">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs">Per: {timesheet.personnel?.length || 2}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs">Mesai: {timesheet.totalHours || 13} s.</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs">Mly: {timesheet.cost || 1950}₺</span>
          </div>
        </div>

        {/* Display labor types if available */}
        {timesheet.laborTypes && timesheet.laborTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {timesheet.laborTypes.map((type, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {type}
              </Badge>
            ))}
          </div>
        )}

        {!hideViewButton && (
          <div className="flex justify-end mt-1">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-0.5 px-2 h-auto rounded-md"
              onClick={() => onShowPersonnelList(timesheet.id)}
            >
              <Users className="h-3.5 w-3.5 mr-1" />
              Personel Listesini Görüntüle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

