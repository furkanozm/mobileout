"use client"
import { FormField } from "./form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyInfoSectionProps {
  company: string
  projectGroup: string
  project: string
  jobType: string
  onValueChange: (field: string, value: string) => void
}

export function CompanyInfoSection({
  company,
  projectGroup,
  project,
  jobType,
  onValueChange,
}: CompanyInfoSectionProps) {
  return (
    <div className="space-y-6">
      <FormField label="Firma" required>
        <Select value={company} onValueChange={(value) => onValueChange("company", value)} required>
          <SelectTrigger id="company" className="w-full">
            <SelectValue placeholder="Firma seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="polen">Polen</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Proje Grubu" required>
        <Select value={projectGroup} onValueChange={(value) => onValueChange("projectGroup", value)} required>
          <SelectTrigger id="projectGroup" className="w-full">
            <SelectValue placeholder="Proje grubu seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sera">Sera Projeleri</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Proje" required>
        <Select value={project} onValueChange={(value) => onValueChange("project", value)} required>
          <SelectTrigger id="project" className="w-full">
            <SelectValue placeholder="Proje seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="antalya">Antalya Domates Serası</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="İş Türü" required>
        <Select value={jobType} onValueChange={(value) => onValueChange("jobType", value)} required>
          <SelectTrigger id="jobType" className="w-full">
            <SelectValue placeholder="İş türü seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sera">Sera İşçiliği</SelectItem>
            <SelectItem value="hasat">Hasat İşçiliği</SelectItem>
            <SelectItem value="ilaclama">İlaçlama İşçiliği</SelectItem>
            <SelectItem value="sulama">Sulama İşçiliği</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  )
}

