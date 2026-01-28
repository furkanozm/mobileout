"use client"

import { useState } from "react"
import { StatusBar } from "./components/status-bar"
import { AuthScreen } from "./components/auth-screen"
import { HomeScreen } from "./components/home-screen"
import { SearchScreen } from "./components/search-screen"
import { ProfileScreen } from "./components/profile-screen"
import { CompanyBottomNav } from "./components/company-bottom-nav"
import { PersonnelBottomNav } from "./components/personnel-bottom-nav"
import { TimesheetApproval } from "./components/timesheet-approval/timesheet-approval"
import { ApprovalNotification } from "./components/timesheet-approval/approval-notification"
import { PersonnelRequestScreen } from "./components/personnel-request-screen"
import { Home as PersonnelHome } from "./components/personnel/home"
import { Profile } from "./components/personnel/profile"
import { PersonnelDocuments } from "./components/personnel/documents"
import { Payrolls } from "./components/personnel/payrolls"
import { PayrollDetail } from "./components/personnel/payroll-detail"
import { Leaves } from "./components/personnel/leaves"
import { EmploymentHistory } from "./components/personnel/employment-history"
import { EmploymentDetail } from "./components/personnel/employment-detail"
import { Sidebar } from "./components/personnel/sidebar"
import { OzlukEvraklariScreen } from "./components/ozluk-evraklari-screen"
import { Button } from "@/components/ui/button"
import {
  Download,
  HomeIcon,
  FileText,
  Clock,
  LogOut,
  CalendarClock,
  Settings,
  HelpCircle,
  Users,
  ShoppingCart,
  FileCheck,
} from "lucide-react"
import { TeklifStep2Form } from "./components/teklif/teklif-step2-form"
import { LeaveParametersScreen } from "./components/leave-parameters/leave-parameters-screen"

type Route =
  | "auth"
  | "home"
  | "search"
  | "profile"
  | "timesheet"
  | "personnel-request"
  | "personnel-dashboard"
  | "documents"
  | "payrolls"
  | "payroll-detail"
  | "leaves"
  | "employment-history"
  | "employment-detail"
  | "ozluk-evraklari"
  | "teklif-step2"
  | "leave-parameters"

interface PayrollItem {
  id: number
  month: string
  year: number
  amount: number
  missingDays: number
  grossSalary: number
  netSalary: number
  incomeTax: number
  socialSecurityPremium: number
  isCurrentPeriod: boolean
}

export default function MobileApp() {
  const [currentRoute, setCurrentRoute] = useState<Route>("auth")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<"approved" | "rejected">("approved")
  const [isPersonnelLoggedIn, setIsPersonnelLoggedIn] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null)
  const [selectedEmploymentId, setSelectedEmploymentId] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedDocCount, setSelectedDocCount] = useState(0)

  const handleLoginSuccess = (isPersonnel: boolean) => {
    if (isPersonnel) {
      setCurrentRoute("personnel-dashboard")
      setIsPersonnelLoggedIn(true)
    } else {
      setCurrentRoute("home")
      setIsPersonnelLoggedIn(false)
    }
  }

  const handleLogout = () => {
    setCurrentRoute("auth")
    setIsPersonnelLoggedIn(false)
  }

  const handleTabChange = (tab: string) => {
    if (tab.startsWith("employment-detail/")) {
      const id = Number.parseInt(tab.split("/")[1], 10)
      setSelectedEmploymentId(id)
      setCurrentRoute("employment-detail")
    } else {
      setCurrentRoute(tab as Route)
    }
  }

  const handleApprovalAction = (type: "approved" | "rejected") => {
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 1000)
  }

  const handleSelectPayroll = (payroll: PayrollItem) => {
    if (payroll.isCurrentPeriod) {
      setSelectedPayroll(payroll)
      setCurrentRoute("payroll-detail")
    }
  }

  const handleBackToPayrolls = () => {
    setSelectedPayroll(null)
    setCurrentRoute("payrolls")
  }

  const renderScreen = () => {
    const commonProps = {
      onNavigate: handleTabChange,
      onMenuClick: () => setIsSidebarOpen(true),
    }

    switch (currentRoute) {
      case "auth":
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />
      case "home":
        return isPersonnelLoggedIn ? (
          <PersonnelHome {...commonProps} />
        ) : (
          <HomeScreen onLogout={handleLogout} onTabChange={handleTabChange} />
        )
      case "search":
        return <SearchScreen onTabChange={handleTabChange} />
      case "profile":
        return isPersonnelLoggedIn ? (
          <Profile {...commonProps} onLogout={handleLogout} />
        ) : (
          <ProfileScreen
            onLogout={handleLogout}
            onTabChange={handleTabChange}
            onBack={() => setCurrentRoute("home")}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        )
      case "documents":
        return isPersonnelLoggedIn ? (
          <PersonnelDocuments {...commonProps} onLogout={handleLogout} />
        ) : (
          <OzlukEvraklariScreen
            onNavigate={(route) => setCurrentRoute(route as Route)}
            onSelectedDocsChange={setSelectedDocCount}
          />
        )
      case "payrolls":
        return isPersonnelLoggedIn ? <Payrolls {...commonProps} onSelectPayroll={handleSelectPayroll} /> : null
      case "payroll-detail":
        return isPersonnelLoggedIn && selectedPayroll ? (
          <PayrollDetail payroll={selectedPayroll} onBack={handleBackToPayrolls} {...commonProps} />
        ) : null
      case "leaves":
        return isPersonnelLoggedIn ? <Leaves {...commonProps} /> : null
      case "employment-history":
        return isPersonnelLoggedIn ? <EmploymentHistory {...commonProps} /> : null
      case "employment-detail":
        return isPersonnelLoggedIn && selectedEmploymentId ? (
          <EmploymentDetail employmentId={selectedEmploymentId} {...commonProps} />
        ) : null
      case "timesheet":
        return <TimesheetApproval onBack={() => setCurrentRoute("home")} onApprovalAction={handleApprovalAction} />
      case "personnel-request":
        return <PersonnelRequestScreen onBack={() => setCurrentRoute("home")} />
      case "personnel-dashboard":
        return <PersonnelHome {...commonProps} />
      case "ozluk-evraklari":
        return (
          <OzlukEvraklariScreen
            onNavigate={(route) => setCurrentRoute(route as Route)}
            onSelectedDocsChange={setSelectedDocCount}
          />
        )
      case "teklif-step2":
        return (
          <TeklifStep2Form
            onBack={() => setCurrentRoute("home")}
            onNext={() => setCurrentRoute("home")}
            isPreRegistered={true}
            companyName="ABC Şirketi"
            contractType="gecici_is_iliskisi"
          />
        )
      case "leave-parameters":
        return <LeaveParametersScreen onBack={() => setCurrentRoute("home")} />
      default:
        return <HomeScreen onLogout={handleLogout} onTabChange={handleTabChange} />
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[60px] overflow-hidden shadow-2xl border-[14px] border-black">
        {/* Power Button */}
        <div className="absolute right-[-14px] top-[120px] w-[3px] h-[80px] bg-gray-400 rounded-r-lg"></div>
        {/* Volume Up Button */}
        <div className="absolute left-[-14px] top-[100px] w-[3px] h-[40px] bg-gray-400 rounded-l-lg"></div>
        {/* Volume Down Button */}
        <div className="absolute left-[-14px] top-[150px] w-[3px] h-[40px] bg-gray-400 rounded-l-lg"></div>

        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[120px] bg-black rounded-b-[18px] z-20"></div>

        <div className="relative w-full h-full bg-[#EFF6FF] overflow-hidden">
          <StatusBar isAuthScreen={currentRoute === "auth"} />
          <div className="relative h-full pb-[80px] overflow-y-auto scrollbar-none">
            {renderScreen()}
            {currentRoute === "documents" && !isPersonnelLoggedIn && selectedDocCount > 0 && (
              <div className="absolute bottom-24 right-4 z-10">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
                  onClick={() => {
                    // Implement download logic here
                    console.log("Downloading selected documents")
                  }}
                >
                  <Download className="h-6 w-6 text-white" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {selectedDocCount}
                  </span>
                </Button>
              </div>
            )}

            {/* Personnel Sidebar */}
            {isPersonnelLoggedIn && (
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={handleTabChange}
                onLogout={handleLogout}
              />
            )}

            {/* Company Sidebar */}
            {!isPersonnelLoggedIn && isSidebarOpen && (
              <>
                <div
                  className="absolute inset-0 bg-black/50 z-[60] transition-opacity duration-300"
                  onClick={() => setIsSidebarOpen(false)}
                />
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white z-[70] transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"}`}
                  style={{
                    height: "calc(100% - 8px)", // Account for home indicator
                    top: "0px", // Start from the top
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b pt-8">
                      {" "}
                      {/* Extra padding for status bar */}
                      <h2 className="text-lg font-semibold text-blue-600">OutsourceHub</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("home")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <HomeIcon className="mr-3 h-5 w-5" />
                          Ana Sayfa
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("timesheet")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <Clock className="mr-3 h-5 w-5" />
                          Puantaj Listesi
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("personnel-request")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <Users className="mr-3 h-5 w-5" />
                          Personel Talep Et
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("documents")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <FileText className="mr-3 h-5 w-5" />
                          Özlük Evrakları
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("teklif-step2")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <FileCheck className="mr-3 h-5 w-5" />
                          Teklif
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("home") // Replace with actual route
                            setIsSidebarOpen(false)
                          }}
                        >
                          <ShoppingCart className="mr-3 h-5 w-5" />
                          Satın Alma
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("leave-parameters")
                            setIsSidebarOpen(false)
                          }}
                        >
                          <CalendarClock className="mr-3 h-5 w-5" />
                          İzin Parametreleri
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            handleTabChange("home") // Replace with actual route
                            setIsSidebarOpen(false)
                          }}
                        >
                          <Settings className="mr-3 h-5 w-5" />
                          Genel Ayarlar
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Destek ve Görev Merkezi</h3>
                        <div className="space-y-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span className="text-sm">Destek</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span className="text-sm">Görevlerim</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleLogout()
                          setIsSidebarOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Çıkış Yap
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {currentRoute !== "auth" &&
            (isPersonnelLoggedIn ? (
              <PersonnelBottomNav currentTab={currentRoute} onTabChange={handleTabChange} />
            ) : (
              <CompanyBottomNav currentTab={currentRoute} onTabChange={handleTabChange} />
            ))}
          <ApprovalNotification type={notificationType} show={showNotification} />
        </div>

        {/* iOS home indicator area - matching app background */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#EFF6FF] rounded-b-[40px]"></div>
        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-1 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  )
}

