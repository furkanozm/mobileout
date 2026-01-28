"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Globe, Loader2, Wand2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { IOSAlert } from "@/components/ui/ios-alert"

interface TwoFactorAuthProps {
  onSuccess: () => void
  onBack: () => void
}

export function TwoFactorAuth({ onSuccess, onBack }: TwoFactorAuthProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const [showTrustDeviceAlert, setShowTrustDeviceAlert] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple digits

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const fullCode = code.join("")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (fullCode === "123456") {
      setShowTrustDeviceAlert(true)
    } else {
      setError("Doğrulama kodu hatalı.")
      setIsLoading(false)
    }
  }

  const handleTrustDevice = () => {
    localStorage.setItem("isTrustedDevice", "true")
    localStorage.setItem("isSecureDeviceEnabled", "true")
    onSuccess()
  }

  const handleAutofill = () => {
    const autofillCode = "123456"
    setCode(autofillCode.split(""))
    toast({
      title: "SMS Alındı",
      description: "Doğrulama kodu otomatik olarak dolduruldu.",
      duration: 3000,
    })
  }

  return (
    <div className="h-full flex flex-col bg-[#EFF6FF]">
      <header className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-100">
        <Button variant="ghost" size="sm" onClick={onBack}>
          Geri
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-grow flex flex-col items-center px-6 pt-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">İki Faktörlü Doğrulama</h1>
            <p className="text-sm text-muted-foreground">
              Lütfen kimlik doğrulayıcı uygulamanızdaki 6 haneli kodu girin
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={inputRefs[index]}
                    className="w-10 h-12 text-center text-lg font-medium p-0"
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Kod yenileniyor</span>
                  <span>{timeLeft} saniye</span>
                </div>
                <Progress value={(timeLeft / 15) * 100} className="bg-blue-200 [&>[role=progressbar]]:bg-blue-500" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={code.some((digit) => digit === "") || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Doğrulanıyor
                </>
              ) : (
                "Doğrula"
              )}
            </Button>
          </form>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleAutofill} disabled={isLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              Otomatik Doldur
            </Button>
          </div>
        </div>
      </main>
      <IOSAlert
        isOpen={showTrustDeviceAlert}
        onClose={() => {
          setShowTrustDeviceAlert(false)
          onSuccess()
        }}
        onConfirm={handleTrustDevice}
        title="Güvenli Cihaz"
        message="Bu telefonda ilk kez giriş yapıyorsunuz. Bu telefon güvenli telefon olarak kayıt edilsin mi?"
        confirmText="Evet"
        cancelText="Hayır"
      />
    </div>
  )
}

