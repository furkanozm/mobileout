"use client"
import { useState } from "react"
import type React from "react"

import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge-extended"
import { Search, Plus, Check, X, User, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AddPersonnelModal } from "./add-personnel-modal"

interface OryantasyonParticipantsScreenProps {
  onBack: () => void
  training: any
}

export function OryantasyonParticipantsScreen({ onBack, training }: OryantasyonParticipantsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])
  const [showAddPersonnelModal, setShowAddPersonnelModal] = useState(false)

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      department: "İnsan Kaynakları",
      position: "İK Uzmanı",
      status: "attended",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Mehmet Kaya",
      department: "Üretim",
      position: "Üretim Şefi",
      status: "attended",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Ayşe Demir",
      department: "Finans",
      position: "Muhasebe Uzmanı",
      status: "absent",
      photo: "/placeholder.svg?height=100&width=100",
      rejectionReason: "İzinli",
    },
    {
      id: 4,
      name: "Fatma Yıldız",
      department: "Satış",
      position: "Satış Temsilcisi",
      status: "pending",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Ali Şahin",
      department: "IT",
      position: "Yazılım Geliştirici",
      status: "pending",
      photo: "/placeholder.svg?height=100&width=100",
    },
  ])

  // Mock available personnel for the modal
  const availablePersonnel = [
    {
      id: 6,
      name: "Zeynep Kara",
      department: "İnsan Kaynakları",
      position: "İK Müdürü",
      tckn: "12345678901",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      name: "Hasan Yıldırım",
      department: "Üretim",
      position: "Üretim Müdürü",
      tckn: "23456789012",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      name: "Elif Çelik",
      department: "Finans",
      position: "Finans Direktörü",
      tckn: "34567890123",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 9,
      name: "Mustafa Demir",
      department: "Satış",
      position: "Satış Müdürü",
      tckn: "45678901234",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 10,
      name: "Selin Yılmaz",
      department: "IT",
      position: "IT Müdürü",
      tckn: "56789012345",
      photo: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  // Only show pending participants for selection
  const pendingParticipants = participants.filter((p) => p.status === "pending")

  // Filter participants based on search query
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectParticipant = (id: number) => {
    setSelectedParticipants((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedParticipants.length === pendingParticipants.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(pendingParticipants.map((p) => p.id))
    }
  }

  const handleMarkAttendance = (status: "attended" | "absent") => {
    setParticipants((prev) =>
      prev.map((p) =>
        selectedParticipants.includes(p.id)
          ? { ...p, status, rejectionReason: status === "absent" ? "Katılmadı" : undefined }
          : p,
      ),
    )
    setSelectedParticipants([])
  }

  const handleAddPersonnel = (selectedIds: number[]) => {
    // Convert selected personnel to participants
    const newParticipants = availablePersonnel
      .filter((person) => selectedIds.includes(person.id))
      .map((person) => ({
        id: person.id,
        name: person.name,
        department: person.department,
        position: person.position,
        status: "pending" as const,
        photo: person.photo,
      }))

    // Add new participants to the list
    setParticipants((prev) => [...prev, ...newParticipants])
    setShowAddPersonnelModal(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge variant="success">Katıldı</Badge>
      case "absent":
        return <Badge variant="destructive">Katılmadı</Badge>
      case "pending":
        return <Badge variant="outline">Beklemede</Badge>
      default:
        return null
    }
  }

  const isAllSelected =
    pendingParticipants.length > 0 && pendingParticipants.every((p) => selectedParticipants.includes(p.id))

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="Katılımcılar"
        onBackClick={onBack}
        rightContent={
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="text-gray-600">
            <Filter className="h-5 w-5" />
          </Button>
        }
      />

      {showSearch && (
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Katılımcı ara..." className="pl-9" value={searchQuery} onChange={handleSearch} />
          </div>
        </div>
      )}

      {pendingParticipants.length > 0 && (
        <div className="p-3 bg-white border-b flex items-center">
          <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
          <label htmlFor="select-all" className="ml-2 text-sm font-medium">
            {isAllSelected ? "Tümünü Kaldır" : "Tümünü Seç"}
          </label>
          <div className="ml-auto text-sm text-gray-500">
            {selectedParticipants.length > 0 && `${selectedParticipants.length} kişi seçildi`}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 pb-16">
        <div className="space-y-3 mt-4">
          {filteredParticipants.map((participant) => (
            <Card key={participant.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center">
                  {participant.status === "pending" && (
                    <Checkbox
                      id={`participant-${participant.id}`}
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={() => handleSelectParticipant(participant.id)}
                      className="mr-2"
                    />
                  )}
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-2">
                    {participant.photo ? (
                      <img
                        src={participant.photo || "/placeholder.svg"}
                        alt={participant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{participant.name}</h3>
                    <p className="text-xs text-gray-500">
                      {participant.department} - {participant.position}
                    </p>
                  </div>
                  <div>{getStatusBadge(participant.status)}</div>
                </div>

                {participant.rejectionReason && (
                  <div className="mt-1 text-xs text-red-500 ml-12">Sebep: {participant.rejectionReason}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Button - only visible when no participants are selected */}
      {selectedParticipants.length === 0 && (
        <Button
          className={`absolute right-6 bottom-24 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-20`}
          onClick={() => setShowAddPersonnelModal(true)}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Bottom action bar for bulk actions */}
      {selectedParticipants.length > 0 && (
        <div className="w-full bg-white border-t p-3 flex gap-2 shadow-lg z-10 mb-4">
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleMarkAttendance("absent")}
          >
            <X className="mr-1 h-4 w-4" />
            Katılmadı
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleMarkAttendance("attended")}>
            <Check className="mr-1 h-4 w-4" />
            Katıldı
          </Button>
        </div>
      )}

      {/* Add Personnel Modal */}
      <AddPersonnelModal
        show={showAddPersonnelModal}
        onClose={() => setShowAddPersonnelModal(false)}
        availablePersonnel={availablePersonnel}
        onAddPersonnel={handleAddPersonnel}
      />
    </div>
  )
}

