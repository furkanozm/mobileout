"use client"
import { Checkbox } from "@/components/ui/checkbox"
import type { Participant } from "./types"
import { ParticipantCard } from "./participant-card"
import { Users } from "lucide-react"

interface ParticipantListProps {
  participants: Participant[]
  selectedParticipants: number[]
  onSelectParticipant: (id: number) => void
  onSelectAll: () => void
  onMarkAttendance: (id: number, status: "attended" | "absent") => void
}

export function ParticipantList({
  participants,
  selectedParticipants,
  onSelectParticipant,
  onSelectAll,
  onMarkAttendance,
}: ParticipantListProps) {
  const selectableParticipants = participants.filter((p) => p.status !== "absent")
  const isAllSelected =
    selectableParticipants.length > 0 && selectableParticipants.every((p) => selectedParticipants.includes(p.id))

  return (
    <div className="flex-1 overflow-auto">
      {participants.length > 0 ? (
        <>
          <div className="sticky top-0 z-10 bg-white p-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                disabled={selectableParticipants.length === 0}
              />
              <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                {isAllSelected ? "Tümünü Kaldır" : "Tümünü Seç"}
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {selectedParticipants.length > 0
                ? `${selectedParticipants.length} kişi seçildi`
                : `${participants.length} katılımcı`}
            </div>
          </div>

          <div className="p-3 space-y-2 pb-24">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isSelected={selectedParticipants.includes(participant.id)}
                onSelect={onSelectParticipant}
                onMarkAttendance={onMarkAttendance}
                anySelected={selectedParticipants.length > 0}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <Users className="h-12 w-12 text-gray-300 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">Katılımcı bulunamadı</h3>
          <p className="text-sm text-gray-500 mt-1">Henüz katılımcı eklenmemiş veya filtrelere uygun katılımcı yok.</p>
        </div>
      )}
    </div>
  )
}

