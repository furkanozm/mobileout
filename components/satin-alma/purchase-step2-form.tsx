"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CONTRACTORS } from "./mock-data"
import type { StepComponentProps } from "./types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PurchaseStep2FormProps extends StepComponentProps {
  requestType: "internal" | "contractor"
  setRequestType: (type: "internal" | "contractor") => void
}

export function PurchaseStep2Form({ onNext, onBack, requestType, setRequestType }: PurchaseStep2FormProps) {
  const [selectedContractor, setSelectedContractor] = useState("")
  const [selectedManager, setSelectedManager] = useState("")
  const [isForProject, setIsForProject] = useState(false)
  const [projectId, setProjectId] = useState("")

  const selectedContractorData = MOCK_CONTRACTORS.find((c) => c.id === selectedContractor)

  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split("T")[0],
    deadline: "",
    requestType: "internal",
    contractor: "",
    contractorManager: "",
  })

  // const selectedContractor = MOCK_CONTRACTORS.find((c) => c.id === formData.contractor)

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestType" className="text-sm font-medium">
                Talep Tipi
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground transition-colors ${
                    requestType === "internal" ? "border-primary bg-primary/5" : "border-muted bg-popover"
                  }`}
                  onClick={() => setRequestType("internal")}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3 h-6 w-6"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span className="text-sm">Kurum içi talep</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground transition-colors ${
                    requestType === "contractor" ? "border-primary bg-primary/5" : "border-muted bg-popover"
                  }`}
                  onClick={() => setRequestType("contractor")}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3 h-6 w-6"
                  >
                    <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                    <path d="M4 12H2" />
                    <path d="M10 12H8" />
                    <path d="M16 12h-2" />
                    <path d="M22 12h-2" />
                  </svg>
                  <span className="text-sm">Kurum dışı talep</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Proje İçin mi?</Label>
              <RadioGroup
                value={isForProject ? "yes" : "no"}
                onValueChange={(value) => setIsForProject(value === "yes")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="cursor-pointer">
                    Evet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="cursor-pointer">
                    Hayır
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {isForProject && (
              <div className="space-y-2">
                <Label htmlFor="projectId">Proje ID</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="projectId">
                    <SelectValue placeholder="Proje seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRJ-2023-001">PRJ-2023-001 (İstanbul Metro)</SelectItem>
                    <SelectItem value="PRJ-2023-002">PRJ-2023-002 (Ankara AVM)</SelectItem>
                    <SelectItem value="PRJ-2023-003">PRJ-2023-003 (İzmir Konut)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestDate">Talep Tarihi</Label>
              <Input
                id="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Termin Tarihi</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          {requestType === "contractor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="contractor">Yüklenici</Label>
                <Select
                  value={formData.contractor}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      contractor: value,
                      contractorManager: "",
                    })
                  }
                >
                  <SelectTrigger id="contractor">
                    <SelectValue placeholder="Yüklenici seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CONTRACTORS.map((contractor) => (
                      <SelectItem key={contractor.id} value={contractor.id}>
                        {contractor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractorManager">Yüklenici Yöneticisi</Label>
                <Select
                  value={formData.contractorManager}
                  onValueChange={(value) => setFormData({ ...formData, contractorManager: value })}
                  disabled={!formData.contractor}
                >
                  <SelectTrigger id="contractorManager">
                    <SelectValue placeholder="Yönetici seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CONTRACTORS.find((c) => c.id === formData.contractor)?.managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} - {manager.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

