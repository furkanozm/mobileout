"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { IOSPopup } from "./ios-popup"
import { IOSAlert } from "./ui/ios-alert"

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  isOngoing: boolean
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface CVInfoFormProps {
  onSubmit: (data: any) => void
  onSaveSuccess: () => void
}

export function CVInfoForm({ onSubmit, onSaveSuccess }: CVInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    educations: [
      {
        id: "edu1",
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        isOngoing: false,
      },
    ] as Education[],
    experiences: [
      {
        id: "exp1",
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ] as Experience[],
    skills: "",
  })

  const [showPopup, setShowPopup] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true) // Show confirmation first
  }

  const handleConfirm = () => {
    onSubmit(formData)
    setShowConfirm(false)
    setShowPopup(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string | boolean) => {
    setFormData((prev) => {
      const newEducations = [...prev.educations]
      newEducations[index] = {
        ...newEducations[index],
        [field]: value,
      }
      return {
        ...prev,
        educations: newEducations,
      }
    })
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          id: `edu${Date.now()}`,
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          isOngoing: false,
        },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }))
  }

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    setFormData((prev) => {
      const newExperiences = [...prev.experiences]
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value,
      }
      return {
        ...prev,
        experiences: newExperiences,
      }
    })
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp${Date.now()}`,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="space-y-4">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="E-posta adresinizi girin"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Eğitim Bilgileri</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEducation}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Eğitim Ekle
            </Button>
          </div>

          <div className="space-y-4">
            {formData.educations.map((education, index) => (
              <Card key={education.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{index + 1}. Eğitim</h4>
                      {formData.educations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700 -mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`education-${index}-school`}>Okul</Label>
                        <Input
                          id={`education-${index}-school`}
                          value={education.school}
                          onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`education-${index}-degree`}>Derece</Label>
                        <Input
                          id={`education-${index}-degree`}
                          value={education.degree}
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`education-${index}-field`}>Alan</Label>
                      <Input
                        id={`education-${index}-field`}
                        value={education.field}
                        onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`education-${index}-startDate`}>Başlangıç Tarihi</Label>
                        <Input
                          id={`education-${index}-startDate`}
                          type="date"
                          value={education.startDate}
                          onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`education-${index}-endDate`}>Bitiş Tarihi</Label>
                        <Input
                          id={`education-${index}-endDate`}
                          type="date"
                          value={education.endDate}
                          onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                          disabled={education.isOngoing}
                          required={!education.isOngoing}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`education-${index}-isOngoing`}
                        checked={education.isOngoing}
                        onCheckedChange={(checked) => handleEducationChange(index, "isOngoing", checked === true)}
                      />
                      <Label htmlFor={`education-${index}-isOngoing`}>Devam Ediyor</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">İş Deneyimi</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExperience}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Deneyim Ekle
            </Button>
          </div>

          <div className="space-y-4">
            {formData.experiences.map((experience, index) => (
              <Card key={experience.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{index + 1}. İş Deneyimi</h4>
                      {formData.experiences.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700 -mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`experience-${index}-company`}>Şirket</Label>
                      <Input
                        id={`experience-${index}-company`}
                        value={experience.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`experience-${index}-position`}>Pozisyon</Label>
                      <Input
                        id={`experience-${index}-position`}
                        value={experience.position}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`experience-${index}-startDate`}>Başlangıç Tarihi</Label>
                        <Input
                          id={`experience-${index}-startDate`}
                          type="date"
                          value={experience.startDate}
                          onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`experience-${index}-endDate`}>Bitiş Tarihi</Label>
                        <Input
                          id={`experience-${index}-endDate`}
                          type="date"
                          value={experience.endDate}
                          onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`experience-${index}-description`}>İş Tanımı</Label>
                      <Textarea
                        id={`experience-${index}-description`}
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="skills">Yetenekler</Label>
          <Textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full">
          CV'ni Kaydet
        </Button>
      </form>

      <IOSAlert
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="CV Kaydetme"
        message="Sistem üzerinde yapılan işe girişler CV'ye eklensin mi?"
        confirmText="Evet"
        cancelText="Hayır"
      />

      <IOSPopup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false)
          onSaveSuccess()
        }}
        message="CV'niz kaydedildi"
      />
    </>
  )
}

