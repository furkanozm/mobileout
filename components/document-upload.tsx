import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface DocumentUploadProps {
  onUpload: (files: File[]) => void
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpload(files)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          htmlFor="file-upload"
          className="flex items-center cursor-pointer border border-gray-300 rounded-md py-3 px-2 hover:border-blue-500 transition-colors duration-200"
        >
          <span className="text-blue-600">Dosyaları Seç</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-gray-500">
            {files.length === 0 ? "Dosya Seçilmedi" : `${files.length} Dosya Seçildi`}
          </span>
        </Label>
        <Input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Yüklenen Belgeler:</h3>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{file.name}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={files.length === 0}>
        Devam Et
      </Button>
    </form>
  )
}

