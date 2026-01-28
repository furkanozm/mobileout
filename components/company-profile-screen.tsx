"use client"

import { useState } from "react"
import { Globe, ChevronRight, Lock, Shield, FileText, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Header } from "./header"

interface CompanyProfileScreenProps {
  onNavigate?: (route: string) => void
  onLogout?: () => void
  onMenuClick?: () => void
}

export function CompanyProfileScreen({ onNavigate, onLogout, onMenuClick }: CompanyProfileScreenProps) {
  const [secureDevice, setSecureDevice] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [kvkkProtection, setKvkkProtection] = useState(false)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title={
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span>OutsourceHub</span>
          </div>
        }
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-safe">
        {/* Firma Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm">
          <button className="w-full p-4 flex items-center justify-between" onClick={() => onNavigate?.("company-info")}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>Firma Bilgileri</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm">Polen</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Şifre Değiştir */}
        <div className="bg-white rounded-lg shadow-sm">
          <button className="w-full p-4 text-center font-medium" onClick={() => onNavigate?.("change-password")}>
            Şifre Değiştir
          </button>
        </div>

        {/* Güvenli Giriş Ayarları */}
        <div className="bg-white rounded-lg shadow-sm space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Güvenli Giriş Ayarları</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Güvenli Cihaz</span>
              <Switch checked={secureDevice} onCheckedChange={setSecureDevice} />
            </div>

            <div className="flex items-center justify-between">
              <span>İki Faktörlü Kimlik Doğrulama</span>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </div>
        </div>

        {/* KVKK Önlemi */}
        <div className="bg-white rounded-lg shadow-sm space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="font-medium">KVKK Önlemi</span>
          </div>

          <div className="flex items-center justify-between">
            <span>KVKK Koruması</span>
            <Switch checked={kvkkProtection} onCheckedChange={setKvkkProtection} />
          </div>
        </div>

        {/* Çıkış Yap Butonu */}
        <div className="mt-auto">
          <Button variant="destructive" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </main>
    </div>
  )
}

