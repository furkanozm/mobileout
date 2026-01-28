"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginFormProps {
  onLoginSuccess: (isPersonnel: boolean) => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginType, setLoginType] = useState<"firma" | "personel">("firma")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Detect login type based on username
    const isPersonnel = username === "furkan1"
    setLoginType(isPersonnel ? "personel" : "firma")

    // Simüle edilmiş giriş işlemi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if ((username === "furkan" && password === "123456") || (username === "furkan1" && password === "123456")) {
      console.log(`${isPersonnel ? "Personel" : "Firma"} girişi başarılı`)
      onLoginSuccess(isPersonnel)
    } else {
      setError("Kullanıcı adı veya şifre hatalı.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          type="text"
          placeholder="Kullanıcı adınızı girin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-white focus:bg-white !bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          placeholder="Şifrenizi girin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white focus:bg-white !bg-white"
        />
      </div>
      <div className="relative">
        <Button
          type="submit"
          className={`w-full ${loginType === "personel" ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"} h-12 transition-all duration-500 ease-in-out ${isLoading ? "pl-12" : ""}`}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin absolute left-4" />}
          {isLoading
            ? loginType === "personel"
              ? "Personel Girişi Yapılıyor..."
              : "Firma Girişi Yapılıyor..."
            : "Giriş Yap"}
        </Button>
      </div>
    </form>
  )
}

