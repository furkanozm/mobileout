"use client"
import { FormField } from "./form-field"
import { Textarea } from "@/components/ui/textarea"

interface NotesSectionProps {
  notes: string
  onValueChange: (field: string, value: string) => void
}

export function NotesSection({ notes, onValueChange }: NotesSectionProps) {
  return (
    <FormField label="Notlar">
      <Textarea
        id="notes"
        placeholder="Ek notlarınızı buraya yazın..."
        value={notes}
        onChange={(e) => onValueChange("notes", e.target.value)}
        className="w-full"
      />
    </FormField>
  )
}

