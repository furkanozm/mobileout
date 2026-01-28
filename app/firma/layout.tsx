import type React from "react"
import { CompanySidebar } from "@/components/company-sidebar"

export default function FirmaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <CompanySidebar onNavigate={(route) => console.log(`Navigate to: ${route}`)} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

