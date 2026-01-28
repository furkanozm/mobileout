"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentPreviewModal } from "./document-preview-modal"
import { FilterSidebar } from "./filter-sidebar"
import {
  DocumentListHeader,
  ActiveFilters,
  EmploymentCard,
  EmptyState,
  mockEmployments,
  type Document,
  type FilterOptions,
} from "./document-list-components"

interface DocumentListProps {
  onSelectedDocsChange: (count: number) => void
}

export function DocumentList({ onSelectedDocsChange }: DocumentListProps) {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize filter to show only pending documents
  const [filters, setFilters] = useState<FilterOptions>({
    status: "pending",
    documentType: "",
    personnelName: "",
    tckn: "",
    projeGrubu: "", // Initialize Project Group
    proje: "", // Initialize Project
  })

  // Filter employments based on current filters
  const filteredEmployments = mockEmployments.filter((employment) => {
    // Filter by project group if specified
    const projectGroupMatch =
      !filters.projeGrubu || filters.projeGrubu === "all" || employment.projeGrubu === filters.projeGrubu

    // Filter by project if specified
    const projectMatch = !filters.proje || filters.proje === "all" || employment.proje === filters.proje

    // If project group or project doesn't match, exclude this employment
    if (!projectGroupMatch || !projectMatch) {
      return false
    }

    // Check if any document matches the filter criteria
    const hasMatchingDocuments = employment.documents.some((doc) => {
      // Filter by status
      const statusMatch =
        filters.status === "all" ||
        (filters.status === "pending" && doc.status === "Onay Bekliyor") ||
        (filters.status === "approved" && doc.status === "Onaylandı") ||
        (filters.status === "rejected" && doc.status === "Reddedildi")

      // Filter by document type
      const typeMatch =
        !filters.documentType || filters.documentType === "all" || doc.type.includes(filters.documentType)

      // Filter by personnel name
      const nameMatch =
        !filters.personnelName || doc.personnelName.toLowerCase().includes(filters.personnelName.toLowerCase())

      // Filter by TCKN
      const tcknMatch = !filters.tckn || doc.tckn.includes(filters.tckn)

      return statusMatch && typeMatch && nameMatch && tcknMatch
    })

    return hasMatchingDocuments
  })

  // Update selected docs and notify parent component
  const updateSelectedDocs = (newSelectedDocs: Set<string>) => {
    setSelectedDocs(newSelectedDocs)
    if (typeof onSelectedDocsChange === "function") {
      onSelectedDocsChange(newSelectedDocs.size)
    }
  }

  const toggleEntry = (entryId: string) => {
    const newExpandedEntries = new Set(expandedEntries)
    if (newExpandedEntries.has(entryId)) {
      newExpandedEntries.delete(entryId)
    } else {
      newExpandedEntries.add(entryId)
    }
    setExpandedEntries(newExpandedEntries)
  }

  const handleEntrySelect = (entryId: string) => {
    const entry = mockEmployments.find((e) => e.id === entryId)
    if (!entry) return

    const newSelectedDocs = new Set(selectedDocs)
    const newSelectedEntries = new Set(selectedEntries)

    if (selectedEntries.has(entryId)) {
      entry.documents.forEach((doc) => newSelectedDocs.delete(doc.id))
      newSelectedEntries.delete(entryId)
    } else {
      entry.documents.forEach((doc) => newSelectedDocs.add(doc.id))
      newSelectedEntries.add(entryId)
    }

    updateSelectedDocs(newSelectedDocs)
    setSelectedEntries(newSelectedEntries)
  }

  const handleDocumentSelect = (docId: string, entryId: string) => {
    const newSelectedDocs = new Set(selectedDocs)
    const entry = mockEmployments.find((e) => e.id === entryId)

    if (newSelectedDocs.has(docId)) {
      newSelectedDocs.delete(docId)
      if (entry && entry.documents.every((d) => !newSelectedDocs.has(d.id))) {
        setSelectedEntries((prev) => {
          const next = new Set(prev)
          next.delete(entryId)
          return next
        })
      }
    } else {
      newSelectedDocs.add(docId)
      if (entry && entry.documents.every((d) => newSelectedDocs.has(d.id) || d.id === docId)) {
        setSelectedEntries((prev) => new Set(prev).add(entryId))
      }
    }

    updateSelectedDocs(newSelectedDocs)
  }

  const handleOpenPreview = (doc: Document) => {
    setPreviewDocument(doc)
  }

  const handleClosePreview = () => {
    setPreviewDocument(null)
  }

  const handleApproveDocument = (docId: string) => {
    // In a real app, this would call an API to approve the document
    // For now, we'll just update our local state
    const allDocs = mockEmployments.flatMap((e) => e.documents)
    const docIndex = allDocs.findIndex((d) => d.id === docId)

    if (docIndex !== -1) {
      allDocs[docIndex].status = "Onaylandı"
      setPreviewDocument({ ...allDocs[docIndex] })
    }
  }

  const handleRejectDocument = (docId: string, reason: string) => {
    // In a real app, this would call an API to reject the document with the reason
    // For now, we'll just update our local state
    const allDocs = mockEmployments.flatMap((e) => e.documents)
    const docIndex = allDocs.findIndex((d) => d.id === docId)

    if (docIndex !== -1) {
      allDocs[docIndex].status = "Reddedildi"
      // In a real app, we would also store the rejection reason
      console.log(`Document ${docId} rejected with reason: ${reason}`)
      setPreviewDocument({ ...allDocs[docIndex] })
    }
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleSelectAll = () => {
    const allDocIds = mockEmployments.flatMap((e) => e.documents.map((d) => d.id))
    if (selectedDocs.size === allDocIds.length) {
      updateSelectedDocs(new Set())
      setSelectedEntries(new Set())
    } else {
      updateSelectedDocs(new Set(allDocIds))
      setSelectedEntries(new Set(mockEmployments.map((e) => e.id)))
    }
  }

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      documentType: "",
      personnelName: "",
      tckn: "",
      projeGrubu: "",
      proje: "",
    })
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative">
      <DocumentListHeader
        onToggleFilter={toggleFilter}
        onSelectAll={handleSelectAll}
        selectedDocsCount={selectedDocs.size}
        totalDocsCount={mockEmployments.flatMap((e) => e.documents).length}
      />

      {(filters.status !== "all" || filters.projeGrubu || filters.proje) && (
        <ActiveFilters filters={filters} onUpdateFilter={setFilters} onClearAll={handleClearFilters} />
      )}

      <ScrollArea className="flex-1 bg-blue-50">
        <div className="p-4 space-y-4">
          {filteredEmployments.length > 0 ? (
            filteredEmployments.map((employment) => (
              <EmploymentCard
                key={employment.id}
                employment={employment}
                isExpanded={expandedEntries.has(employment.id)}
                isSelected={selectedEntries.has(employment.id)}
                selectedDocs={selectedDocs}
                onToggleExpand={() => toggleEntry(employment.id)}
                onSelectEntry={handleEntrySelect}
                onSelectDocument={handleDocumentSelect}
                onPreviewDocument={handleOpenPreview}
              />
            ))
          ) : (
            <EmptyState onReset={handleClearFilters} />
          )}
        </div>
      </ScrollArea>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {previewDocument && (
        <DocumentPreviewModal
          document={previewDocument}
          onClose={handleClosePreview}
          onApprove={handleApproveDocument}
          onReject={handleRejectDocument}
        />
      )}
    </div>
  )
}

