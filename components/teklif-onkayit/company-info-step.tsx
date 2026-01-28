"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormCard } from "./form-card"
import { MOCK_PRE_REGISTERED_COMPANIES } from "../teklif/mock-pre-registered-companies"
import { Search, X } from "lucide-react"

interface CompanyInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
}

export function CompanyInfoStep({ formData, updateFormData }: CompanyInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [filteredCompanies, setFilteredCompanies] = useState(MOCK_PRE_REGISTERED_COMPANIES)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 0) {
      setShowSearchResults(true)
      setFilteredCompanies(
        MOCK_PRE_REGISTERED_COMPANIES.filter((company) => company.name.toLowerCase().includes(value.toLowerCase())),
      )
    } else {
      setShowSearchResults(false)
      setFilteredCompanies(MOCK_PRE_REGISTERED_COMPANIES)
    }
  }

  const handleSelectCompany = (company: any) => {
    // Set company info
    updateFormData({
      companyName: company.name,
      taxId: company.taxId || "",
      taxOffice: company.taxOffice || "",
      address: company.address || "",
      city: company.city || "",
      district: company.district || "",
      isPreRegistered: true,
      selectedPreRegisteredCompany: company.id,
    })

    // Set service duration dates automatically
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1) // Add 1 year

    // Format dates as YYYY-MM-DD for input fields
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }

    updateFormData({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    })

    setSearchTerm("")
    setShowSearchResults(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setShowSearchResults(false)
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center border rounded-lg overflow-hidden bg-white">
          <div className="pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Kayıtlı firma ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {searchTerm && (
            <button type="button" onClick={clearSearch} className="pr-3 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {showSearchResults && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectCompany(company)}
                >
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-gray-500">{company.taxId && `Vergi No: ${company.taxId}`}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">Sonuç bulunamadı</div>
            )}
          </div>
        )}
      </div>

      <FormCard title={<div className="border-b pb-2 mb-4 font-semibold">Firma Bilgileri</div>}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Firma Adı <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              className={`${errors.companyName ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Firma adını giriniz"
            />
            {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">
              Vergi Numarası <span className="text-red-500">*</span>
            </Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.taxId || ""}
              onChange={handleChange}
              className={`${errors.taxId ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Vergi numarasını giriniz"
            />
            {errors.taxId && <p className="text-red-500 text-xs">{errors.taxId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxOffice">
              Vergi Dairesi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="taxOffice"
              name="taxOffice"
              value={formData.taxOffice || ""}
              onChange={handleChange}
              className={`${errors.taxOffice ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Vergi dairesini giriniz"
            />
            {errors.taxOffice && <p className="text-red-500 text-xs">{errors.taxOffice}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Adres <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className={`${errors.address ? "border-red-500" : ""} text-sm h-10`}
              placeholder="Firma adresini giriniz"
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                İl <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className={`${errors.city ? "border-red-500" : ""} text-sm h-10`}
                placeholder="İl giriniz"
              />
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">
                İlçe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="district"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                className={`${errors.district ? "border-red-500" : ""} text-sm h-10`}
                placeholder="İlçe giriniz"
              />
              {errors.district && <p className="text-red-500 text-xs">{errors.district}</p>}
            </div>
          </div>
        </div>
      </FormCard>
    </div>
  )
}

