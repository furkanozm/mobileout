"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, FileText, CheckCircle } from "lucide-react"
import { IOSToast } from "./ios-toast"
import { Card } from "@/components/ui/card"
import { IOSAlert } from "./ui/ios-alert"

interface CVUploadFlowProps {
  onBack: () => void
  onSaveSuccess: () => void
}

export function CVUploadFlow({ onBack, onSaveSuccess }: CVUploadFlowProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMessage, setScanMessage] = useState("Dosya yükleniyor...")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  })
  const [showToast, setShowToast] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock OCR data
  const mockOCRData = {
    fullName: "Ahmet Yılmaz",
    phone: "+90 555 123 4567",
    email: "ahmet.yilmaz@example.com",
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (scanning) {
      timer = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 1

          // Update scan message based on progress
          if (newProgress === 1) {
            setScanMessage("Dosya yükleniyor...")
          } else if (newProgress === 2) {
            setScanMessage("Dosya taranıyor...")
          } else if (newProgress === 3) {
            setScanMessage("Metin çıkarılıyor...")
          } else if (newProgress === 4) {
            setScanMessage("Bilgiler işleniyor...")
          } else if (newProgress === 5) {
            setScanMessage("Tamamlandı!")
          }

          // When scan is complete
          if (newProgress > 5) {
            clearInterval(timer)
            setScanning(false)
            setShowForm(true)
            setFormData(mockOCRData)
            return 5
          }

          return newProgress
        })
      }, 1000) // Each step takes 1 second, total 5 seconds
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [scanning])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setScanning(true)
      setScanProgress(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false)
    setShowToast(true)

    setTimeout(() => {
      onSaveSuccess()
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold ml-4">CV'ni Yükle</h1>
      </header>

      <main className="flex-1 p-4">
        {!scanning && !showForm ? (
          <div className="space-y-4">
            <Card className="p-4">
              <Label
                htmlFor="file-upload"
                className="flex items-center cursor-pointer border border-gray-300 rounded-md py-3 px-2 hover:border-blue-500 transition-colors duration-200"
              >
                <span className="text-blue-600">Dosya Seç</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500">{selectedFile ? selectedFile.name : "Dosya Seçilmedi"}</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </Card>
          </div>
        ) : scanning ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((scanProgress * Math.PI) / 2.5)}% ${50 - 50 * Math.cos((scanProgress * Math.PI) / 2.5)}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                }}
              ></div>
              <FileText className="h-16 w-16 text-blue-500" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-blue-700">{scanMessage}</h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress * 20}%` }}
                ></div>
              </div>
              <p className="text-gray-500 text-sm">{scanProgress * 20}% tamamlandı</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Ad Soyad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Telefon <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Bilgiler OCR ile edinilmiştir
                </div>
              </div>
            </Card>

            <Button type="submit" className="w-full">
              Kaydet
            </Button>
          </form>
        )}
      </main>

      <IOSToast
        open={showToast}
        onClose={() => setShowToast(false)}
        title="CV Kaydedildi"
        description="CV'niz başarıyla kaydedildi."
        titleClassName="text-sm"
        descriptionClassName="text-xs"
      />

      <IOSAlert
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="CV Tercihi"
        message="Sonraki işe girişleriniz bu CV'ye eklensin mi?"
        confirmText="Evet"
        cancelText="Hayır"
        onConfirm={() => handleConfirmation(true)}
        onCancel={() => handleConfirmation(false)}
        showCancel={true}
      />
    </div>
  )
}

