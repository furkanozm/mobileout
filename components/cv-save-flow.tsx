"use client"

import { useState } from "react"
import { KVKKConsent } from "./kvkk-consent"
import { CVInfoForm } from "./cv-info-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { IOSPopup } from "./ios-popup"

interface CVSaveFlowProps {
  onBack: () => void
  onSaveSuccess: () => void
}

export function CVSaveFlow({ onBack, onSaveSuccess }: CVSaveFlowProps) {
  const [step, setStep] = useState<"kvkk" | "info">("kvkk")
  const [showPopup, setShowPopup] = useState(false)

  const handleKVKKAccept = () => {
    setStep("info")
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold ml-4">CV'nizi Kaydedin</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {step === "kvkk" && <KVKKConsent onAccept={handleKVKKAccept} />}
        {step === "info" && <CVInfoForm onSubmit={() => setShowPopup(true)} onSaveSuccess={onSaveSuccess} />}
      </main>
      <IOSPopup isOpen={showPopup} onClose={() => setShowPopup(false)} message="CV'niz kaydedildi" />
    </div>
  )
}

