"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps {
  onSwitchToLogin: () => void
  isPersonnelLogin: boolean
}

const INDUSTRY_OPTIONS = ["Üretim", "Hizmet", "Teknoloji", "Perakende", "İnşaat", "Lojistik", "Diğer"]

const EMPLOYEE_COUNT_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]

export function RegisterForm({ onSwitchToLogin, isPersonnelLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    tcno: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    employeeCount: "",
    contactName: "",
    title: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Kayıt talebi gönderiliyor:", formData)
    // Burada kayıt işlemi gerçekleştirilecek
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!isPersonnelLogin) {
    return (
      <div className="text-center space-y-4">
        <p>Firma kaydı için lütfen bizimle iletişime geçin.</p>
        <Button onClick={onSwitchToLogin}>Giriş Ekranına Dön</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Ad Soyad</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tcno">TC Kimlik No</Label>
        <Input
          id="tcno"
          name="tcno"
          value={formData.tcno}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre (Tekrar)</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="bg-white focus:bg-white"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Kayıt Ol
      </Button>

      <div className="text-center mt-4">
        <Button variant="link" onClick={onSwitchToLogin}>
          Zaten hesabınız var mı? Giriş yapın
        </Button>
      </div>
    </form>
  )
}

