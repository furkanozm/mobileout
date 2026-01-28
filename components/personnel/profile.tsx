"use client"

import { useState } from "react"
import { LogOut, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "./sidebar"
import { Input } from "@/components/ui/input"

interface ProfileProps {
  onNavigate?: (route: string) => void
  onLogout?: () => void
  onMenuClick?: () => void
}

export function Profile({ onNavigate, onLogout, onMenuClick }: ProfileProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "Ahmet Yılmaz",
    position: "Yazılım Geliştirici",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    department: "IT",
    startDate: "01.01.2023",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordSubmit = () => {
    // Implement password change logic here
    if (passwordForm.newPassword === passwordForm.confirmPassword) {
      setIsChangingPassword(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <h2 className="text-blue-600 font-semibold">Profil</h2>
        </div>
        <button
          onClick={onMenuClick}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2 bg-white rounded-lg shadow overflow-hidden">
          <div
            className={`transition-all duration-300 ease-in-out transform ${isChangingPassword ? "hidden opacity-0" : "opacity-100"}`}
          >
            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Ad Soyad</div>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <div className="text-sm font-medium">{formData.name}</div>
              )}
            </div>

            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Pozisyon</div>
              {isEditing ? (
                <Input
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <div className="text-sm font-medium">{formData.position}</div>
              )}
            </div>

            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">E-posta</div>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                  type="email"
                />
              ) : (
                <div className="text-sm font-medium">{formData.email}</div>
              )}
            </div>

            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Telefon</div>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                  type="tel"
                />
              ) : (
                <div className="text-sm font-medium">{formData.phone}</div>
              )}
            </div>

            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Departman</div>
              <div className="text-sm font-medium">{formData.department}</div>
            </div>

            <div className="p-3">
              <div className="text-xs text-gray-500">İşe Başlangıç Tarihi</div>
              <div className="text-sm font-medium">{formData.startDate}</div>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out transform ${!isChangingPassword ? "hidden opacity-0" : "opacity-100"}`}
          >
            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Mevcut Şifre</div>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="mt-1"
                placeholder="Mevcut şifrenizi girin"
              />
            </div>

            <div className="p-3 border-b">
              <div className="text-xs text-gray-500">Yeni Şifre</div>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="mt-1"
                placeholder="Yeni şifrenizi girin"
              />
            </div>

            <div className="p-3">
              <div className="text-xs text-gray-500">Yeni Şifre (Tekrar)</div>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="mt-1"
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
          </div>
        </div>

        {!isChangingPassword && (
          <>
            <Button
              variant="outline"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              onClick={() => setIsChangingPassword(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Şifre Değiştir
            </Button>

            <Button variant="destructive" className="w-full mt-4" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </>
        )}

        {isChangingPassword && (
          <div className="flex flex-col gap-2 mt-4">
            <Button
              className="w-full"
              onClick={handlePasswordSubmit}
              disabled={
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword ||
                passwordForm.newPassword !== passwordForm.confirmPassword
              }
            >
              Şifreyi Güncelle
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCancelPasswordChange}>
              Vazgeç
            </Button>
          </div>
        )}
      </main>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={onNavigate} />
    </div>
  )
}

