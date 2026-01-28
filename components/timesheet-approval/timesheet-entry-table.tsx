import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface TimesheetEntryTableProps {
  entries: Array<{
    id: string
    employeeName: string
    tckn: string
    laborType: string
    overtimeHours: number
    cost: number
    wage: number
    startTime: string
    endTime: string
    extraOvertimeHours?: number
    missingHours?: number
  }>
  selectedEntries: Set<string>
  onSelectEntry: (id: string, checked: boolean) => void
  isApproved: boolean
  isRejected: boolean
  searchTerm?: string
}

export function TimesheetEntryTable({
  entries,
  selectedEntries,
  onSelectEntry,
  isApproved,
  isRejected,
  searchTerm = "",
}: TimesheetEntryTableProps) {
  const isHighlighted = (entry: { employeeName: string; tckn: string }) => {
    if (!searchTerm) return false
    const searchLower = searchTerm.toLowerCase()
    return entry.employeeName.toLowerCase().includes(searchLower) || entry.tckn.includes(searchTerm)
  }

  return (
    <div className="overflow-x-auto custom-scrollbar-x">
      <div style={{ width: "1320px" }}>
        {" "}
        {/* Increased width to accommodate new columns */}
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] sticky left-0 bg-muted/50 z-30">Seç</TableHead>
              <TableHead className="w-[160px] sticky left-[80px] bg-muted/50 z-20">Personel</TableHead>
              <TableHead className="w-[120px]">TCKN</TableHead>
              <TableHead className="w-[140px]">İşçilik Türü</TableHead>
              <TableHead className="w-[100px]">Başlangıç</TableHead>
              <TableHead className="w-[100px]">Bitiş</TableHead>
              <TableHead className="w-[100px]">Süre</TableHead>
              <TableHead className="w-[120px]">Saat Ücreti</TableHead>
              <TableHead className="w-[120px]">Toplam</TableHead>
              <TableHead className="w-[120px]">Fazla Mesai</TableHead>
              <TableHead className="w-[120px]">Eksik Mesai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow
                key={entry.id}
                className={cn(
                  isApproved
                    ? "bg-green-50"
                    : isRejected
                      ? "bg-red-50/80"
                      : selectedEntries.has(entry.id)
                        ? "bg-teal-50/70"
                        : "",
                  isHighlighted(entry) && "bg-yellow-100",
                )}
              >
                <TableCell className="sticky left-0 bg-inherit z-30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedEntries.has(entry.id)}
                      onCheckedChange={(checked) => {
                        onSelectEntry(entry.id, !!checked)
                      }}
                      disabled={isApproved || isRejected}
                    />
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium sticky left-[80px] bg-inherit z-20">{entry.employeeName}</TableCell>
                <TableCell>{entry.tckn}</TableCell>
                <TableCell>{entry.laborType}</TableCell>
                <TableCell>{entry.startTime}</TableCell>
                <TableCell>{entry.endTime}</TableCell>
                <TableCell>{entry.overtimeHours.toString().replace(".", ",")} saat</TableCell>
                <TableCell>{entry.wage}₺</TableCell>
                <TableCell>{entry.cost}₺</TableCell>
                <TableCell>{entry.extraOvertimeHours ? `${entry.extraOvertimeHours} saat` : "-"}</TableCell>
                <TableCell>{entry.missingHours ? `${entry.missingHours} saat` : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

