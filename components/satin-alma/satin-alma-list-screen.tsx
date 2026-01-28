"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe, Plus, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockPurchaseRequests } from "./mock-data"
import type { PurchaseRequest, FilterState } from "./types"
import { PurchaseRequestCard } from "./purchase-request-card"

interface SatinAlmaListScreenProps {
  onBack: () => void
  onNewRequest: () => void
  onSelectRequest: (request: PurchaseRequest) => void
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  currentFilters: FilterState
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Filter Options</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">This is a basic filter panel. Add your filter options here.</p>
          </div>
          <div className="items-center px-4 py-3">
            <Button variant="outline" onClick={() => onApplyFilters({})}>
              Apply Filters
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SatinAlmaListScreen({ onBack, onNewRequest, onSelectRequest }: SatinAlmaListScreenProps) {
  const [requests] = useState(mockPurchaseRequests)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    status: "all",
    requestType: "all",
    date: "",
    searchTerm: "",
    isForProject: "all",
  })

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(true)}>
          <Filter className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-800">Satın Alma Talepleri</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {requests.map((request, index) => (
              <PurchaseRequestCard
                key={request.id}
                request={request}
                onClick={() => onSelectRequest(request)}
                index={index + 1}
              />
            ))}
          </div>
        </ScrollArea>
      </main>

      <div className="absolute bottom-32 right-4 z-10">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          onClick={onNewRequest}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => {
          setCurrentFilters(filters)
          // Apply filtering logic here
        }}
        currentFilters={currentFilters}
      />
    </div>
  )
}

