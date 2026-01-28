import type React from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, required = false, children }: FormFieldProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="w-1/3 pr-2">
        <Label className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

