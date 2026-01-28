"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onExit: () => void
}

export function SidebarMenu({ isOpen, onClose, onExit }: SidebarMenuProps) {
  return (
    <>
      <div
        className={`absolute inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menü</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
              Ana Sayfa
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
              Puantaj Listesi
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={onExit}>
              Çıkış Yap
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Overlay */}
      {isOpen && <div className="absolute inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}
    </>
  )
}

