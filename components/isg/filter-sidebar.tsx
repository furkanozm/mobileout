"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X, Search } from "lucide-react"

interface FilterOptions {
  searchQuery: string
  departments: string[]
  statuses: string[]
}

interface FilterSidebarProps {
  show: boolean
  onClose: () => void
  filterOptions: FilterOptions
  onFilterChange: (newOptions: FilterOptions) => void
  departments: string[]
}

export function FilterSidebar({ show, onClose, filterOptions, onFilterChange, departments }: FilterSidebarProps) {
  const [localOptions, setLocalOptions] = useState<FilterOptions>(filterOptions)
  const [sidebarAnimation, setSidebarAnimation] = useState("translate-x-full")

  // Status options
  const statusOptions = [
    { id: "attended", label: "Katıldı" },
    { id: "absent", label: "Katılmadı" },
    { id: "pending", label: "Beklemede" },
  ]

  useEffect(() => {
    if (show) {
      // Small delay to ensure the sidebar is rendered before animating
      setTimeout(() => setSidebarAnimation("translate-x-0"), 10)
    } else {
      setSidebarAnimation("translate-x-full")
    }
  }, [show])

  useEffect(() => {
    // Reset local options when filter options change
    setLocalOptions(filterOptions)
  }, [filterOptions])

  const handleSearchChange = (value: string) => {
    setLocalOptions((prev) => ({ ...prev, searchQuery: value }))
  }

  const handleDepartmentChange = (department: string, checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      departments: checked ? [...prev.departments, department] : prev.departments.filter((d) => d !== department),
    }))
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      statuses: checked ? [...prev.statuses, status] : prev.statuses.filter((s) => s !== status),
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(localOptions)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedOptions = {
      searchQuery: "",
      departments: [],
      statuses: [],
    }
    setLocalOptions(clearedOptions)
    onFilterChange(clearedOptions)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose}>
      <div
        className={`absolute top-0 right-0 bottom-0 w-3/4 max-w-[280px] bg-white shadow-xl transition-transform duration-300 ease-out ${sidebarAnimation}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Filtreler</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-4">
            {/* Search */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Ara</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="İsim, TCKN veya pozisyon..."
                  className="pl-9"
                  value={localOptions.searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Departments */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Departman</Label>
              <div className="space-y-1">
                {departments.map((department) => (
                  <div key={department} className="flex items-center space-x-2">
                    <Checkbox
                      id={`department-${department}`}
                      checked={localOptions.departments.includes(department)}
                      onCheckedChange={(checked) => handleDepartmentChange(department, checked === true)}
                    />
                    <Label htmlFor={`department-${department}`} className="text-sm font-normal">
                      {department}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Statuses */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Durum</Label>
              <div className="space-y-1">
                {statusOptions.map((status) => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.id}`}
                      checked={localOptions.statuses.includes(status.id)}
                      onCheckedChange={(checked) => handleStatusChange(status.id, checked === true)}
                    />
                    <Label htmlFor={`status-${status.id}`} className="text-sm font-normal">
                      {status.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 border-t space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleApplyFilters}>
              Filtreleri Uygula
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClearFilters}>
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

