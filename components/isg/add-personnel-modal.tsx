"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, UserPlus, Users } from "lucide-react"
import { PersonnelCard } from "./personnel-card"
import type { Personnel } from "./types"

interface AddPersonnelModalProps {
  show: boolean
  onClose: () => void
  availablePersonnel: Personnel[]
  onAddPersonnel: (selectedIds: number[]) => void
}

export function AddPersonnelModal({ show, onClose, availablePersonnel, onAddPersonnel }: AddPersonnelModalProps) {
  const [modalAnimation, setModalAnimation] = useState("translate-y-full")
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>([])
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  // Filter available personnel based on search query
  const filteredPersonnel = availablePersonnel.filter(
    (person) =>
      person.name.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.department.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.position.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.tckn.includes(personnelSearchQuery),
  )

  const isAllPersonnelSelected = selectedPersonnel.length === filteredPersonnel.length && filteredPersonnel.length > 0

  useEffect(() => {
    if (show) {
      // Small delay to ensure the modal is rendered before animating
      setTimeout(() => setModalAnimation("translate-y-0"), 10)
    } else {
      setModalAnimation("translate-y-full")
    }
  }, [show])

  useEffect(() => {
    // Reset selections when modal is opened
    if (show) {
      setSelectedPersonnel([])
      setPersonnelSearchQuery("")
    }
  }, [show])

  const handleSelectPersonnel = (personnelId: number) => {
    setSelectedPersonnel((prev) =>
      prev.includes(personnelId) ? prev.filter((id) => id !== personnelId) : [...prev, personnelId],
    )
  }

  const handleSelectAllPersonnel = () => {
    if (selectedPersonnel.length === filteredPersonnel.length) {
      setSelectedPersonnel([])
    } else {
      setSelectedPersonnel(filteredPersonnel.map((p) => p.id))
    }
  }

  const handleAddSelectedPersonnel = () => {
    onAddPersonnel(selectedPersonnel)
  }

  if (!show) return null

  return (
    <div className="absolute inset-0 z-50 bg-black/30">
      <div
        className={`absolute inset-x-0 bottom-0 bg-white rounded-t-xl shadow-xl transition-transform duration-300 ease-out ${modalAnimation}`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-3 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Katılımcı Ekle</h3>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(!isSearchVisible)} className="mr-1">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div
            className={`mt-2 relative overflow-hidden transition-all duration-300 ease-in-out ${
              isSearchVisible ? "max-h-12 opacity-100 mb-1" : "max-h-0 opacity-0"
            }`}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Personel ara..."
              className="pl-9"
              value={personnelSearchQuery}
              onChange={(e) => setPersonnelSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div
          className="p-2 bg-white border-b flex justify-between items-center sticky top-[69px] z-10"
          style={{ top: isSearchVisible ? "105px" : "69px" }}
        >
          <div className="flex items-center">
            <Checkbox
              id="select-all-personnel"
              checked={isAllPersonnelSelected}
              onCheckedChange={handleSelectAllPersonnel}
            />
            <label htmlFor="select-all-personnel" className="ml-2 text-sm font-medium">
              {isAllPersonnelSelected ? "Tümünü Kaldır" : "Tümünü Seç"}
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {selectedPersonnel.length > 0 ? `${selectedPersonnel.length} kişi seçildi` : ""}
          </div>
        </div>

        <ScrollArea className="max-h-[calc(85vh-140px)]" scrollHideDelay={0} type="always">
          <div className="p-2 space-y-2">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  isSelected={selectedPersonnel.includes(person.id)}
                  onSelect={handleSelectPersonnel}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Arama kriterlerine uygun personel bulunamadı.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t sticky bottom-0 bg-white">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={selectedPersonnel.length === 0}
            onClick={handleAddSelectedPersonnel}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {selectedPersonnel.length > 0 ? `${selectedPersonnel.length} Personeli Ekle` : "Personel Ekle"}
          </Button>
        </div>
      </div>
    </div>
  )
}

