"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { CompanyInfoStep } from "./company-info-step"
import { ContactInfoStep } from "./contact-info-step"
import { ProjectInfoStep } from "./project-info-step"
import { ContractInfoStep } from "./contract-info-step"
import { ReviewStep } from "./review-step"
import { KVKKConsent } from "../kvkk-consent"
import { StepIndicator } from "../teklif/step-indicator"

interface TeklifOnkayitFlowProps {
  onBack: () => void
  onSaveSuccess: () => void
}

const steps = [
  { number: 1, title: "Firma" },
  { number: 2, title: "İletişim" },
  { number: 3, title: "Proje" },
  { number: 4, title: "Sözleşme" },
  { number: 5, title: "İnceleme" },
]

export function TeklifOnkayitFlow({ onBack, onSaveSuccess }: TeklifOnkayitFlowProps) {
  const [currentStep, setCurrentStep] = useState(0) // Start with 0 for KVKK

  // Initialize with default dates
  const today = new Date()
  const oneYearLater = new Date()
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    // Company Info
    companyName: "",
    taxId: "",
    taxOffice: "",
    address: "",
    city: "",
    district: "",

    // Contact Info
    contactName: "",
    contactTitle: "",
    contactPhone: "",
    contactEmail: "",

    // Project Info
    projectGroup: "",
    projectLocation: "",
    projectDescription: "",
    selectedProfessionCodes: [],
    averagePersonnelCount: "",
    additionalServices: [],

    // Contract Info
    contractType: "",
    selectedServices: [],
    estimatedBudget: "",
    needsAdditionalServices: false,

    // Service Duration - Set default dates
    startDate: formatDate(today),
    endDate: formatDate(oneYearLater),
  })

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data })
  }

  const handleNext = () => {
    if (currentStep === 5) {
      onSaveSuccess()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      onBack()
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  if (currentStep === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 p-4">
          <KVKKConsent
            onAccept={() => setCurrentStep(1)}
            title="KVKK Aydınlatma Metni"
            description="Kişisel verileriniz, teklif süreçlerinin yürütülmesi amacıyla, 6698 sayılı Kanun'un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenecektir."
            acceptButtonText="Okudum, Anladım"
            rejectButtonText="Reddet"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10">
        <button className="flex items-center text-rose-500" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Geri</span>
        </button>
        <h1 className="flex-1 text-center font-semibold">Teklif Önkayıt</h1>
        <div className="w-16"></div> {/* Spacer for balance */}
      </div>

      {/* Step Indicator */}
      <div className="bg-white py-2 px-4 shadow-sm sticky top-[57px] z-10">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Form content - with padding at bottom to make room for buttons */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {currentStep === 1 && <CompanyInfoStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <ContactInfoStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 3 && (
          <ProjectInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleNext()}
            onBack={() => handleBack()}
          />
        )}
        {currentStep === 4 && <ContractInfoStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 5 && <ReviewStep formData={formData} onSubmit={onSaveSuccess} />}
      </div>

      {/* Floating buttons - positioned at the bottom of the container */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white rounded-xl shadow-md p-3 flex justify-between border border-black">
          <button
            onClick={handleBack}
            className="h-12 px-8 rounded-lg border border-rose-200 text-rose-500 font-medium bg-white hover:bg-rose-50 transition-colors"
          >
            Geri
          </button>
          <button
            onClick={handleNext}
            className="h-12 px-8 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {currentStep === 5 ? "Kaydet" : "İleri"}
          </button>
        </div>
      </div>
    </div>
  )
}

