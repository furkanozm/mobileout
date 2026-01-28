"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, Home, FileText, UserCircle2, CreditCard, CalendarDays, History } from "lucide-react"
import { useEffect, useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (route: string) => void
  onLogout?: () => void
}

export function Sidebar({ isOpen, onClose, onNavigate, onLogout }: SidebarProps) {
  const [animationClass, setAnimationClass] = useState("translate-x-[-100%]")

  useEffect(() => {
    if (isOpen) {
      setAnimationClass("translate-x-0")
    } else {
      setAnimationClass("translate-x-[-100%]")
    }
  }, [isOpen])

  const menuItems = [
    { icon: Home, label: "Ana Sayfa", route: "home" },
    { icon: FileText, label: "Özlük Evrakları", route: "documents" },
    { icon: CreditCard, label: "Bordrolarım", route: "payrolls" },
    { icon: CalendarDays, label: "İzinlerim", route: "leaves" },
    { icon: History, label: "İş Geçmişim", route: "employment-history" },
    { icon: UserCircle2, label: "Profil", route: "profile" },
  ]

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route)
      onClose()
    }
  }

  if (!isOpen && animationClass === "translate-x-[-100%]") return null

  return (
    <>
      <div
        className={`absolute inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white z-[70] transition-transform duration-300 ease-out flex flex-col ${animationClass}`}
        style={{
          height: "calc(100% - 20px)", // More space for home indicator
          top: "0px",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b pt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">AY</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Ahmet Yılmaz</div>
                <div className="text-sm text-gray-500">Yazılım Geliştirici</div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.route}
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => handleNavigate(item.route)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t mt-auto mb-8">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                if (onLogout) {
                  onLogout()
                  onClose()
                }
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

