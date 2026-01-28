"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { TeklifCard } from "./teklif-card"
import type { Teklif } from "./types"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TeklifListProps {
  teklifler: Teklif[]
  onTeklifSelect: (teklif: Teklif) => void
  filters?: {
    revizyon?: string
    durum?: string
    revizeVarMi?: string
  }
}

export function TeklifList({ teklifler, onTeklifSelect, filters = {} }: TeklifListProps) {
  const [selectedTeklifler, setSelectedTeklifler] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)

  // Filter teklifler based on revision status and other filters
  const filteredTeklifler = useMemo(() => {
    let filtered = [...teklifler]

    // Filter by revision status
    if (filters.revizyon && filters.revizyon !== "all") {
      if (filters.revizyon === "original") {
        filtered = filtered.filter((teklif) => !teklif.currentRevision)
      } else if (filters.revizyon === "revised") {
        filtered = filtered.filter((teklif) => !!teklif.currentRevision)
      } else if (filters.revizyon === "r1") {
        filtered = filtered.filter((teklif) => teklif.currentRevision === 1)
      } else if (filters.revizyon === "r2") {
        filtered = filtered.filter((teklif) => teklif.currentRevision === 2)
      } else if (filters.revizyon === "r3") {
        filtered = filtered.filter((teklif) => teklif.currentRevision && teklif.currentRevision >= 3)
      }
    }

    // Filter by revision existence
    if (filters.revizeVarMi && filters.revizeVarMi !== "all") {
      if (filters.revizeVarMi === "var") {
        filtered = filtered.filter((teklif) => !!teklif.currentRevision)
      } else if (filters.revizeVarMi === "yok") {
        filtered = filtered.filter((teklif) => !teklif.currentRevision)
      }
    }

    // Filter by status
    if (filters.durum && filters.durum !== "all") {
      filtered = filtered.filter((teklif) => teklif.durum === filters.durum)
    }

    return filtered
  }, [teklifler, filters.revizyon, filters.durum, filters.revizeVarMi])

  // Reset selection when filters change
  useEffect(() => {
    setSelectedTeklifler(new Set())
    setIsAllSelected(false)
  }, [filters])

  const handleSelect = (id: string) => {
    setSelectedTeklifler((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      setIsAllSelected(newSet.size === filteredTeklifler.length)
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTeklifler(new Set())
      setIsAllSelected(false)
    } else {
      setSelectedTeklifler(new Set(filteredTeklifler.map((t) => t.id)))
      setIsAllSelected(true)
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-800">Teklifler</h1>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {isAllSelected ? "Seçimi Temizle" : "Tümünü Seç"}
          </Button>
        </div>

        {/* Active filters display */}
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.revizyon && filters.revizyon !== "all" && (
            <Badge variant="outline" className="bg-blue-50">
              {filters.revizyon === "original"
                ? "Orijinal Teklifler"
                : filters.revizyon === "revised"
                  ? "Revize Edilmiş Teklifler"
                  : filters.revizyon === "r1"
                    ? "Revizyon 1"
                    : filters.revizyon === "r2"
                      ? "Revizyon 2"
                      : filters.revizyon === "r3"
                        ? "Revizyon 3+"
                        : ""}
            </Badge>
          )}

          {filters.revizeVarMi && filters.revizeVarMi !== "all" && (
            <Badge variant="outline" className="bg-blue-50">
              {filters.revizeVarMi === "var" ? "Revize Var" : "Revize Yok"}
            </Badge>
          )}

          {filters.durum && filters.durum !== "all" && (
            <Badge
              variant="outline"
              className={
                filters.durum === "onaylandi"
                  ? "bg-green-50"
                  : filters.durum === "reddedildi"
                    ? "bg-red-50"
                    : filters.durum === "revize_edildi"
                      ? "bg-blue-50"
                      : filters.durum === "beklemede"
                        ? "bg-yellow-50"
                        : ""
              }
            >
              {filters.durum === "onaylandi"
                ? "Onaylandı"
                : filters.durum === "reddedildi"
                  ? "Reddedildi"
                  : filters.durum === "revize_edildi"
                    ? "Revize Edildi"
                    : "Beklemede"}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {filteredTeklifler.map((teklif, index) => (
            <TeklifCard
              key={teklif.id}
              teklif={teklif}
              onClick={() => onTeklifSelect(teklif)}
              index={index}
              isSelected={selectedTeklifler.has(teklif.id)}
              onSelect={() => handleSelect(teklif.id)}
            />
          ))}

          {filteredTeklifler.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Bu filtrelere uygun teklif bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

