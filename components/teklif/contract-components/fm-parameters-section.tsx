"use client"

import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FMParametersSectionProps {
  values: {
    fmParametreleriDahil: boolean
    normalFM: string
    htFM: string
    rtFM: string
  }
  onChange: (field: string, value: any) => void
}

export function FMParametersSection({ values, onChange }: FMParametersSectionProps) {
  return (
    <Card className="border-0 shadow-sm">
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fmParametreleri"
              checked={values.fmParametreleriDahil}
              onCheckedChange={(checked) => onChange("fmParametreleriDahil", checked === true)}
            />
            <Label htmlFor="fmParametreleri" className="text-sm text-gray-600">
              FM Parametreleri teklife dahil edilecek mi?
            </Label>
          </div>

          {values.fmParametreleriDahil && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="normalFM" className="text-sm text-gray-600">
                  Normal FM
                </Label>
                <Select value={values.normalFM} onValueChange={(value) => onChange("normalFM", value)}>
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="Normal FM seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">%50</SelectItem>
                    <SelectItem value="100">%100</SelectItem>
                    <SelectItem value="150">%150</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="htFM" className="text-sm text-gray-600">
                  HT FM
                </Label>
                <Select value={values.htFM} onValueChange={(value) => onChange("htFM", value)}>
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="HT FM seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">%50</SelectItem>
                    <SelectItem value="100">%100</SelectItem>
                    <SelectItem value="150">%150</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtFM" className="text-sm text-gray-600">
                  RT FM
                </Label>
                <Select value={values.rtFM} onValueChange={(value) => onChange("rtFM", value)}>
                  <SelectTrigger className="w-full h-11 bg-white">
                    <SelectValue placeholder="RT FM seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">%50</SelectItem>
                    <SelectItem value="100">%100</SelectItem>
                    <SelectItem value="150">%150</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

