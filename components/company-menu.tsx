"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Home,
  ClipboardList,
  Users,
  FileText,
  FileCheck,
  ShoppingCart,
  LogOut,
  HelpCircle,
  CheckSquare,
  Settings,
  CalendarClock,
} from "lucide-react"

interface CompanyMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: (route: string) => void
}

export function CompanyMenu({ open, onClose, onNavigate }: CompanyMenuProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const menuItems = [
    { id: "home", label: "Ana Sayfa", icon: Home, route: "/" },
    { id: "timesheet", label: "Puantaj Listesi", icon: ClipboardList, route: "/puantaj" },
    { id: "personnel", label: "Personel Talep Et", icon: Users, route: "/personel-talep" },
    { id: "documents", label: "Özlük Evrakları", icon: FileText, route: "/ozluk-evraklari" },
    { id: "offers", label: "Teklif", icon: FileCheck, route: "/teklif" },
    { id: "purchase", label: "Satın Alma", icon: ShoppingCart, route: "/satin-alma" },
  ]

  const systemSettings = [
    { id: "leave-params", label: "İzin Parametreleri", icon: CalendarClock, route: "/izin-parametreleri" },
  ]

  const supportItems = [
    { id: "support", label: "Destek", icon: HelpCircle, route: "/destek" },
    { id: "tasks", label: "Görevlerim", icon: CheckSquare, route: "/gorevlerim" },
  ]

  const handleNavigate = (route: string) => {
    onNavigate(route)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] sm:w-[340px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menü</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-4">
            {/* Ana Menü Öğeleri */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigate(item.route)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Sistem Ayarları */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 px-3">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Sistem Ayarları</span>
              </div>
              {systemSettings.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigate(item.route)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Destek ve Görev Merkezi */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 px-3">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Destek ve Görev Merkezi</span>
              </div>
              {supportItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigate(item.route)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Çıkış Yap */}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
                onClick={() => handleNavigate("/logout")}
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

