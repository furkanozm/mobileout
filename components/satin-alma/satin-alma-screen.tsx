"use client"

import { useState } from "react"
import { SatinAlmaListScreen } from "./satin-alma-list-screen"
import { StepIndicator } from "../teklif/step-indicator"
import { PurchaseStep2Form } from "./purchase-step2-form"
import { PurchaseStep3Form } from "./purchase-step3-form"
import { PurchaseStep4Form } from "./purchase-step4-form"
import { PurchaseDetailScreen } from "./purchase-detail-screen"
import { PurchaseRequestSummary } from "./purchase-request-summary"
import type { FormStep, PurchaseRequest } from "./types"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe } from "lucide-react"
import { IOSAlert } from "@/components/ui/ios-alert"
import { MOCK_PURCHASE_REQUESTS } from "./mock-data"

interface SatinAlmaScreenProps {
  onBack: () => void
}

const steps = [
  { number: 1, title: "Talep Bilgileri" },
  { number: 2, title: "Ürün Detayları" },
  { number: 3, title: "Talep Nedeni" },
]

export function SatinAlmaScreen({ onBack }: SatinAlmaScreenProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [newRequest, setNewRequest] = useState<PurchaseRequest | null>(null)
  const [requests, setRequests] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS)
  const [requestType, setRequestType] = useState<"internal" | "contractor">("internal")
  const [includeInCurrentBillingPeriod, setIncludeInCurrentBillingPeriod] = useState(true)
  const [separateInvoice, setSeparateInvoice] = useState(false)

  const handleUpdateRequest = (updatedRequest: PurchaseRequest) => {
    setRequests((prevRequests) => prevRequests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)))
    setSelectedRequest(updatedRequest)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as FormStep)
    } else {
      // Simulate creating a new request
      const createdRequest: PurchaseRequest = {
        id: `SA-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        requestDate: new Date().toISOString().split("T")[0],
        deadline: "2024-03-31", // Example date
        requestType: requestType,
        items: [
          { id: "1", productGroup: "Elektronik", product: "Laptop", unit: "Adet", quantity: 5 },
          { id: "2", productGroup: "Ofis Malzemeleri", product: "Kalem", unit: "Kutu", quantity: 10 },
        ],
        reason: "Yeni proje için ekipman ihtiyacı",
        status: "pending",
        includeInCurrentBillingPeriod: requestType === "contractor" ? includeInCurrentBillingPeriod : undefined,
        separateInvoice: requestType === "contractor" ? separateInvoice : undefined,
      }
      setNewRequest(createdRequest)
      setShowSummary(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep)
    } else {
      setShowNewRequestForm(false)
    }
  }

  const handleSummaryClose = () => {
    setShowSummary(false)
    setShowNewRequestForm(false)
    setCurrentStep(1)
    toast({
      title: "Başarılı",
      description: "Satın alma talebi başarıyla oluşturuldu.",
    })
  }

  if (selectedRequest) {
    return (
      <PurchaseDetailScreen
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onUpdateRequest={handleUpdateRequest}
      />
    )
  }

  if (showNewRequestForm) {
    return (
      <div className="h-full flex flex-col bg-blue-50">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setShowNewRequestForm(false)}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        <div className="p-4">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="flex-1 overflow-y-auto pb-[76px]">
          {currentStep === 1 && (
            <PurchaseStep2Form
              onNext={handleNext}
              onBack={handleBack}
              requestType={requestType}
              setRequestType={setRequestType}
            />
          )}
          {currentStep === 2 && <PurchaseStep3Form onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && (
            <PurchaseStep4Form
              onNext={handleNext}
              onBack={handleBack}
              requestType={requestType}
              includeInCurrentBillingPeriod={includeInCurrentBillingPeriod}
              setIncludeInCurrentBillingPeriod={setIncludeInCurrentBillingPeriod}
              separateInvoice={separateInvoice}
              setSeparateInvoice={setSeparateInvoice}
            />
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Geri
            </Button>
            <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {currentStep === 3 ? "Tamamla" : "Devam Et"}
            </Button>
          </div>
        </div>

        {showSummary && newRequest && (
          <IOSAlert
            isOpen={showSummary}
            onClose={handleSummaryClose}
            onConfirm={handleSummaryClose}
            title="Satın Alma Talebi Özeti"
            message={<PurchaseRequestSummary request={newRequest} />}
            confirmText="Tamam"
          />
        )}
      </div>
    )
  }

  return (
    <>
      <SatinAlmaListScreen
        onBack={onBack}
        onNewRequest={() => setShowNewRequestForm(true)}
        onSelectRequest={setSelectedRequest}
      />
      <Toaster />
    </>
  )
}

