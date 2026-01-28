"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | "pending" | "approved" | "rejected"

interface FilterOptions {
  status: FilterStatus
  documentType: string
  personnelName: string
  tckn: string
  projeGrubu: string // Add Project Group
  proje: string // Add Project
}

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

// Define available project groups and projects
const projectGroups = ["Yazılım Geliştirme", "Tasarım", "Veri Analizi", "Pazarlama", "İnsan Kaynakları"]

const projects = {
  "Yazılım Geliştirme": ["Web Uygulaması", "Mobil Uygulama", "API Geliştirme"],
  Tasarım: ["UI/UX Tasarımı", "Grafik Tasarım", "Marka Kimliği"],
  "Veri Analizi": ["Veri Madenciliği", "İş Zekası", "Veri Görselleştirme"],
  Pazarlama: ["Dijital Pazarlama", "İçerik Pazarlama", "SEO Optimizasyonu"],
  "İnsan Kaynakları": ["İşe Alım", "Eğitim", "Performans Değerlendirme"],
}

export function FilterSidebar({ isOpen, onClose, filters, onFiltersChange }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleStatusChange = (value: FilterStatus) => {
    setLocalFilters((prev) => ({ ...prev, status: value }))
  }

  const handleDocumentTypeChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, documentType: value }))
  }

  const handlePersonnelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, personnelName: e.target.value }))
  }

  const handleTcknChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, tckn: e.target.value }))
  }

  const handleProjectGroupChange = (value: string) => {
    // When project group changes, reset the project selection
    setLocalFilters((prev) => ({ ...prev, projeGrubu: value, proje: "" }))
  }

  const handleProjectChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, proje: value }))
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilters = {
      status: "all",
      documentType: "",
      personnelName: "",
      tckn: "",
      projeGrubu: "", // Reset Project Group
      proje: "", // Reset Project
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
    onClose()
  }

  // Get available projects based on selected project group
  const getAvailableProjects = () => {
    if (!localFilters.projeGrubu || localFilters.projeGrubu === "all") {
      return []
    }
    return projects[localFilters.projeGrubu as keyof typeof projects] || []
  }

  return (
    <>
      <div
        className={cn(
          "absolute inset-y-0 right-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filtreler</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">Durum</h3>
                <RadioGroup
                  value={localFilters.status}
                  onValueChange={handleStatusChange as (value: string) => void}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">Tümü</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="pending" />
                    <Label htmlFor="pending">Onay Bekleyenler</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approved" id="approved" />
                    <Label htmlFor="approved">Onaylananlar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rejected" id="rejected" />
                    <Label htmlFor="rejected">Reddedilenler</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Document Type Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">Belge Türü</h3>
                <Select value={localFilters.documentType} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Belge türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="Sözleşme">Sözleşme</SelectItem>
                    <SelectItem value="Sağlık">Sağlık</SelectItem>
                    <SelectItem value="Dilekçe">Dilekçe</SelectItem>
                    <SelectItem value="Belge">Belge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Group Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">Proje Grubu</h3>
                <Select value={localFilters.projeGrubu} onValueChange={handleProjectGroupChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Proje grubu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {projectGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Filter - Only show if a project group is selected */}
              {localFilters.projeGrubu && localFilters.projeGrubu !== "all" && (
                <div className="space-y-3">
                  <h3 className="font-medium">Proje</h3>
                  <Select value={localFilters.proje} onValueChange={handleProjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Proje seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {getAvailableProjects().map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Personnel Name Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">Personel Adı</h3>
                <Input
                  placeholder="Personel adı girin"
                  value={localFilters.personnelName}
                  onChange={handlePersonnelNameChange}
                />
              </div>

              {/* TCKN Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">TCKN</h3>
                <Input
                  placeholder="TCKN girin"
                  value={localFilters.tckn}
                  onChange={handleTcknChange}
                  maxLength={11}
                  pattern="\d*"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <Button className="w-full" onClick={handleApplyFilters}>
              Uygula
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="absolute inset-0 bg-black/20 z-40" onClick={onClose} />}
    </>
  )
}

