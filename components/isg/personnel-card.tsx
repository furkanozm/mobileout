"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "lucide-react"
import type { Personnel } from "./types"

interface PersonnelCardProps {
  person: Personnel
  isSelected: boolean
  onSelect: (id: number) => void
}

// Make the personnel card more compact
export function PersonnelCard({ person, isSelected, onSelect }: PersonnelCardProps) {
  return (
    <div className="flex items-center p-2 border rounded-md bg-white" onClick={() => onSelect(person.id)}>
      <Checkbox checked={isSelected} onCheckedChange={() => onSelect(person.id)} className="mr-2" />
      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {person.photo ? (
          <img src={person.photo || "/placeholder.svg"} alt={person.name} className="h-full w-full object-cover" />
        ) : (
          <User className="h-5 w-5 m-auto text-gray-500" />
        )}
      </div>
      <div className="ml-2 flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{person.name}</h3>
        <p className="text-xs text-gray-500">TCKN: {person.tckn}</p>
        <p className="text-xs text-gray-600 truncate">
          {person.department} - {person.position}
        </p>
      </div>
    </div>
  )
}

