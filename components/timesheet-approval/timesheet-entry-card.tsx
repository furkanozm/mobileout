import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface TimesheetEntryProps {
  entry: {
    employeeName: string
    laborType: string
    overtimeHours: number
    cost: number
    company: string
    additionalLaborType?: string
  }
  index: number
  isApproved: boolean
  isRejected: boolean
  isSelected: boolean
  onSelect: (checked: boolean) => void
}

export function TimesheetEntryCard({
  entry,
  index,
  isApproved,
  isRejected,
  isSelected,
  onSelect,
}: TimesheetEntryProps) {
  return (
    <div className={`p-4 border-b last:border-b-0 ${isApproved ? "bg-green-50" : isRejected ? "bg-red-50/80" : ""}`}>
      <div className="flex items-start gap-3">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        <span className="text-sm text-muted-foreground min-w-[20px]">{index + 1}.</span>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900">{entry.employeeName}</h3>
          <p className="text-sm text-gray-500">{entry.laborType}</p>
          {/* Display additional labor type if available */}
          {entry.additionalLaborType && (
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                + {entry.additionalLaborType}
              </Badge>
            </div>
          )}
          <div className="text-sm text-gray-700 mt-1">
            <span className="text-muted-foreground">Polen • </span>
            <span>
              {entry.overtimeHours.toString().replace(".", ",")} saat • {entry.cost}₺
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

