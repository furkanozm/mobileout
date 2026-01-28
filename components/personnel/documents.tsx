"use client"

import { useState } from "react"
import { FileText, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sidebar } from "./sidebar"
import { DocumentPreviewModal } from "./document-preview-modal"
import { FloatingDownloadButton } from "./floating-download-button"
import { useToast } from "@/components/ui/use-toast"

interface Employment {
  id: string
  company: string
  startDate: string
  endDate: string | null
  documents: Document[]
}

interface Document {
  id: string
  name: string
  type: "Kişisel Belgeler" | "Eğitim Belgeleri" | "Sağlık Belgeleri" | "Adli Belgeler" | "İş Belgeleri"
  validity: string
  status: "valid" | "invalid"
}

export function PersonnelDocuments({
  onNavigate,
  onLogout,
}: {
  onNavigate: (route: string) => void
  onLogout: () => void
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEmployments, setSelectedEmployments] = useState<Set<string>>(new Set())
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const { toast } = useToast()

  const [employments] = useState<Employment[]>([
    {
      id: "1",
      company: "TechCorp A.Ş.",
      startDate: "01.03.2022",
      endDate: null,
      documents: [
        { id: "1", name: "Kimlik Fotokopisi", type: "Kişisel Belgeler", validity: "Süresiz", status: "valid" },
        { id: "2", name: "İkametgah", type: "Kişisel Belgeler", validity: "31.12.2023", status: "valid" },
        { id: "3", name: "Sağlık Raporu", type: "Sağlık Belgeleri", validity: "15.08.2024", status: "invalid" },
        { id: "4", name: "Diploma", type: "Eğitim Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "5", name: "Sertifika - Java", type: "Eğitim Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "6", name: "İş Sözleşmesi", type: "İş Belgeleri", validity: "01.03.2023", status: "valid" },
        { id: "7", name: "Gizlilik Sözleşmesi", type: "İş Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "8", name: "Adli Sicil Kaydı", type: "Adli Belgeler", validity: "01.09.2023", status: "valid" },
      ],
    },
    {
      id: "2",
      company: "InnoSoft Ltd.",
      startDate: "15.06.2020",
      endDate: "28.02.2022",
      documents: [
        { id: "9", name: "Kimlik Fotokopisi", type: "Kişisel Belgeler", validity: "Süresiz", status: "valid" },
        { id: "10", name: "İkametgah", type: "Kişisel Belgeler", validity: "31.12.2021", status: "invalid" },
        { id: "11", name: "Sağlık Raporu", type: "Sağlık Belgeleri", validity: "30.06.2022", status: "valid" },
        { id: "12", name: "Diploma", type: "Eğitim Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "13", name: "Sertifika - Python", type: "Eğitim Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "14", name: "İş Sözleşmesi", type: "İş Belgeleri", validity: "15.06.2021", status: "valid" },
        { id: "15", name: "Gizlilik Sözleşmesi", type: "İş Belgeleri", validity: "Süresiz", status: "valid" },
        { id: "16", name: "Adli Sicil Kaydı", type: "Adli Belgeler", validity: "01.01.2022", status: "invalid" },
        { id: "17", name: "İşten Ayrılış Belgesi", type: "İş Belgeleri", validity: "28.02.2022", status: "valid" },
      ],
    },
  ])

  const groupDocumentsByType = (documents: Document[]) => {
    const groups: { [key: string]: Document[] } = {}
    documents.forEach((doc) => {
      if (!groups[doc.type]) {
        groups[doc.type] = []
      }
      groups[doc.type].push(doc)
    })
    return groups
  }

  const handleEmploymentSelect = (employmentId: string) => {
    setSelectedEmployments((prev) => {
      const next = new Set(prev)
      if (next.has(employmentId)) {
        next.delete(employmentId)
      } else {
        next.add(employmentId)
      }
      return next
    })
  }

  const handleDownloadSelected = () => {
    const selectedDocs = employments.filter((emp) => selectedEmployments.has(emp.id)).flatMap((emp) => emp.documents)

    toast({
      title: "Belgeler İndiriliyor",
      description: `${selectedDocs.length} belge indirilmeye başlandı.`,
    })
    // Simulate download delay
    setTimeout(() => {
      setSelectedEmployments(new Set())
      toast({
        title: "İndirme Tamamlandı",
        description: "Seçilen belgeler başarıyla indirildi.",
      })
    }, 2000)
  }

  const handlePreview = (document: Document) => {
    setPreviewDocument(document)
  }

  const handleDocumentDownload = () => {
    if (!previewDocument) return
    toast({
      title: "Belge İndiriliyor",
      description: `${previewDocument.name} indiriliyor...`,
    })
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "İndirme Tamamlandı",
        description: `${previewDocument.name} başarıyla indirildi.`,
      })
    }, 1500)
  }

  const isActiveEmployment = (employment: Employment) => {
    return employment.endDate === null
  }

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <h2 className="text-blue-600 font-semibold">Belgeler</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <h1 className="text-2xl font-bold my-4">Özlük Evrakları</h1>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {employments.map((employment, index) => {
            const isActive = isActiveEmployment(employment)
            return (
              <AccordionItem
                key={employment.id}
                value={employment.id}
                className={`rounded-lg shadow-sm border ${isActive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                disabled={!isActive}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer transition-all duration-200 ${
                        selectedEmployments.has(employment.id)
                          ? "bg-blue-600 text-white"
                          : isActive
                            ? "border-2 border-green-600 text-green-600"
                            : "border-2 border-red-400 text-red-500"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEmploymentSelect(employment.id)
                      }}
                    >
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex flex-col items-start flex-grow">
                      <h2 className="text-lg font-semibold">{employment.company}</h2>
                      <p className="text-sm text-gray-500">
                        {employment.startDate} - {employment.endDate || "D.Ediyor"}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    )}
                    {!isActive && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">Pasif</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  {Object.entries(groupDocumentsByType(employment.documents)).map(([type, docs]) => (
                    <div key={type} className="mb-4">
                      <h3 className="text-md font-medium mb-2">{type}</h3>
                      <div className="space-y-3">
                        {docs.map((doc, index) => (
                          <div key={doc.id} className="bg-white rounded-lg border p-3 flex items-start justify-between">
                            <div className="flex gap-3">
                              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-500">Geçerlilik: {doc.validity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.status === "valid" ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handlePreview(doc)}
                              >
                                Önizle
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </ScrollArea>

      {/* Floating Action Button - Bottom Right, Blue */}

      {/* Document Preview Modal - iOS Style Sheet */}
      {previewDocument && (
        <DocumentPreviewModal
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          document={previewDocument}
          onDownload={handleDocumentDownload}
        />
      )}

      {/* Add Document Sheet - iOS Style */}

      <FloatingDownloadButton
        onClick={handleDownloadSelected}
        selectedCount={Array.from(selectedEmployments).reduce(
          (acc, empId) => acc + employments.find((e) => e.id === empId)!.documents.length,
          0,
        )}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    </div>
  )
}

