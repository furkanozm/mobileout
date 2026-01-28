"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KVKKConsentProps {
  onAccept: () => void
}

export function KVKKConsent({ onAccept }: KVKKConsentProps) {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">KVKK Aydınlatma Metni</h2>
      <ScrollArea className="h-64 border rounded-md p-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl
          nunc egestas nunc, vitae tincidunt nisl nunc euismod nunc. Sed euismod, nisi vel consectetur interdum, nisl
          nunc egestas nunc, vitae tincidunt nisl nunc euismod nunc.
        </p>
        {/* KVKK metninin geri kalanı buraya eklenecek */}
      </ScrollArea>
      <div className="flex items-center space-x-2">
        <Checkbox id="kvkk" checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked === true)} />
        <label
          htmlFor="kvkk"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          KVKK metnini okudum ve kabul ediyorum
        </label>
      </div>
      <Button onClick={onAccept} disabled={!isChecked} className="w-full">
        Devam Et
      </Button>
    </div>
  )
}

