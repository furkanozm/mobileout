"use client"

import type React from "react"

import { useState } from "react"
import { Search, Clock, X, ChevronRight, ChevronLeft, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for recent searches
const RECENT_SEARCHES = ["Puantaj #20240218", "Ahmet Yılmaz", "Antalya Sera", "12345678901"]

// Mock data for search results
const MOCK_RESULTS = [
  {
    type: "puantaj",
    title: "Günlük Puantaj #20240218",
    subtitle: "18 Şubat 2024 • Polen • Sera Projeleri",
    status: "pending",
  },
  {
    type: "personel",
    title: "Ahmet Yılmaz",
    subtitle: "12345678901 • Sera İşçiliği",
    status: "active",
  },
  {
    type: "teklif",
    title: "Teklif #TKF-2024-001",
    subtitle: "Polen • Antalya Domates Serası",
    status: "pending",
  },
]

type SearchCategory = "all" | "puantaj" | "personel" | "teklif"

export function SearchScreen({ onBack, onTabChange }: { onBack: () => void; onTabChange: (tab: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES)
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Clear search term
  const handleClear = () => {
    setSearchTerm("")
    setIsSearching(false)
  }

  // Add search term to recent searches
  const addToRecentSearches = (term: string) => {
    if (term.trim() === "") return
    setRecentSearches((prev) => {
      const newSearches = [term, ...prev.filter((s) => s !== term)]
      return newSearches.slice(0, 5) // Keep only last 5 searches
    })
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)
      addToRecentSearches(searchTerm)
    }
  }

  // Filter results based on category
  const filteredResults = MOCK_RESULTS.filter((result) => {
    if (activeCategory === "all") return true
    return result.type === activeCategory
  })

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => onTabChange("home")} className="hover:bg-transparent">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-blue-600">OutsourceHub</h1>
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      <div className="bg-white border-b">
        <form onSubmit={handleSearch} className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 h-10 bg-gray-100 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              placeholder="Puantaj, personel veya teklif ara..."
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Touch-scrollable category filters */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap ${
                activeCategory === "all" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              Tümü
            </Button>
            <Button
              variant={activeCategory === "puantaj" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("puantaj")}
              className={`whitespace-nowrap ${
                activeCategory === "puantaj" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              Puantajlar
            </Button>
            <Button
              variant={activeCategory === "personel" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("personel")}
              className={`whitespace-nowrap ${
                activeCategory === "personel" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              Personeller
            </Button>
            <Button
              variant={activeCategory === "teklif" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("teklif")}
              className={`whitespace-nowrap ${
                activeCategory === "teklif" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              Teklifler
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4">
        {!isSearching && recentSearches.length > 0 && (
          <Card className="bg-white border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">Son Aramalar</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 border border-blue-300 rounded-full px-3"
                  onClick={() => setRecentSearches([])}
                >
                  Temizle
                </Button>
              </div>
              <div className="divide-y divide-gray-200">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3 hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm(search)
                      setIsSearching(true)
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="truncate text-gray-700">{search}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {isSearching && (
          <div className="space-y-2">
            {filteredResults.map((result, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{result.title}</h3>
                    <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={
                      result.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }
                  >
                    {result.status === "pending" ? "Beklemede" : "Aktif"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isSearching && filteredResults.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">Sonuç bulunamadı</p>
          </div>
        )}
      </main>
    </div>
  )
}

