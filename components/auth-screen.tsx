"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Globe, ClipboardList } from "lucide-react"
import { CVSaveFlow } from "./cv-save-flow"
import { CVUploadFlow } from "./cv-upload-flow"
import { TwoFactorAuth } from "./two-factor-auth"
import { TeklifOnkayitFlow } from "./teklif-onkayit/teklif-onkayit-flow"
import { Badge } from "@/components/ui/badge"
import { IOSMessageScreen } from "./teklif-onkayit/ios-message-screen"

interface AuthScreenProps {
  onLoginSuccess: (isPersonnel: boolean) => void
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isCVSave, setIsCVSave] = useState(false)
  const [isCVUpload, setIsCVUpload] = useState(false)
  const [isTeklifOnkayit, setIsTeklifOnkayit] = useState(false)
  const [showIOSMessage, setShowIOSMessage] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const handleLoginSuccess = (isPersonnel: boolean) => {
    if (!isPersonnel) {
      const isTrustedDevice = localStorage.getItem("isTrustedDevice") === "true"
      if (isTrustedDevice) {
        onLoginSuccess(false)
      } else {
        setShowTwoFactor(true)
      }
    } else {
      onLoginSuccess(true)
    }
  }

  const handleTwoFactorSuccess = () => {
    onLoginSuccess(false)
  }

  if (isCVSave) {
    return (
      <CVSaveFlow
        onBack={() => setIsCVSave(false)}
        onSaveSuccess={() => {
          setIsCVSave(false)
          setIsLogin(true)
        }}
      />
    )
  }

  if (isCVUpload) {
    return (
      <CVUploadFlow
        onBack={() => setIsCVUpload(false)}
        onSaveSuccess={() => {
          setIsCVUpload(false)
          setIsLogin(true)
        }}
      />
    )
  }

  if (showIOSMessage) {
    return (
      <IOSMessageScreen
        onBack={() => setShowIOSMessage(false)}
        onLinkClick={() => {
          setShowIOSMessage(false)
          setIsTeklifOnkayit(true)
        }}
      />
    )
  }

  if (isTeklifOnkayit) {
    return (
      <TeklifOnkayitFlow
        onBack={() => setIsTeklifOnkayit(false)}
        onSaveSuccess={() => {
          setIsTeklifOnkayit(false)
          setIsLogin(true)
        }}
      />
    )
  }

  if (showTwoFactor) {
    return <TwoFactorAuth onSuccess={handleTwoFactorSuccess} onBack={() => setShowTwoFactor(false)} />
  }

  return (
    <div className="h-full flex flex-col bg-[#EFF6FF] overflow-hidden">
      <div className="flex-grow flex flex-col justify-between px-6 py-8 h-full">
        {/* Üst kısım */}
        <div className="flex flex-col items-center">
          <Globe className="w-16 h-16 text-blue-600 mb-2" />
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">OutsourceHub</h1>
          <h2 className="text-xl font-semibold text-center text-blue-800 mb-6">
            {isLogin ? "Firma Girişi" : "Firma Kaydı"}
          </h2>
        </div>

        {/* Orta kısım */}
        <div className="flex-grow">
          {isLogin ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Alt kısım */}
        <div className="mt-6">
          <button
            className="w-full bg-blue-100 text-blue-700 border-2 border-blue-600 py-2 px-4 rounded-lg flex items-center justify-center text-sm font-bold relative"
            onClick={() => setShowIOSMessage(true)}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            DEMO
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">Demo</Badge>
          </button>
        </div>
      </div>
    </div>
  )
}

