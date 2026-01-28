"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CONTRACTORS } from "./mock-data"
import type { StepComponentProps } from "./types"

interface PurchaseStep1FormProps extends StepComponentProps {
  requestType: "internal" | "contractor"
  setRequestType: (type: "internal" | "contractor") => void
}

export function PurchaseStep1Form({ onNext, onBack, requestType, setRequestType }: PurchaseStep1FormProps) {
  const [selectedContractor, setSelectedContractor] = useState("")
  const [selectedManager, setSelectedManager] = useState("")
  const [isForProject, setIsForProject] = useState(false)
  const [projectId, setProjectId] = useState("")

  const selectedContractorData = MOCK_CONTRACTORS.find((c) => c.id === selectedContractor)

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Talep Türü</Label>
            <RadioGroup
              value={requestType}
              onValueChange={(value) => setRequestType(value as "internal" | "contractor")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal" className="cursor-pointer">
                  Kurum İçi Talep
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contractor" id="contractor" />
                <Label htmlFor="contractor" className="cursor-pointer">
                  Taşeron Firma Talebi
                </Label>
              </div>
            </RadioGroup>
          </div>

          {requestType === "contractor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="contractor">Taşeron Firma</Label>
                <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                  <SelectTrigger id="contractor">
                    <SelectValue placeholder="Taşeron firma seçin" />
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

              {selectedContractorData && (
                <div className="space-y-2">
                  <Label htmlFor="manager">Firma Yetkilisi</Label>
                  <Select value={selectedManager} onValueChange={setSelectedManager}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder="Firma yetkilisi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedContractorData.managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} ({manager.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

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
      </Card>
    </div>
  )
}

