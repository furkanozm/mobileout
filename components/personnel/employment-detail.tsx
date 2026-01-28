"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "./sidebar"
import { Card } from "@/components/ui/card"
import { Building2, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentPreviewModal } from "./document-preview-modal"

interface EmploymentDetailProps {
  onNavigate: (route: string) => void
}

export function EmploymentDetail({ onNavigate }: EmploymentDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)

  // Mock data for the current employment
  const employment = {
    id: 1,
    company: "TechCorp A.Ş.",
    startDate: "01.03.2022",
    endDate: null,
    project: "Web Geliştirme",
    projectGroup: "Frontend Ekibi",
    documents: [
      {
        id: "1",
        name: "İşe Giriş Bildirgesi",
        type: "Bildirgeler",
        status: "valid",
        validity: "Süresiz",
      },
    ],
  }

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <Header
        title="İş Detayı"
        onMenuClick={() => setIsSidebarOpen(true)}
        showBackButton
        onBackClick={() => onNavigate("employment-history")}
      />

      <main className="flex-1 p-4">
        <Card className="mb-4 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">{employment.company}</h2>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Başlangıç: {employment.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Bitiş: {employment.endDate || "D.Ediyor"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Proje: {employment.project}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Proje Grubu: {employment.projectGroup}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Bildirgeler</h3>
          <div className="space-y-3">
            {employment.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>{doc.name}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowDocumentPreview(true)}
                >
                  Görüntüle
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {showDocumentPreview && (
        <DocumentPreviewModal
          isOpen={showDocumentPreview}
          onClose={() => setShowDocumentPreview(false)}
          document={employment.documents[0]}
          onDownload={() => {}}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={onNavigate} />
    </div>
  )
}

