"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  CheckCircle,
  Globe,
  HelpCircle,
  ListTodo,
  Bell,
  Users,
  FileText,
  ShoppingCart,
  CalendarClock,
  Home,
  ClipboardList,
  UserPlus,
  FileCheck,
  LogOut,
  Shield,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TimesheetApproval } from "./timesheet-approval/timesheet-approval"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PersonnelRequestScreen } from "./personnel-request-screen"
import { OzlukEvraklariScreen } from "./ozluk-evraklari-screen"
import { TeklifScreen } from "./teklif/teklif-screen"
import { SatinAlmaScreen } from "./satin-alma/satin-alma-screen"
import { IsgScreen } from "@/components/isg/isg-screen"

interface HomeScreenProps {
  onLogout: () => void
  onTabChange: (tab: string) => void
}

export function HomeScreen({ onLogout, onTabChange }: HomeScreenProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTimesheet, setShowTimesheet] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPersonnelRequest, setShowPersonnelRequest] = useState(false)
  const [showOzlukEvraklari, setShowOzlukEvraklari] = useState(false)
  const [showTeklif, setShowTeklif] = useState(false)
  const [showSatinAlma, setShowSatinAlma] = useState(false)
  const [showIsg, setShowIsg] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleNotifications = () => setShowNotifications(!showNotifications)

  const notifications = [
    { id: 1, date: "18 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
    { id: 2, date: "17 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
    { id: 3, date: "16 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
    { id: 4, date: "15 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
    { id: 5, date: "14 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
    { id: 6, date: "13 Şubat 2024", message: "Günlük puantaj onayı bekliyor" },
  ]

  if (showTimesheet) {
    return (
      <TimesheetApproval
        onBack={() => {
          setShowTimesheet(false)
          onTabChange("home")
        }}
      />
    )
  }

  if (showOzlukEvraklari) {
    return (
      <OzlukEvraklariScreen
        onBack={() => {
          setShowOzlukEvraklari(false)
          onTabChange("home")
        }}
      />
    )
  }

  if (showPersonnelRequest) {
    return (
      <PersonnelRequestScreen
        onBack={() => {
          setShowPersonnelRequest(false)
          onTabChange("home")
        }}
      />
    )
  }

  if (showTeklif) {
    return (
      <TeklifScreen
        onBack={() => {
          setShowTeklif(false)
          onTabChange("home")
        }}
      />
    )
  }

  if (showSatinAlma) {
    return (
      <SatinAlmaScreen
        onBack={() => {
          setShowSatinAlma(false)
          onTabChange("home")
        }}
      />
    )
  }

  if (showIsg) {
    return (
      <IsgScreen
        onBack={() => {
          setShowIsg(false)
          onTabChange("home")
        }}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-blue-50 relative overflow-hidden">
      <header className="flex items-center p-4 bg-white border-b z-10">
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <Globe className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-blue-600">OutsourceHub</h1>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto relative" onClick={toggleNotifications}>
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            6
          </span>
        </Button>
      </header>

      {/* Notifications Panel */}
      <div
        className={`absolute inset-y-0 right-0 w-64 bg-white transform transition-transform duration-300 ease-in-out z-30 ${
          showNotifications ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Bildirimler</h2>
          <Button variant="ghost" size="icon" onClick={toggleNotifications}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100%-64px)]">
          <div className="px-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="cursor-pointer"
                onClick={() => {
                  setShowTimesheet(true)
                  setShowNotifications(false)
                }}
              >
                <div className="py-3">
                  <h3 className="font-semibold text-sm">{notification.date}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Menu Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out z-20 flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-blue-600">Menü</h2>
            <span className="text-sm text-gray-500">Polen</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex flex-col p-4 flex-grow">
          <Button variant="ghost" className="justify-start" onClick={toggleMenu}>
            <Home className="h-5 w-5 mr-2" />
            Ana Sayfa
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowTimesheet(true)
              toggleMenu()
            }}
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Puantaj Listesi
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowPersonnelRequest(true)
              toggleMenu()
            }}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Personel Talep Et
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowOzlukEvraklari(true)
              toggleMenu()
            }}
          >
            <FileText className="h-5 w-5 mr-2" />
            Özlük Evrakları
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowTeklif(true)
              toggleMenu()
            }}
          >
            <FileCheck className="h-5 w-5 mr-2" />
            Teklif
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowSatinAlma(true)
              toggleMenu()
            }}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Satın Alma
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setShowIsg(true)
              toggleMenu()
            }}
          >
            <Shield className="h-5 w-5 mr-2" />
            İSG
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onTabChange("leave-parameters")
              toggleMenu()
            }}
          >
            <CalendarClock className="h-5 w-5 mr-2" />
            İzin Parametreleri
          </Button>
          <Button variant="ghost" className="justify-start text-red-600" onClick={onLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Çıkış Yap
          </Button>
        </nav>

        <div className="mt-auto p-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Destek ve Görev Merkezi</h3>
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Destek</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ListTodo className="h-4 w-4 mr-2" />
              <span className="text-sm">Görevlerim</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isMenuOpen || showNotifications) && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => {
            if (isMenuOpen) toggleMenu()
            if (showNotifications) toggleNotifications()
          }}
        />
      )}

      <main className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Ana Sayfa</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowTimesheet(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <CheckCircle className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">Puantaj Onayı</h3>
              <p className="text-2xl font-bold mt-2">6</p>
              <p className="text-xs text-muted-foreground">Bekleyen</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowPersonnelRequest(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <Users className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">Personel Talepleri</h3>
              <p className="text-2xl font-bold mt-2">2</p>
              <p className="text-xs text-muted-foreground">Aktif Talep</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowOzlukEvraklari(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <FileText className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">Özlük Evrakları</h3>
              <p className="text-2xl font-bold mt-2">3</p>
              <p className="text-xs text-muted-foreground">Onay Bekleyen</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowTeklif(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <FileText className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">Teklifler</h3>
              <p className="text-2xl font-bold mt-2">4</p>
              <p className="text-xs text-muted-foreground">Bekleyen Teklif</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowSatinAlma(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">Satın Alma</h3>
              <p className="text-2xl font-bold mt-2">3</p>
              <p className="text-xs text-muted-foreground">Bekleyen Talep</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setShowIsg(true)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <Shield className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-800 mb-2" />
              <h3 className="text-sm font-medium text-center">İSG</h3>
              <p className="text-2xl font-bold mt-2">5</p>
              <p className="text-xs text-muted-foreground">Bekleyen İşlem</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

