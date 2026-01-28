"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe } from "lucide-react"
import { TeklifStep1Form } from "./teklif-step1-form"
import { TeklifStep2Form } from "./teklif-step2-form"
import { TeklifStep3Form } from "./teklif-step3-form"
import { TeklifStep4Form } from "./teklif-step4-form"
import { TeklifPreview } from "./teklif-preview"
import { StepIndicator } from "./step-indicator"

interface YeniTeklifScreenProps {
  onComplete: () => void
}

export function YeniTeklifScreen({ onComplete }: YeniTeklifScreenProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    onKayitDurumu: null,
    firmaId: null,
    firmaAdi: "",
    vergiNo: "",
    sektor: "",
    iletisimKisi: "",
    telefon: "",
    email: "",
    hizmetTuru: "",
    personelSayisi: "",
    lokasyon: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    aciklama: "",
    ekHizmetler: [],
    professionEntries: [],
  })

  const steps = [
    { number: 1, title: "Ön Kayıt" },
    { number: 2, title: "Firma" },
    { number: 3, title: "Hizmet" },
    { number: 4, title: "Ek Hizmet" },
    { number: 5, title: "Önizleme" },
  ]

  const handleBack = () => {
    if (currentStep === 1) {
      onComplete()
      return
    }
    setCurrentStep((prev) => prev - 1)
  }

  const handleNext = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep((prev) => prev + 1)
  }

  const handleComplete = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }))
    onComplete()
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TeklifStep1Form onNext={handleNext} onBack={handleBack} formData={formData} />
      case 2:
        return <TeklifStep2Form onNext={handleNext} onBack={handleBack} formData={formData} />
      case 3:
        return (
          <TeklifStep3Form
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
          />
        )
      case 4:
        return <TeklifStep4Form onNext={handleNext} onBack={handleBack} formData={formData} />
      case 5:
        return <TeklifPreview onBack={handleBack} onComplete={handleComplete} formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Form Content */}
      <div className="flex-1 overflow-hidden">{renderStep()}</div>
    </div>
  )
}

