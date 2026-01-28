"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, FileText, Search, Info, Send, Plus, X } from "lucide-react"
import { IOSAlert } from "../ui/ios-alert"
import { IOSToast } from "../ui/ios-toast"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TeklifStep1FormProps {
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

// Mock data for registered companies
const REGISTERED_COMPANIES = [
  {
    id: "1",
    name: "ABC Holding",
    vergiNo: "1234567890",
    address: "İstanbul, Türkiye",
    contactName: "Ahmet Yılmaz",
    contactPhone: "0555 111 2233",
    contactEmail: "ahmet@abcholding.com",
    type: "registered",
  },
  {
    id: "2",
    name: "XYZ Teknoloji",
    vergiNo: "0987654321",
    address: "Ankara, Türkiye",
    contactName: "Mehmet Kaya",
    contactPhone: "0533 222 4455",
    contactEmail: "mehmet@xyzteknoloji.com",
    type: "registered",
  },
]

// Mock data for pre-registered companies
const PREREGISTERED_COMPANIES = [
  {
    id: "3",
    name: "123 Sanayi",
    vergiNo: "5678901234",
    address: "İzmir, Türkiye",
    contactName: "Ayşe Demir",
    contactPhone: "0544 333 6677",
    contactEmail: "ayse@123sanayi.com",
    type: "preregistered",
    sozlesmeTipi: "gecici", // geçici iş ilişkisi
    sector: "2", // Üretim
    selectedProfessionCodes: [
      { code: "1234", name: "Yazılım Geliştirici", count: "3" },
      { code: "5678", name: "Muhasebeci", count: "2" },
    ],
    additionalServices: [
      { service: "İş Sağlığı ve Güvenliği", unit: "Aylık", price: "2500" },
      { service: "Araç Kiralama", unit: "Kişi Başı", price: "3000" },
    ],
  },
  {
    id: "4",
    name: "DEF Limited",
    vergiNo: "9876543210",
    address: "Bursa, Türkiye",
    contactName: "Ali Yıldız",
    contactPhone: "0532 444 5566",
    contactEmail: "ali@deflimited.com",
    type: "preregistered",
    sozlesmeTipi: "danismanlik", // danışmanlık
    sector: "1", // Bilişim
    selectedProfessionCodes: [{ code: "9012", name: "İnsan Kaynakları Uzmanı", count: "1" }],
    additionalServices: [{ service: "Eğitim Hizmetleri", unit: "Aylık", price: "5000" }],
  },
]

export function TeklifStep1Form({ onNext, onBack, formData }: TeklifStep1FormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegisteredCompany, setSelectedRegisteredCompany] = useState<any>(null)
  const [selectedPreRegisteredCompany, setSelectedPreRegisteredCompany] = useState<any>(null)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showSendingToast, setShowSendingToast] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [companyType, setCompanyType] = useState("registered") // "registered" or "preregistered"
  const [showPreRegForm, setShowPreRegForm] = useState(false)
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  // Pre-registration form states
  const [preRegForm, setPreRegForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
  })

  // Reset search when changing tabs
  useEffect(() => {
    setSearchTerm("")
  }, [companyType])

  useEffect(() => {
    setFilteredCompanies(
      (companyType === "registered" ? REGISTERED_COMPANIES : PREREGISTERED_COMPANIES).filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.vergiNo.includes(searchTerm),
      ),
    )
  }, [searchTerm, companyType])

  const handleCompanySelect = (company: any) => {
    if (companyType === "registered") {
      setSelectedRegisteredCompany(company)
      setSelectedCompany(company)
    } else {
      setSelectedPreRegisteredCompany(company)
      setSelectedCompany(company)
    }
    setSearchTerm("")
    setFilteredCompanies([])
  }

  const handleRemoveCompany = () => {
    if (companyType === "registered") {
      setSelectedRegisteredCompany(null)
    } else {
      setSelectedPreRegisteredCompany(null)
    }
  }

  const handlePreRegSubmit = () => {
    setShowSendingToast(true)

    // Simulate sending pre-registration
    setTimeout(() => {
      setShowSendingToast(false)
      setShowSuccessToast(true)
      setShowPreRegForm(false)
      setPreRegForm({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
      })

      setTimeout(() => {
        setShowSuccessToast(false)
      }, 2000)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare data for next step
    const nextData = {
      firmaId: selectedCompany?.id,
      firmaAdi: selectedCompany?.name,
      vergiNo: selectedCompany?.vergiNo,
      iletisimKisi: selectedCompany?.contactName,
      telefon: selectedCompany?.contactPhone,
      email: selectedCompany?.contactEmail,
      firmaType: selectedCompany?.type,
      sozlesmeTipi: selectedCompany?.sozlesmeTipi,
      sektor: selectedCompany?.sector,
    }

    // If the selected company has profession codes, include them
    if (selectedCompany?.selectedProfessionCodes) {
      nextData.selectedProfessionCodes = selectedCompany.selectedProfessionCodes
    }

    // If the selected company has additional services, include them
    if (selectedCompany?.additionalServices) {
      nextData.additionalServices = selectedCompany.additionalServices
    }

    onNext(nextData)
  }

  const updateFormData = (data: any) => {
    // Update the form data in the parent component
    // You'll need to adjust this based on how your parent component handles form data
    console.log("Updating form data with:", data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50/50 relative">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* Company Type Tabs - Mobile Friendly */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-900">Firma Türü</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowInfoAlert(true)}
                className="h-8 w-8"
              >
                <Info className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                  companyType === "registered"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border hover:bg-gray-50",
                )}
                onClick={() => setCompanyType("registered")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Kayıtlı Firmalar
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                  companyType === "preregistered"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border hover:bg-gray-50",
                )}
                onClick={() => setCompanyType("preregistered")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Önkayıtlı Firmalar
              </button>
            </div>
          </div>

          {/* Company Search */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Firma adı veya vergi no ile ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 pl-10 bg-white"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {searchTerm && filteredCompanies.length > 0 && (
              <div className="bg-white border rounded-lg shadow-sm max-h-60 overflow-auto">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCompanySelect(company)}
                  >
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-gray-500">Vergi No: {company.vergiNo}</p>
                    <p className="text-sm text-gray-500">{company.address}</p>
                    {company.type === "preregistered" && (
                      <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Ön Kayıtlı
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedCompany && (
              <div className="bg-white p-3 rounded-lg border relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveCompany}
                  className="absolute right-2 top-2 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="font-medium pr-8">{selectedCompany.name}</p>
                <p className="text-sm text-gray-500">Vergi No: {selectedCompany.vergiNo}</p>
                <p className="text-sm text-gray-500">{selectedCompany.address}</p>

                {selectedCompany.type === "preregistered" && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-blue-700">
                      Seçilen Sözleşme Tipi:{" "}
                      {selectedCompany.sozlesmeTipi === "gecici" ? "Geçici İş İlişkisi" : "Danışmanlık"}
                    </p>

                    {selectedCompany.selectedProfessionCodes && selectedCompany.selectedProfessionCodes.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {selectedCompany.selectedProfessionCodes.map((code: any, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {code.code} - {code.name.substring(0, 15)}
                            {code.name.length > 15 ? "..." : ""} ({code.count})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Pre-registration Button - Only show if no company is selected */}
      {companyType === "preregistered" && !selectedPreRegisteredCompany && (
        <div className="px-4 pb-4">
          <Button
            type="button"
            onClick={() => setShowPreRegForm(true)}
            className="w-full h-11 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ön Kayıt Linki Gönder
          </Button>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="p-4 bg-white border-t mt-auto">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
            Geri
          </Button>
          <Button
            type="submit"
            disabled={!selectedCompany}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Devam Et
          </Button>
        </div>
      </div>

      {/* Pre-registration Form - Slide up from bottom */}
      {showPreRegForm && (
        <div
          className="absolute inset-x-0 bottom-0 bg-white border-t rounded-t-3xl z-50 shadow-lg"
          style={{
            transform: "translateY(0)",
            transition: "transform 0.3s ease-in-out",
            maxHeight: "80vh",
            animation: "slideUp 0.3s ease-in-out",
          }}
        >
          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ön Kayıt Formu</h3>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPreRegForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="p-4" style={{ maxHeight: "calc(80vh - 130px)" }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preRegCompanyName">Firma Adı</Label>
                <Input
                  id="preRegCompanyName"
                  value={preRegForm.companyName}
                  onChange={(e) => setPreRegForm((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preRegContactName">Yetkili Adı</Label>
                <Input
                  id="preRegContactName"
                  value={preRegForm.contactName}
                  onChange={(e) => setPreRegForm((prev) => ({ ...prev, contactName: e.target.value }))}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preRegEmail">E-posta</Label>
                <Input
                  id="preRegEmail"
                  type="email"
                  value={preRegForm.email}
                  onChange={(e) => setPreRegForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preRegPhone">Telefon</Label>
                <Input
                  id="preRegPhone"
                  value={preRegForm.phone}
                  onChange={(e) => setPreRegForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              type="button"
              onClick={handlePreRegSubmit}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!Object.values(preRegForm).every(Boolean)}
            >
              <Send className="h-5 w-5 mr-2" />
              Ön Kayıt Linki Gönder
            </Button>
          </div>
        </div>
      )}

      {/* Info Alert */}
      <IOSAlert
        isOpen={showInfoAlert}
        onClose={() => setShowInfoAlert(false)}
        onConfirm={() => setShowInfoAlert(false)}
        title="Firma Türleri Hakkında"
        message={
          <div className="space-y-3 text-sm">
            <p>
              <strong>Normal Kayıtlı Firmalar:</strong> Sistemde kayıtlı olan ve aktif çalışan firmalar.
            </p>
            <p>
              <strong>Önkayıtlı Firmalar:</strong> Ön kayıt formunu doldurmuş, sözleşme sürecindeki firmalar.
            </p>
          </div>
        }
        confirmText="Tamam"
      />

      {/* Toasts */}
      <IOSToast
        open={showSendingToast}
        onOpenChange={setShowSendingToast}
        title="Gönderiliyor"
        description="Ön kayıt linki gönderiliyor..."
        loading={true}
      />

      <IOSToast
        open={showSuccessToast}
        onOpenChange={setShowSuccessToast}
        title="Başarılı"
        description="Ön kayıt linki başarıyla gönderildi."
        variant="success"
      />
    </form>
  )
}

