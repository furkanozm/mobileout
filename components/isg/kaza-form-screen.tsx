"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Header } from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Plus, X, Search, Image, User, Users, ArrowLeft, Check, ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Add a Personnel type
interface Personnel {
  id: number
  name: string
  position: string
  department: string
  tckn: string
}

interface Witness {
  name: string
  isEmployee: boolean
}

interface KazaFormScreenProps {
  id?: number // If provided, we're editing an existing accident
  onBack: () => void
  onSubmit: (data: any) => void
}

export function KazaFormScreen({ id, onBack, onSubmit }: KazaFormScreenProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Modal management
  const [modalScreen, setModalScreen] = useState<"main" | "photo" | "personnel" | "witness" | "camera">("main")

  const [witnesses, setWitnesses] = useState<Witness[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [witnessName, setWitnessName] = useState("")
  const [witnessType, setWitnessType] = useState<"employee" | "non-employee">("employee")
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState("")
  const [witnessSearchQuery, setWitnessSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isWitnessSearchVisible, setIsWitnessSearchVisible] = useState(false)
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [selectedWitnessPersonnel, setSelectedWitnessPersonnel] = useState<Personnel | null>(null)

  // New state for company, project group, project selection
  const [companies, setCompanies] = useState<string[]>(["ABC İnşaat", "XYZ Holding", "123 Sanayi"])
  const [projectGroups, setProjectGroups] = useState<Record<string, string[]>>({
    "ABC İnşaat": ["İstanbul Projeleri", "Ankara Projeleri", "İzmir Projeleri"],
    "XYZ Holding": ["Konut Projeleri", "AVM Projeleri", "Ofis Projeleri"],
    "123 Sanayi": ["Fabrika Projeleri", "Depo Projeleri"],
  })
  const [projects, setProjects] = useState<Record<string, string[]>>({
    "İstanbul Projeleri": ["Levent Rezidans", "Kadıköy Ofis", "Beşiktaş Konut"],
    "Ankara Projeleri": ["Çankaya Ofis", "Kızılay Rezidans"],
    "İzmir Projeleri": ["Karşıyaka Konut", "Alsancak Ofis"],
    "Konut Projeleri": ["Ataşehir Konut", "Bahçeşehir Konut"],
    "AVM Projeleri": ["Maltepe AVM", "Beylikdüzü AVM"],
    "Ofis Projeleri": ["Maslak Ofis", "Kozyatağı Ofis"],
    "Fabrika Projeleri": ["Gebze Fabrika", "Tuzla Fabrika"],
    "Depo Projeleri": ["Hadımköy Depo", "Samandıra Depo"],
  })

  // Mock personnel data
  const [personnel, setPersonnel] = useState<Personnel[]>([
    { id: 1, name: "Ahmet Yılmaz", position: "Üretim Operatörü", department: "Üretim", tckn: "12345678901" },
    { id: 2, name: "Mehmet Kaya", position: "Elektrikçi", department: "Teknik", tckn: "23456789012" },
    { id: 3, name: "Ayşe Demir", position: "Muhasebeci", department: "Finans", tckn: "34567890123" },
    { id: 4, name: "Fatma Şahin", position: "İnşaat Mühendisi", department: "Mühendislik", tckn: "45678901234" },
    { id: 5, name: "Ali Öztürk", position: "Güvenlik Görevlisi", department: "Güvenlik", tckn: "56789012345" },
    { id: 6, name: "Zeynep Kara", position: "İK Uzmanı", department: "İnsan Kaynakları", tckn: "67890123456" },
  ])

  // Form data state
  const [formData, setFormData] = useState({
    company: "",
    projectGroup: "",
    project: "",
    date: "",
    time: "",
    title: "",
    severity: "medium",
    description: "",
    location: "",
    rootCause: "",
    correctiveActions: "",
  })

  const [existingData, setExistingData] = useState(null)

  const isEditing = !!id

  // Mock data for editing
  const mockExistingData = isEditing
    ? {
        title: "Kayma Kazası",
        date: "2024-04-10",
        time: "14:30",
        location: "Üretim Alanı - Kat 2",
        severity: "medium",
        description: "Islak zeminde kayma sonucu hafif yaralanma.",
        affectedPerson: "Ahmet Yılmaz",
        position: "Üretim Operatörü",
        department: "Üretim",
        company: "ABC İnşaat",
        projectGroup: "İstanbul Projeleri",
        project: "Levent Rezidans",
        witnesses: [
          { name: "Mehmet Kaya", isEmployee: true },
          { name: "Ayşe Demir", isEmployee: true },
          { name: "Ziyaretçi Ahmet", isEmployee: false },
        ],
        rootCause: "Islak zemin uyarı levhası konulmamış",
        correctiveActions:
          "Islak zemin uyarı levhaları temin edildi\nTemizlik prosedürü güncellendi\nÇalışanlara güvenli çalışma eğitimi verildi",
        photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      }
    : null

  // Set current date and time when component mounts for new records
  useEffect(() => {
    if (!isEditing) {
      const now = new Date()
      const currentDate = now.toISOString().split("T")[0] // YYYY-MM-DD
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const currentTime = `${hours}:${minutes}`

      setFormData((prev) => ({
        ...prev,
        date: currentDate,
        time: currentTime,
      }))
    }
  }, [isEditing])

  // Initialize state with existing data if editing
  useEffect(() => {
    if (id) {
      setExistingData(mockExistingData)
      if (mockExistingData) {
        setWitnesses(mockExistingData.witnesses || [])
        setPhotos(mockExistingData.photos || [])
        setFormData({
          company: mockExistingData.company || "",
          projectGroup: mockExistingData.projectGroup || "",
          project: mockExistingData.project || "",
          date: mockExistingData.date || "",
          time: mockExistingData.time || "",
          title: mockExistingData.title || "",
          severity: mockExistingData.severity || "medium",
          description: mockExistingData.description || "",
          location: mockExistingData.location || "",
          rootCause: mockExistingData.rootCause || "",
          correctiveActions: mockExistingData.correctiveActions || "",
        })

        // Find and set the selected personnel
        const person = personnel.find((p) => p.name === mockExistingData.affectedPerson)
        if (person) {
          setSelectedPersonnel(person)
        }
      }
    }
  }, [id, personnel])

  const handleSubmit = () => {
    // Collect form data and submit
    const data = { ...formData }

    // Add witnesses and photos
    data.witnesses = witnesses
    data.photos = photos

    // Add selected personnel data if available
    if (selectedPersonnel) {
      data.affectedPerson = selectedPersonnel.name
      data.position = selectedPersonnel.position
      data.department = selectedPersonnel.department
      data.tckn = selectedPersonnel.tckn
    }

    onSubmit(data)
  }

  const addWitness = () => {
    if (witnessType === "employee" && selectedWitnessPersonnel) {
      const newWitness: Witness = {
        name: selectedWitnessPersonnel.name,
        isEmployee: true,
      }
      setWitnesses([...witnesses, newWitness])
      setSelectedWitnessPersonnel(null)
    } else if (witnessType === "non-employee" && witnessName.trim()) {
      const newWitness: Witness = {
        name: witnessName,
        isEmployee: false,
      }
      setWitnesses([...witnesses, newWitness])
      setWitnessName("")
    }
    setModalScreen("main")
  }

  const removeWitness = (index: number) => {
    setWitnesses(witnesses.filter((_, i) => i !== index))
  }

  const addPhoto = (url: string) => {
    setPhotos([...photos, url])
    setModalScreen("main")
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  // Handle form data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // Reset dependent fields when parent field changes
    if (name === "company") {
      setFormData({ ...formData, company: value, projectGroup: "", project: "" })
    } else if (name === "projectGroup") {
      setFormData({ ...formData, projectGroup: value, project: "" })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const openPersonnelModal = () => {
    setPersonnelSearchQuery("")
    setModalScreen("personnel")
  }

  const openWitnessModal = () => {
    setWitnessSearchQuery("")
    setWitnessType("employee")
    setModalScreen("witness")
  }

  const selectPersonnel = (person: Personnel) => {
    setSelectedPersonnel(person)
    setModalScreen("main")
  }

  const selectWitnessPersonnel = (person: Personnel) => {
    setSelectedWitnessPersonnel(person)
  }

  // Filter personnel based on search query
  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.department.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.position.toLowerCase().includes(personnelSearchQuery.toLowerCase()) ||
      person.tckn.includes(personnelSearchQuery),
  )

  // Filter personnel for witness selection
  const filteredWitnessPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(witnessSearchQuery.toLowerCase()) ||
      person.department.toLowerCase().includes(witnessSearchQuery.toLowerCase()) ||
      person.position.toLowerCase().includes(witnessSearchQuery.toLowerCase()) ||
      person.tckn.includes(witnessSearchQuery),
  )

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Render step bar
  const renderStepBar = () => {
    return (
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {step < currentStep ? <Check className="h-3 w-3" /> : step}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {step === 1 ? "Temel Bilgiler" : step === 2 ? "Kaza Detayları" : "Analiz & Ekler"}
                </span>
              </div>
              {step < 3 && (
                <div className={cn("w-12 h-0.5 mx-1", step < currentStep ? "bg-green-500" : "bg-gray-200")} />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1Content()
      case 2:
        return renderStep2Content()
      case 3:
        return renderStep3Content()
      default:
        return null
    }
  }

  // Step 1: Basic Information
  const renderStep1Content = () => {
    return (
      <div className="space-y-4 min-h-[calc(100vh-180px)]">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Firma ve Proje Bilgileri</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Firma</label>
                <Select
                  name="company"
                  value={formData.company}
                  onValueChange={(value) => handleSelectChange("company", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Firma seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.company && (
                <div>
                  <label className="block text-sm font-medium mb-1">Proje Grubu</label>
                  <Select
                    name="projectGroup"
                    value={formData.projectGroup}
                    onValueChange={(value) => handleSelectChange("projectGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Proje grubu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectGroups[formData.company]?.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.projectGroup && (
                <div>
                  <label className="block text-sm font-medium mb-1">Proje</label>
                  <Select
                    name="project"
                    value={formData.project}
                    onValueChange={(value) => handleSelectChange("project", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Proje seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects[formData.projectGroup]?.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Kaza Bilgileri</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kaza Başlığı</label>
                <Input
                  name="title"
                  placeholder="Kaza başlığı giriniz"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kaza Lokasyonu</label>
                <Input
                  name="location"
                  placeholder="Kaza lokasyonu giriniz"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Tarih</label>
                  <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Saat</label>
                  <Input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: Accident Details
  const renderStep2Content = () => {
    return (
      <div className="space-y-4 min-h-[calc(100vh-180px)]">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Etkilenen Kişi</h3>

            {selectedPersonnel ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <div className="font-medium">{selectedPersonnel.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedPersonnel.position} • {selectedPersonnel.department}
                    </div>
                    <div className="text-sm text-gray-500">TCKN: {selectedPersonnel.tckn}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPersonnel(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="outline" className="w-full" onClick={openPersonnelModal}>
                <User className="h-4 w-4 mr-2" />
                Personel Seç
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Tanıklar</h3>

            <div className="space-y-2">
              {witnesses.map((witness, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span>{witness.name}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {witness.isEmployee ? "Çalışan" : "Harici"}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeWitness(index)} className="text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <Button type="button" variant="outline" className="w-full border-dashed" onClick={openWitnessModal}>
                <Plus className="h-4 w-4 mr-2" />
                Tanık Ekle
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Kaza Detayları</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Risk Seviyesi</label>
                <Select
                  name="severity"
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange("severity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Risk seviyesi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Düşük Risk</SelectItem>
                    <SelectItem value="medium">Orta Risk</SelectItem>
                    <SelectItem value="high">Yüksek Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <Textarea
                  name="description"
                  placeholder="Kaza açıklaması"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 3: Analysis & Attachments
  const renderStep3Content = () => {
    return (
      <div className="space-y-4 min-h-[calc(100vh-180px)]">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Kök Neden ve Düzeltici Faaliyetler</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kök Neden</label>
                <Textarea
                  name="rootCause"
                  placeholder="Kazanın kök nedeni"
                  rows={2}
                  value={formData.rootCause}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Düzeltici Faaliyetler</label>
                <Textarea
                  name="correctiveActions"
                  placeholder="Her satıra bir faaliyet yazınız"
                  rows={4}
                  value={formData.correctiveActions}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Fotoğraflar</h3>

            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Kaza fotoğrafı ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="h-24 border-dashed flex flex-col items-center justify-center"
                onClick={() => setModalScreen("photo")}
              >
                <Camera className="h-5 w-5 mb-1" />
                <span className="text-xs">Fotoğraf Ekle</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Navigation buttons
  const renderNavigationButtons = () => {
    return (
      <div className="p-4 border-t bg-white sticky bottom-0 grid grid-cols-2 gap-3">
        {currentStep === 1 ? (
          <Button variant="outline" onClick={onBack}>
            İptal
          </Button>
        ) : (
          <Button variant="outline" onClick={goToPreviousStep}>
            Geri
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={goToNextStep}>
            İleri <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
            Tamamla
          </Button>
        )}
      </div>
    )
  }

  // Photo Modal Screen
  if (modalScreen === "photo") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setModalScreen("main")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Fotoğraf Ekle</h2>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14" onClick={() => setModalScreen("camera")}>
              <Camera className="h-5 w-5 mr-2" />
              Kamera ile Çek
            </Button>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-14"
              onClick={() => addPhoto("/placeholder.svg?height=200&width=300")}
            >
              <Image className="h-5 w-5 mr-2" />
              Galeriden Seç
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Personnel Selection Screen
  if (modalScreen === "personnel") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setModalScreen("main")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Personel Seç</h2>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(!isSearchVisible)}>
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isSearchVisible && (
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Personel ara..."
                className="pl-9"
                value={personnelSearchQuery}
                onChange={(e) => setPersonnelSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        <ScrollArea className="flex-1" scrollHideDelay={0} type="always">
          <div className="p-4 space-y-2">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((person) => (
                <div
                  key={person.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectPersonnel(person)}
                >
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-gray-500">
                    {person.position} • {person.department}
                  </div>
                  <div className="text-sm text-gray-500">TCKN: {person.tckn}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Arama kriterlerine uygun personel bulunamadı.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Witness Modal Screen
  if (modalScreen === "witness") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setModalScreen("main")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Tanık Ekle</h2>
        </div>

        <div className="p-4 flex-1">
          <RadioGroup
            value={witnessType}
            onValueChange={(value) => setWitnessType(value as "employee" | "non-employee")}
            className="mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employee" id="employee" />
              <Label htmlFor="employee">Çalışan Tanık</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-employee" id="non-employee" />
              <Label htmlFor="non-employee">Harici Tanık</Label>
            </div>
          </RadioGroup>

          {witnessType === "employee" ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Personel ara..."
                  className="pl-9"
                  value={witnessSearchQuery}
                  onChange={(e) => setWitnessSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="h-64 border rounded-md p-2 overflow-auto" scrollHideDelay={0} type="always">
                <div className="space-y-2">
                  {filteredWitnessPersonnel.length > 0 ? (
                    filteredWitnessPersonnel.map((person) => (
                      <div
                        key={person.id}
                        className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                          selectedWitnessPersonnel?.id === person.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => selectWitnessPersonnel(person)}
                      >
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-500">
                          {person.position} • {person.department}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Arama kriterlerine uygun personel bulunamadı.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Ad Soyad</label>
              <Input
                value={witnessName}
                onChange={(e) => setWitnessName(e.target.value)}
                placeholder="Tanık adı soyadı"
              />
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setModalScreen("main")}>
              İptal
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={addWitness}
              disabled={
                (witnessType === "employee" && !selectedWitnessPersonnel) ||
                (witnessType === "non-employee" && !witnessName.trim())
              }
            >
              Ekle
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Camera Simulation Screen
  if (modalScreen === "camera") {
    return (
      <div className="flex flex-col h-full bg-black">
        {/* Camera preview */}
        <div className="flex-1 relative">
          {/* Mock camera viewfinder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/placeholder.svg?height=800&width=600"
              alt="Camera preview"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Top controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setModalScreen("photo")}>
              <X className="h-6 w-6" />
            </Button>

            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white">
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
                  className="lucide lucide-flash"
                >
                  <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
                  <path d="m13 2-2 6h6l-2 6"></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-white"
              onClick={() => {
                // Simulate taking a photo
                addPhoto("/placeholder.svg?height=400&width=300")
              }}
            >
              <div className="h-14 w-14 rounded-full bg-white"></div>
            </Button>
          </div>

          {/* Right side controls */}
          <div className="absolute right-4 inset-y-0 flex flex-col justify-center gap-6">
            {/* Camera flip button */}
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black bg-opacity-50 text-white">
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
                className="lucide lucide-camera-rotate"
              >
                <path d="M12.5 3h5a2 2 0 0 1 2 2v5"></path>
                <path d="M20.755 12.444a9 9 0 1 1-2.199-8.889"></path>
                <path d="m22 4-4 4"></path>
                <path d="m22 10-4-2"></path>
                <path d="m16 10-4-2"></path>
              </svg>
            </Button>

            {/* Gallery preview */}
            <div className="h-12 w-12 rounded-md overflow-hidden border-2 border-white">
              {photos.length > 0 ? (
                <img
                  src={photos[photos.length - 1] || "/placeholder.svg"}
                  alt="Last photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                  <Image className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main form screen
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title={isEditing ? "Kaza Düzenle" : "Yeni Kaza Kaydı"} onBackClick={onBack} />

      {renderStepBar()}

      <ScrollArea className="flex-1 px-4 pb-0">
        <div className="py-4">{renderStepContent()}</div>
      </ScrollArea>

      {renderNavigationButtons()}
    </div>
  )
}

