"use client"

import { MapPin, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  location: {
    title: string
    subtitle: string
  }
}

export function MapModal({ isOpen, onClose, location }: MapModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <SheetTitle>Lokasyon</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-4">
            <div className="mb-4">
              <h3 className="font-semibold">{location.title}</h3>
              <p className="text-sm text-muted-foreground">{location.subtitle}</p>
            </div>

            <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fBUGdp5cAzfDqZ1c54Ymw2BbpotFCd.png"
                alt="Location Map"
                fill
                className="object-cover"
              />
              <Button
                className="absolute bottom-4 right-4 gap-2"
                onClick={() => window.open("https://maps.google.com", "_blank")}
              >
                <MapPin className="h-4 w-4" />
                Konuma Git
              </Button>
            </div>
          </div>

          <div className="border-t p-4">
            <Button variant="default" className="w-full" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

