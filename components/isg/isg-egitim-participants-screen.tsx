"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { UserPlus, Filter } from "lucide-react"
import { ParticipantList } from "./participant-list"
import { AddPersonnelModal } from "./add-personnel-modal"
import { ConfirmationDialog } from "./confirmation-dialog"
import { RejectionDialog } from "./rejection-dialog"
import { BulkActionBar } from "./bulk-action-bar"
import { FilterSidebar } from "./filter-sidebar"
import type { Participant, Personnel, Training } from "./types"

interface IsgEgitimParticipantsScreenProps {
  training: Training
  onBack: () => void
}

export function IsgEgitimParticipantsScreen({ training, onBack }: IsgEgitimParticipantsScreenProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"attended" | "absent" | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showAddPersonnelModal, setShowAddPersonnelModal] = useState(false)
  const [showFilterSidebar, setShowFilterSidebar] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    searchQuery: "",
    departments: [] as string[],
    statuses: [] as string[],
  })

  // Mock data with TCKN added
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      name: "Ali Yılmaz",
      department: "Üretim",
      position: "Operatör",
      status: "attended",
      photo: "/placeholder.svg?height=40&width=40",
      tckn: "12345678901",
    },
    {
      id: 2,
      name: "Ayşe Kaya",
      department: "İnsan Kaynakları",
      position: "Uzman",
      status: "attended",
      photo: "/placeholder.svg?height=40&width=40",
      tckn: "23456789012",
    },
    {
      id: 3,
      name: "Mehmet Demir",
      department: "Bakım",
      position: "Teknisyen",
      status: "absent",
      photo: "/placeholder.svg?height=40&width=40",
      rejectionReason: "İzinli",
      tckn: "34567890123",
    },
    {
      id: 4,
      name: "Zeynep Çelik",
      department: "Kalite",
      position: "Mühendis",
      status: "attended",
      photo: "/placeholder.svg?height=40&width=40",
      tckn: "45678901234",
    },
    {
      id: 5,
      name: "Mustafa Öztürk",
      department: "Üretim",
      position: "Şef",
      status: "pending",
      photo: "/placeholder.svg?height=40&width=40",
      tckn: "56789012345",
    },
    {
      id: 6,
      name: "Fatma Şahin",
      department: "Muhasebe",
      position: "Uzman",
      status: "pending",
      photo: "/placeholder.svg?height=40&width=40",
      tckn: "67890123456",
    },
  ])

  // Mock data for available personnel in the project who haven't received training
  const [availablePersonnel, setAvailablePersonnel] = useState<Personnel[]>([
    {
      id: 101,
      name: "Hakan Yıldız",
      department: "Üretim",
      position: "Operatör",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "78901234567",
    },
    {
      id: 102,
      name: "Selin Arslan",
      department: "İnsan Kaynakları",
      position: "Uzman",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "89012345678",
    },
    {
      id: 103,
      name: "Emre Kılıç",
      department: "Bakım",
      position: "Teknisyen",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "90123456789",
    },
    {
      id: 104,
      name: "Deniz Aydın",
      department: "Kalite",
      position: "Mühendis",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "01234567890",
    },
    {
      id: 105,
      name: "Burak Özdemir",
      department: "Üretim",
      position: "Operatör",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "12345098765",
    },
    {
      id: 106,
      name: "Ceren Yılmaz",
      department: "Muhasebe",
      position: "Uzman",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "23456109876",
    },
    {
      id: 107,
      name: "Onur Çetin",
      department: "Üretim",
      position: "Operatör",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "34567210987",
    },
    {
      id: 108,
      name: "Gizem Koç",
      department: "İnsan Kaynakları",
      position: "Uzman",
      photo: "/placeholder.svg?height=40&width=40",
      isActive: true,
      tckn: "45678321098",
    },
  ])

  // Get unique departments for filter
  const departments = [...new Set(participants.map((p) => p.department))]

  // Filter participants based on filter options
  const filteredParticipants = participants.filter((participant) => {
    // Search query filter
    const matchesSearch =
      filterOptions.searchQuery === "" ||
      participant.name.toLowerCase().includes(filterOptions.searchQuery.toLowerCase()) ||
      participant.tckn.includes(filterOptions.searchQuery) ||
      participant.position.toLowerCase().includes(filterOptions.searchQuery.toLowerCase())

    // Department filter
    const matchesDepartment =
      filterOptions.departments.length === 0 || filterOptions.departments.includes(participant.department)

    // Status filter
    const matchesStatus = filterOptions.statuses.length === 0 || filterOptions.statuses.includes(participant.status)

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleMarkAttendance = (participantId: number, status: "attended" | "absent") => {
    if (status === "absent") {
      // Show rejection reason dialog for a single participant
      setSelectedParticipants([participantId])
      setShowRejectDialog(true)
    } else {
      // Update the participant's status directly
      setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status } : p)))
    }
  }

  const handleSelectParticipant = (participantId: number) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const handleSelectAll = () => {
    // Get all selectable participants (excluding those with "absent" status)
    const selectableParticipantIds = filteredParticipants.filter((p) => p.status !== "absent").map((p) => p.id)

    if (selectedParticipants.length === selectableParticipantIds.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(selectableParticipantIds)
    }
  }

  const handleBulkAction = (status: "attended" | "absent") => {
    // Filter out participants that are already in the requested status
    const relevantParticipants = selectedParticipants.filter((id) => {
      const participant = participants.find((p) => p.id === id)
      return participant && participant.status !== status
    })

    if (relevantParticipants.length === 0) {
      // If no relevant participants, just clear selection
      setSelectedParticipants([])
      return
    }

    // Set the action type for the confirmation dialog
    setConfirmAction(status)

    // Show confirmation dialog
    setShowConfirmDialog(true)
  }

  const handleConfirmAction = () => {
    if (confirmAction === "absent") {
      // For "Katılmadı", show rejection reason dialog
      setShowConfirmDialog(false)
      setShowRejectDialog(true)
    } else {
      // For "Katıldı", update statuses directly
      setParticipants((prev) =>
        prev.map((p) =>
          selectedParticipants.includes(p.id) && p.status !== "attended" ? { ...p, status: "attended" } : p,
        ),
      )
      setShowConfirmDialog(false)
      setSelectedParticipants([])
    }
  }

  const handleRejectConfirm = () => {
    // Update participants with rejection reason
    setParticipants((prev) =>
      prev.map((p) => (selectedParticipants.includes(p.id) ? { ...p, status: "absent", rejectionReason } : p)),
    )
    setShowRejectDialog(false)
    setRejectionReason("")
    setSelectedParticipants([])
  }

  const handleAddSelectedPersonnel = (selectedIds: number[]) => {
    // Add selected personnel as new participants with "pending" status
    const newParticipants = selectedIds
      .map((id) => {
        const person = availablePersonnel.find((p) => p.id === id)
        if (!person) return null

        return {
          id: person.id,
          name: person.name,
          department: person.department,
          position: person.position,
          status: "pending" as const,
          photo: person.photo,
          tckn: person.tckn,
        }
      })
      .filter(Boolean) as Participant[]

    setParticipants((prev) => [...prev, ...newParticipants])

    // Remove added personnel from available list
    setAvailablePersonnel((prev) => prev.filter((person) => !selectedIds.includes(person.id)))

    setShowAddPersonnelModal(false)
  }

  // Count participants that would be affected by the bulk action
  const getAffectedCount = (status: "attended" | "absent") => {
    return selectedParticipants.filter((id) => {
      const participant = participants.find((p) => p.id === id)
      return participant && participant.status !== status
    }).length
  }

  const handleFilterChange = (newFilterOptions: typeof filterOptions) => {
    setFilterOptions(newFilterOptions)
  }

  const toggleFilterSidebar = () => {
    setShowFilterSidebar((prev) => !prev)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <Header
        title={`ISG Eğitimi - Katılımcılar`}
        onBackClick={onBack}
        rightContent={
          <Button variant="ghost" size="icon" onClick={toggleFilterSidebar}>
            <Filter className="h-5 w-5" />
          </Button>
        }
      />

      <ParticipantList
        participants={filteredParticipants}
        selectedParticipants={selectedParticipants}
        onSelectParticipant={handleSelectParticipant}
        onSelectAll={handleSelectAll}
        onMarkAttendance={handleMarkAttendance}
      />

      {/* Bottom Bar for Bulk Actions */}
      {selectedParticipants.length > 0 && (
        <BulkActionBar
          onMarkAbsent={() => handleBulkAction("absent")}
          onMarkAttended={() => handleBulkAction("attended")}
        />
      )}

      {/* Floating Action Button - only visible when no participants are selected */}
      {selectedParticipants.length === 0 && (
        <Button
          className="absolute bottom-20 right-4 rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700 z-20"
          onClick={() => setShowAddPersonnelModal(true)}
        >
          <UserPlus className="h-6 w-6" />
        </Button>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          title="İşlemi Onaylayın"
          message={
            confirmAction === "attended"
              ? `${getAffectedCount("attended")} katılımcıyı "Katıldı" olarak işaretlemek istediğinize emin misiniz?`
              : `${getAffectedCount("absent")} katılımcıyı "Katılmadı" olarak işaretlemek istediğinize emin misiniz?`
          }
          confirmLabel="Onayla"
          confirmClass={
            confirmAction === "attended"
              ? "text-green-600 hover:bg-green-50 active:bg-green-100"
              : "text-red-600 hover:bg-red-50 active:bg-red-100"
          }
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      {/* Rejection Reason Dialog */}
      {showRejectDialog && (
        <RejectionDialog
          title="Katılmama Nedeni"
          message={
            selectedParticipants.length > 1
              ? `${selectedParticipants.length} katılımcının katılmama nedenini seçin`
              : `Katılımcının katılmama nedenini seçin`
          }
          rejectionReason={rejectionReason}
          onReasonChange={setRejectionReason}
          onConfirm={handleRejectConfirm}
          onCancel={() => {
            setShowRejectDialog(false)
            setRejectionReason("")
            setSelectedParticipants([])
          }}
        />
      )}

      {/* Add Personnel Modal */}
      <AddPersonnelModal
        show={showAddPersonnelModal}
        onClose={() => setShowAddPersonnelModal(false)}
        availablePersonnel={availablePersonnel}
        onAddPersonnel={handleAddSelectedPersonnel}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        show={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        departments={departments}
      />
    </div>
  )
}

