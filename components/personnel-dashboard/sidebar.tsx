"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, Home, FileText, Building2, Users, FileCheck, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter()

  const handleNavigate = (route: string) => {
    router.push(`/${route}`)
  }

  const menuItems = [
    { icon: Home, label: "Ana Sayfa", route: "dashboard" },
    { icon: Users, label: "Personel", route: "personnel" },
    { icon: FileText, label: "Puantaj", route: "timesheet" },
    { icon: FileCheck, label: "Özlük Evrakları", route: "documents" },
    { icon: Building2, label: "Şirket", route: "company" },
    {
      icon: Settings,
      label: "Sistem Ayarları",
      route: "settings",
      subItems: [{ label: "İzin Parametreleri", route: "leave-parameters" }],
    },
  ]

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
      </div>
      <ScrollArea className="flex-grow px-2">
        <nav className="py-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.route}>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 font-normal hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigate(item.route)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>

              {item.subItems && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.route}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 font-normal text-sm hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleNavigate(subItem.route)}
                    >
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start h-11 font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  )
}

