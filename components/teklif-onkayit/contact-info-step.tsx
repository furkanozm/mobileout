"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormCard } from "./form-card"
import { useState } from "react"

interface ContactInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
}

export function ContactInfoStep({ formData, updateFormData }: ContactInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  return (
    <div className="space-y-6">
      <FormCard title="İletişim">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">
              İletişim Kişisi Adı Soyadı <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className={errors.contactName ? "border-red-500" : ""}
            />
            {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactTitle">
              Ünvan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactTitle"
              name="contactTitle"
              value={formData.contactTitle}
              onChange={handleChange}
              className={errors.contactTitle ? "border-red-500" : ""}
            />
            {errors.contactTitle && <p className="text-red-500 text-xs">{errors.contactTitle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">
              Telefon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={errors.contactPhone ? "border-red-500" : ""}
              placeholder="05XX XXX XX XX"
            />
            {errors.contactPhone && <p className="text-red-500 text-xs">{errors.contactPhone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              E-posta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className={errors.contactEmail ? "border-red-500" : ""}
            />
            {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail}</p>}
          </div>
        </div>
      </FormCard>
    </div>
  )
}

