"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Building2, ShieldCheck, Eye, EyeOff, Lock, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileScreenProps {
  onLogout?: () => void
  onTabChange?: (tab: string) => void
  onBack?: () => void
  onMenuClick?: () => void
  setActiveScreen?: (screen: string) => void
}

export function ProfileScreen({ onLogout, onTabChange, onBack, onMenuClick, setActiveScreen }: ProfileScreenProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false)
  const [isSecureDeviceEnabled, setIsSecureDeviceEnabled] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isKvkkEnabled, setIsKvkkEnabled] = useState(true)
  const [twoFactorMethod, setTwoFactorMethod] = useState<"sms" | "email">("email")
  const [phoneNumber, setPhoneNumber] = useState("+90 5XX XXX XX XX")
  const [email, setEmail] = useState("ornek@sirket.com")

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const secureDeviceSetting = localStorage.getItem("isSecureDeviceEnabled")
    const isTrustedDevice = localStorage.getItem("isTrustedDevice")
    const shouldEnableSecureDevice = secureDeviceSetting === "true" || isTrustedDevice === "true"
    setIsSecureDeviceEnabled(shouldEnableSecureDevice || true)

    if (shouldEnableSecureDevice) {
      setIsTwoFactorEnabled(false)
    }
  }, [])

  const handleSecureDeviceToggle = (checked: boolean) => {
    setIsSecureDeviceEnabled(checked)
    localStorage.setItem("isSecureDeviceEnabled", checked.toString())
    localStorage.setItem("isTrustedDevice", checked.toString())
    if (checked) {
      setIsTwoFactorEnabled(false)
    }
  }

  const handleTwoFactorToggle = (checked: boolean) => {
    setIsTwoFactorEnabled(checked)
    if (checked) {
      setIsSecureDeviceEnabled(false)
      localStorage.setItem("isSecureDeviceEnabled", "false")
      localStorage.setItem("isTrustedDevice", "false")
    }
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive",
      })
      return
    }

    console.log("Password change requested:", passwordForm)
    toast({
      title: "Başarılı",
      description: "Şifreniz başarıyla değiştirildi.",
    })
    setIsChangingPassword(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handlePhoneChange = () => {
    const newPhone = prompt("Yeni telefon numaranızı girin:", phoneNumber)
    if (newPhone) {
      setPhoneNumber(newPhone)
      toast({
        title: "Telefon Numarası Güncellendi",
        description: "Yeni telefon numaranız kaydedildi.",
      })
    }
  }

  const handleEmailChange = () => {
    const newEmail = prompt("Yeni e-posta adresinizi girin:", email)
    if (newEmail) {
      setEmail(newEmail)
      toast({
        title: "E-posta Adresi Güncellendi",
        description: "Yeni e-posta adresiniz kaydedildi.",
      })
    }
  }

  const handleBackClick = () => {
    if (onBack) {
      onBack()
      return
    }

    if (setActiveScreen) {
      setActiveScreen("home")
      return
    }

    if (onTabChange) {
      onTabChange("home")
      return
    }

    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <Header
        title="Hesabım"
        onMenuClick={onMenuClick}
        showBackButton={true}
        onBackClick={handleBackClick}
        showLogo={true}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Company Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-base font-medium">
              <Building2 className="w-5 h-5" />
              Firma Bilgileri
            </div>
            <div className="text-gray-600">Polen</div>
          </div>
        </div>

        {/* Change Password */}
        {isChangingPassword ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3 mb-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Mevcut Şifre"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Yeni Şifre"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Yeni Şifre (Tekrar)"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Değiştir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }}
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <button
            className="w-full bg-blue-800 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center mb-4"
            onClick={() => setIsChangingPassword(true)}
          >
            <Lock className="w-3.5 h-3.5 mr-2" />
            Şifre Değiştir
          </button>
        )}

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-base font-medium">
            <ShieldCheck className="w-5 h-5" />
            Güvenli Giriş Ayarları
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Güvenli Cihaz</span>
              <Switch checked={isSecureDeviceEnabled} onCheckedChange={handleSecureDeviceToggle} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">İki Faktörlü Kimlik Doğrulama</span>
              <Switch
                checked={isTwoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
                disabled={isSecureDeviceEnabled}
              />
            </div>

            {isTwoFactorEnabled && !isSecureDeviceEnabled && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mt-4">
                  <label htmlFor="two-factor-method" className="font-medium text-sm">
                    Doğrulama Yöntemi
                  </label>
                  <Select value={twoFactorMethod} onValueChange={(value: "sms" | "email") => setTwoFactorMethod(value)}>
                    <SelectTrigger id="two-factor-method" className="w-[180px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">E-posta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KVKK Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-base font-medium">
            <Lock className="w-5 h-5" />
            KVKK Önlemi
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">KVKK Koruması</span>
              <Switch checked={isKvkkEnabled} onCheckedChange={setIsKvkkEnabled} />
            </div>
          </div>
        </div>

        {/* Çıkış Yap Butonu */}
        <div className="mt-6">
          <button
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center"
            onClick={() => {
              // Kullanıcı çıkış işlemleri
              localStorage.removeItem("authToken")
              localStorage.removeItem("isTrustedDevice")
              onLogout?.()
            }}
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}

