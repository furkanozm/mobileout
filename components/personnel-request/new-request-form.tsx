"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

import { FormHeader } from "./form-header"
import { CompanyInfoSection } from "./company-info-section"
import { PersonnelDistributionSection } from "./personnel-distribution-section"
import { DurationSection } from "./duration-section"
import { NotesSection } from "./notes-section"
import type { FormData } from "./form-types"

interface NewRequestFormProps {
  onBack: () => void
}

export function NewRequestForm({ onBack }: NewRequestFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    company: "",
    projectGroup: "",
    project: "",
    jobType: "",
    numberOfMale: "",
    numberOfFemale: "",
    startDate: "",
    endDate: "",
    notes: "",
    isMixedGender: true,
    numberOfPeople: "",
    durationType: "unlimited",
    durationMethod: "dateRange",
    workingDays: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if form is valid
    const form = e.target as HTMLFormElement
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setIsSubmitting(true)

    // Validate dates
    if (formData.durationType === "limited" && formData.durationMethod === "dateRange") {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.",
        })
        setIsSubmitting(false)
        return
      }
    }

    // Validate number of people
    let totalPeople = 0
    if (formData.isMixedGender) {
      totalPeople = Number.parseInt(formData.numberOfPeople)
    } else {
      totalPeople = Number.parseInt(formData.numberOfMale) + Number.parseInt(formData.numberOfFemale)
    }

    if (totalPeople <= 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Toplam personel sayısı 0'dan büyük olmalıdır.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Başarılı",
        description: "Personel talebi başarıyla oluşturuldu.",
      })

      // Wait for toast to be visible before navigating
      setTimeout(() => {
        onBack()
      }, 1000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <FormHeader title="OutsourceHub" onBack={onBack} />

      <div className="h-full overflow-y-auto custom-scrollbar px-4 pb-20 pt-4">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6" noValidate={false}>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-blue-600">Yeni Personel Talebi</h2>
            </div>
          </div>

          <div className="space-y-6">
            <CompanyInfoSection
              company={formData.company}
              projectGroup={formData.projectGroup}
              project={formData.project}
              jobType={formData.jobType}
              onValueChange={handleChange}
            />

            <PersonnelDistributionSection
              isMixedGender={formData.isMixedGender}
              numberOfPeople={formData.numberOfPeople}
              numberOfMale={formData.numberOfMale}
              numberOfFemale={formData.numberOfFemale}
              onValueChange={handleChange}
            />

            <DurationSection
              durationType={formData.durationType}
              durationMethod={formData.durationMethod}
              startDate={formData.startDate}
              endDate={formData.endDate}
              workingDays={formData.workingDays}
              onValueChange={handleChange}
            />

            <NotesSection notes={formData.notes} onValueChange={handleChange} />
          </div>
        </form>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="absolute bottom-32 right-4 size-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
      >
        <Send className="size-6" />
        <span className="sr-only">Gönder</span>
      </Button>
      <Toaster />
    </div>
  )
}

