import type React from "react"
import {
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Filter,
  X,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Types
export interface Document {
  id: string
  name: string
  type: string
  status: "Onaylandı" | "Onay Bekliyor" | "Reddedildi"
  date: string
  personnelName: string
  tckn: string
}

export interface Employment {
  id: string
  company: string
  personnelName: string
  tckn: string
  startDate: string
  endDate: string | null
  projeGrubu: string
  proje: string
  documents: Document[]
}

export type FilterStatus = "all" | "pending" | "approved" | "rejected"

export interface FilterOptions {
  status: FilterStatus
  documentType: string
  personnelName: string
  tckn: string
  projeGrubu: string
  proje: string
}

// Mock Data
export const mockEmployments: Employment[] = [
  {
    id: "1",
    company: "TechCorp A.Ş.",
    personnelName: "Ahmet Yılmaz",
    tckn: "12345678901",
    projeGrubu: "Yazılım Geliştirme",
    proje: "Web Uygulaması",
    startDate: "01.03.2022",
    endDate: null,
    documents: [
      {
        id: "1",
        name: "İş Sözleşmesi",
        type: "Sözleşme",
        status: "Onaylandı",
        date: "01.03.2022",
        personnelName: "Ahmet Yılmaz",
        tckn: "12345678901",
      },
      {
        id: "2",
        name: "Sağlık Raporu",
        type: "Sağlık",
        status: "Onay Bekliyor",
        date: "15.03.2022",
        personnelName: "Ahmet Yılmaz",
        tckn: "12345678901",
      },
    ],
  },
  {
    id: "2",
    company: "InnoSoft Ltd.",
    personnelName: "Ayşe Demir",
    tckn: "12345678903",
    projeGrubu: "Tasarım",
    proje: "UI/UX Tasarımı",
    startDate: "15.06.2020",
    endDate: "28.02.2022",
    documents: [
      {
        id: "3",
        name: "İş Sözleşmesi",
        type: "Sözleşme",
        status: "Onaylandı",
        date: "15.06.2020",
        personnelName: "Ayşe Demir",
        tckn: "12345678903",
      },
      {
        id: "4",
        name: "İstifa Dilekçesi",
        type: "Dilekçe",
        status: "Onaylandı",
        date: "15.02.2022",
        personnelName: "Ayşe Demir",
        tckn: "12345678903",
      },
    ],
  },
  {
    id: "3",
    company: "DataSys Bilişim",
    personnelName: "Ali Yıldız",
    tckn: "12345678905",
    projeGrubu: "Veri Analizi",
    proje: "Veri Madenciliği",
    startDate: "01.09.2018",
    endDate: "31.05.2020",
    documents: [
      {
        id: "5",
        name: "İş Sözleşmesi",
        type: "Sözleşme",
        status: "Onaylandı",
        date: "01.09.2018",
        personnelName: "Ali Yıldız",
        tckn: "12345678905",
      },
      {
        id: "6",
        name: "İşten Ayrılış Belgesi",
        type: "Belge",
        status: "Onay Bekliyor",
        date: "31.05.2020",
        personnelName: "Ali Yıldız",
        tckn: "12345678905",
      },
    ],
  },
]

// Helper Functions
export const getStatusBadgeVariant = (status: Document["status"]) => {
  switch (status) {
    case "Onaylandı":
      return "success"
    case "Onay Bekliyor":
      return "warning"
    case "Reddedildi":
      return "danger"
    default:
      return "default"
  }
}

export const getEmploymentStatus = (employment: Employment) => {
  const allApproved = employment.documents.every((doc) => doc.status === "Onaylandı")
  const hasPending = employment.documents.some((doc) => doc.status === "Onay Bekliyor")
  const hasRejected = employment.documents.some((doc) => doc.status === "Reddedildi")

  if (allApproved) return "approved"
  if (hasPending) return "pending"
  if (hasRejected) return "rejected"
  return "default"
}

// Components
export function DocumentListHeader({
  onToggleFilter,
  onSelectAll,
  selectedDocsCount,
  totalDocsCount,
}: {
  onToggleFilter: () => void
  onSelectAll: () => void
  selectedDocsCount: number
  totalDocsCount: number
}) {
  return (
    <div className="p-4 flex justify-between items-center bg-white border-b sticky top-0 z-10">
      <h2 className="text-xl font-semibold">Özlük Evrakları</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleFilter} className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filtrele
        </Button>
        <Button variant="outline" size="sm" onClick={onSelectAll}>
          {selectedDocsCount === totalDocsCount ? "Tümünü Kaldır" : "Tümünü Seç"}
        </Button>
      </div>
    </div>
  )
}

export function ActiveFilters({
  filters,
  onUpdateFilter,
  onClearAll,
}: {
  filters: FilterOptions
  onUpdateFilter: (filters: FilterOptions) => void
  onClearAll: () => void
}) {
  const activeFilters = []

  if (filters.status !== "all") {
    activeFilters.push(
      <div key="status" className="flex items-center gap-2 group">
        <Badge variant="outline" className="bg-white relative pr-6">
          {filters.status === "pending"
            ? "Onay Bekleyenler"
            : filters.status === "approved"
              ? "Onaylananlar"
              : "Reddedilenler"}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 h-full w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onUpdateFilter({ ...filters, status: "all" })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      </div>,
    )
  }

  if (filters.projeGrubu && filters.projeGrubu !== "all") {
    activeFilters.push(
      <div key="projeGrubu" className="flex items-center gap-2 group">
        <Badge variant="outline" className="bg-white relative pr-6">
          {filters.projeGrubu}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 h-full w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onUpdateFilter({ ...filters, projeGrubu: "", proje: "" })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      </div>,
    )
  }

  if (filters.proje && filters.proje !== "all") {
    activeFilters.push(
      <div key="proje" className="flex items-center gap-2 group">
        <Badge variant="outline" className="bg-white relative pr-6">
          {filters.proje}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 h-full w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onUpdateFilter({ ...filters, proje: "" })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      </div>,
    )
  }

  return (
    <div className="px-4 py-2 bg-blue-50 flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600">Aktif filtreler:</span>
      {activeFilters}

      {/* Clear all filters button - always visible */}
      <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 p-0" onClick={onClearAll} title="Tümünü Temizle">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function StatusIcon({ employment }: { employment: Employment }) {
  const status = getEmploymentStatus(employment)

  switch (status) {
    case "approved":
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
      )
    case "pending":
      return (
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Clock className="h-4 w-4 text-amber-600" />
        </div>
      )
    case "rejected":
      return (
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-4 w-4 text-red-600" />
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-gray-600" />
        </div>
      )
  }
}

export function SelectionCircle({
  isSelected,
  onClick,
  children,
}: {
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
        isSelected
          ? "bg-blue-100 border-2 border-blue-600 text-blue-700"
          : "bg-gray-100 border-2 border-gray-300 text-gray-600",
      )}
      onClick={onClick}
    >
      {isSelected ? <Check className="h-4 w-4" /> : children}
    </div>
  )
}

export function DocumentItem({
  document,
  index,
  isSelected,
  employmentId,
  onSelect,
  onPreview,
}: {
  document: Document
  index: number
  isSelected: boolean
  employmentId: string
  onSelect: (docId: string, entryId: string) => void
  onPreview: (doc: Document) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <SelectionCircle
          isSelected={isSelected}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(document.id, employmentId)
          }}
        >
          <span className="text-sm font-medium">{index + 1}</span>
        </SelectionCircle>
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{document.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusBadgeVariant(document.status)} className="whitespace-nowrap">
              {document.status === "Onaylandı" && <Check className="h-3 w-3 mr-1" />}
              {document.status === "Onay Bekliyor" && <AlertCircle className="h-3 w-3 mr-1" />}
              {document.status}
            </Badge>
            <span className="text-sm text-gray-500">{document.date}</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => onPreview(document)}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function EmploymentCard({
  employment,
  isExpanded,
  isSelected,
  selectedDocs,
  onToggleExpand,
  onSelectEntry,
  onSelectDocument,
  onPreviewDocument,
}: {
  employment: Employment
  isExpanded: boolean
  isSelected: boolean
  selectedDocs: Set<string>
  onToggleExpand: () => void
  onSelectEntry: (id: string) => void
  onSelectDocument: (docId: string, entryId: string) => void
  onPreviewDocument: (doc: Document) => void
}) {
  return (
    <Card key={employment.id} className="overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4" onClick={onToggleExpand}>
          <div className="flex items-center gap-3">
            <SelectionCircle
              isSelected={isSelected}
              onClick={(e) => {
                e.stopPropagation()
                onSelectEntry(employment.id)
              }}
            >
              <span className="text-sm font-medium">{Number.parseInt(employment.id)}</span>
            </SelectionCircle>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <h3 className="font-medium truncate">{employment.personnelName}</h3>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="text-gray-600 text-xs">{employment.tckn}</span>
                </div>
                <StatusIcon employment={employment} />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                <span className="font-medium">{employment.company}</span>
                <span className="mx-1">•</span>
                <span>{employment.projeGrubu}</span>
                <span className="mx-1">•</span>
                <span>{employment.proje}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {employment.startDate} - {employment.endDate || "Devam Ediyor"}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {isExpanded && (
          <div className="border-t">
            {employment.documents.map((doc, index) => (
              <DocumentItem
                key={doc.id}
                document={doc}
                index={index}
                isSelected={selectedDocs.has(doc.id)}
                employmentId={employment.id}
                onSelect={onSelectDocument}
                onPreview={onPreviewDocument}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Belge bulunamadı</h3>
      <p className="mt-1 text-sm text-gray-500">Seçtiğiniz filtrelere uygun belge bulunmamaktadır.</p>
      <Button variant="outline" className="mt-4" onClick={onReset}>
        Tüm belgeleri göster
      </Button>
    </div>
  )
}

