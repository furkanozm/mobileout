"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  Globe,
  MoreVertical,
  Package,
  FileText,
  Info,
  ArrowDownUp,
  Check,
  X,
  PlusCircle,
  AlertTriangle,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IOSAlert } from "@/components/ui/ios-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PurchaseRequest, SupplierOffer } from "./types"
import { cn } from "@/lib/utils"
import { AddSupplierOfferForm } from "./add-supplier-offer-form"

interface PurchaseDetailScreenProps {
  request: PurchaseRequest
  onBack: () => void
  onUpdateRequest: (updatedRequest: PurchaseRequest) => void
}

// Mock supplier offers data
type SortOption = "price-asc" | "price-desc" | "delivery-asc" | "delivery-desc" | "status"

const REJECTION_REASONS = [
  "Bütçe yetersizliği",
  "Talep edilen ürünler mevcut",
  "Talep uygun değil",
  "Daha fazla bilgi gerekli",
  "Diğer",
]

export function PurchaseDetailScreen({ request, onBack, onUpdateRequest }: PurchaseDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "products" | "offers" | "add-offer">("summary")
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [showRejectAlert, setShowRejectAlert] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("price-asc")
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set())
  const [showOfferApproveAlert, setShowOfferApproveAlert] = useState(false)
  const [showOfferRejectAlert, setShowOfferRejectAlert] = useState(false)
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null)
  const [offerRejectionReason, setOfferRejectionReason] = useState("")
  const [showDuplicateProductAlert, setShowDuplicateProductAlert] = useState(false)
  const [duplicateProducts, setDuplicateProducts] = useState<string[]>([])
  const [showAlreadyApprovedAlert, setShowAlreadyApprovedAlert] = useState(false)
  const [alreadyApprovedProduct, setAlreadyApprovedProduct] = useState<string>("")

  const [offers, setOffers] = useState<SupplierOffer[]>([
    {
      id: "TEK-001",
      supplierName: "Yapı Market A.Ş.",
      supplierContact: "Ali Yılmaz",
      totalPurchasePrice: 10000,
      totalSellingPrice: 12500,
      currency: "TL",
      deliveryTime: "5 gün",
      deliveryDays: 5,
      status: "pending",
      createdAt: "2024-03-01T10:00:00Z",
      items: [
        {
          productId: "1",
          productName: "Çimento",
          purchasePrice: 100,
          sellingPrice: 125,
          quantity: 100,
          unit: "Torba",
        },
      ],
    },
    {
      id: "TEK-002",
      supplierName: "İnşaat Malzemeleri Ltd.",
      supplierContact: "Mehmet Demir",
      totalPurchasePrice: 9500,
      totalSellingPrice: 11800,
      currency: "TL",
      deliveryTime: "7 gün",
      deliveryDays: 7,
      status: "pending",
      createdAt: "2024-03-02T14:30:00Z",
      items: [
        {
          productId: "1",
          productName: "Çimento",
          purchasePrice: 95,
          sellingPrice: 118,
          quantity: 100,
          unit: "Torba",
        },
      ],
    },
    {
      id: "TEK-003",
      supplierName: "Teknik Malzeme San. Tic.",
      supplierContact: "Ayşe Kaya",
      totalPurchasePrice: 4000,
      totalSellingPrice: 4750,
      currency: "TL",
      deliveryTime: "3 gün",
      deliveryDays: 3,
      status: "accepted",
      createdAt: "2024-03-03T09:15:00Z",
      items: [
        {
          productId: "3",
          productName: "Matkap",
          purchasePrice: 800,
          sellingPrice: 950,
          quantity: 5,
          unit: "Adet",
        },
      ],
    },
  ])

  // For draft requests, we start with an empty offers array
  const isDraft = request.status === "draft"
  const [draftOffers, setDraftOffers] = useState<SupplierOffer[]>([])

  // Use the appropriate offers array based on request status
  const displayOffers = isDraft ? draftOffers : offers

  const [selectedProductFilter, setSelectedProductFilter] = useState<string | null>(null)

  // Benzersiz ürün isimlerini al
  const uniqueProducts = Array.from(
    new Set(displayOffers.flatMap((offer) => offer.items.map((item) => item.productName))),
  )

  // Her ürün için teklif sayısını hesapla
  const getOfferCountForProduct = (productName: string) => {
    return displayOffers.filter((offer) => offer.items.some((item) => item.productName === productName)).length
  }

  // Filtrelenmiş teklifleri hazırla
  const filteredOffers = selectedProductFilter
    ? displayOffers.filter((offer) => offer.items.some((item) => item.productName === selectedProductFilter))
    : displayOffers

  const handleApprove = () => {
    setShowApproveAlert(true)
  }

  const handleReject = () => {
    setShowRejectAlert(true)
  }

  const handleDelete = () => {
    if (request.status === "pending" || request.status === "draft") {
      setShowDeleteAlert(true)
    }
  }

  const confirmApprove = () => {
    const updatedRequest = { ...request, status: "approved" as const }
    onUpdateRequest(updatedRequest)
    setShowApproveAlert(false)
  }

  const confirmReject = () => {
    if (rejectionReason) {
      const updatedRequest = { ...request, status: "rejected" as const, rejectionReason }
      onUpdateRequest(updatedRequest)
      setShowRejectAlert(false)
      setRejectionReason("")
    }
  }

  const confirmDelete = () => {
    onUpdateRequest({ ...request, status: "deleted" as const })
    setShowDeleteAlert(false)
    onBack()
  }

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.totalSellingPrice - b.totalSellingPrice
      case "price-desc":
        return b.totalSellingPrice - a.totalSellingPrice
      case "delivery-asc":
        return a.deliveryDays - b.deliveryDays
      case "delivery-desc":
        return b.deliveryDays - a.deliveryDays
      case "status":
        // Sort by status: accepted first, then pending, then rejected
        const statusOrder = { accepted: 0, pending: 1, rejected: 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      default:
        return 0
    }
  })

  const toggleOfferSelection = (offerId: string) => {
    setSelectedOffers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(offerId)) {
        newSet.delete(offerId)
      } else {
        newSet.add(offerId)
      }
      return newSet
    })
  }

  const selectAllOffers = () => {
    if (selectedOffers.size === sortedOffers.length) {
      // If all are selected, deselect all
      setSelectedOffers(new Set())
    } else {
      // Otherwise select all
      setSelectedOffers(new Set(sortedOffers.map((offer) => offer.id)))
    }
  }

  // Aynı ürün için birden fazla teklif seçilip seçilmediğini kontrol et
  const checkDuplicateProductsInSelection = (offerIds: string[]): string[] => {
    const productCounts: Record<string, number> = {}
    const currentOffers = isDraft ? draftOffers : offers

    // Seçili tekliflerdeki ürünleri say
    offerIds.forEach((offerId) => {
      const offer = currentOffers.find((o) => o.id === offerId)
      if (offer) {
        offer.items.forEach((item) => {
          if (!productCounts[item.productName]) {
            productCounts[item.productName] = 0
          }
          productCounts[item.productName]++
        })
      }
    })

    // Birden fazla teklif içeren ürünleri bul
    return Object.entries(productCounts)
      .filter(([_, count]) => count > 1)
      .map(([productName]) => productName)
  }

  // Bir ürün için zaten onaylanmış teklif olup olmadığını kontrol et
  const checkAlreadyApprovedProducts = (offerId: string): string | null => {
    const currentOffers = isDraft ? draftOffers : offers
    const offer = currentOffers.find((o) => o.id === offerId)

    if (!offer) return null

    // Bu teklifin ürünlerini kontrol et
    for (const item of offer.items) {
      // Bu ürün için başka onaylanmış teklif var mı?
      const hasApprovedOffer = currentOffers.some(
        (o) => o.id !== offerId && o.status === "accepted" && o.items.some((i) => i.productName === item.productName),
      )

      if (hasApprovedOffer) {
        return item.productName
      }
    }

    return null
  }

  const handleApproveOffer = (offerId: string) => {
    // Önce bu ürün için zaten onaylanmış teklif var mı kontrol et
    const alreadyApprovedProductName = checkAlreadyApprovedProducts(offerId)

    if (alreadyApprovedProductName) {
      setAlreadyApprovedProduct(alreadyApprovedProductName)
      setShowAlreadyApprovedAlert(true)
      return
    }

    setCurrentOfferId(offerId)
    setShowOfferApproveAlert(true)
  }

  const handleRejectOffer = (offerId: string) => {
    setCurrentOfferId(offerId)
    setOfferRejectionReason("")
    setShowOfferRejectAlert(true)
  }

  const confirmApproveOffer = () => {
    if (!currentOfferId) return

    // Teklifi güncelle
    if (isDraft) {
      setDraftOffers((prevOffers) =>
        prevOffers.map((offer) => (offer.id === currentOfferId ? { ...offer, status: "accepted" as const } : offer)),
      )
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((offer) => (offer.id === currentOfferId ? { ...offer, status: "accepted" as const } : offer)),
      )
    }

    // Satın alma talebinin durumunu güncelle
    updateRequestStatus()

    // Clear the selection
    setSelectedOffers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentOfferId)
      return newSet
    })

    setCurrentOfferId(null)
    setShowOfferApproveAlert(false)
  }

  const confirmRejectOffer = () => {
    if (!currentOfferId || !offerRejectionReason) return

    // Teklifi güncelle
    if (isDraft) {
      setDraftOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === currentOfferId
            ? {
                ...offer,
                status: "rejected" as const,
                rejectionReason: offerRejectionReason,
              }
            : offer,
        ),
      )
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === currentOfferId
            ? {
                ...offer,
                status: "rejected" as const,
                rejectionReason: offerRejectionReason,
              }
            : offer,
        ),
      )
    }

    // Satın alma talebinin durumunu güncelle
    updateRequestStatus()

    // Clear the selection
    setSelectedOffers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentOfferId)
      return newSet
    })

    setCurrentOfferId(null)
    setOfferRejectionReason("")
    setShowOfferRejectAlert(false)
  }

  const handleBulkApprove = () => {
    // Seçili tekliflerde aynı ürün için birden fazla teklif var mı kontrol et
    const selectedOfferIds = Array.from(selectedOffers)
    const duplicates = checkDuplicateProductsInSelection(selectedOfferIds)

    if (duplicates.length > 0) {
      setDuplicateProducts(duplicates)
      setShowDuplicateProductAlert(true)
      return
    }

    // Seçili tekliflerde, zaten onaylanmış ürünler var mı kontrol et
    const currentOffers = isDraft ? draftOffers : offers

    for (const offerId of selectedOfferIds) {
      const alreadyApprovedProductName = checkAlreadyApprovedProducts(offerId)
      if (alreadyApprovedProductName) {
        setAlreadyApprovedProduct(alreadyApprovedProductName)
        setShowAlreadyApprovedAlert(true)
        return
      }
    }

    // Sorun yoksa onay ekranını göster
    setShowApproveAlert(true)
  }

  const handleBulkReject = () => {
    setRejectionReason("")
    setShowRejectAlert(true)
  }

  const confirmBulkApprove = () => {
    // Seçili teklifleri güncelle
    if (isDraft) {
      setDraftOffers((prevOffers) =>
        prevOffers.map((offer) => (selectedOffers.has(offer.id) ? { ...offer, status: "accepted" as const } : offer)),
      )
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((offer) => (selectedOffers.has(offer.id) ? { ...offer, status: "accepted" as const } : offer)),
      )
    }

    // Satın alma talebinin durumunu güncelle
    updateRequestStatus()

    // Clear all selections after bulk action
    setSelectedOffers(new Set())
    setShowApproveAlert(false)
  }

  const confirmBulkReject = () => {
    if (!rejectionReason) return

    // Seçili teklifleri güncelle
    if (isDraft) {
      setDraftOffers((prevOffers) =>
        prevOffers.map((offer) =>
          selectedOffers.has(offer.id)
            ? {
                ...offer,
                status: "rejected" as const,
                rejectionReason: rejectionReason,
              }
            : offer,
        ),
      )
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          selectedOffers.has(offer.id)
            ? {
                ...offer,
                status: "rejected" as const,
                rejectionReason: rejectionReason,
              }
            : offer,
        ),
      )
    }

    // Satın alma talebinin durumunu güncelle
    updateRequestStatus()

    // Clear all selections after bulk action
    setSelectedOffers(new Set())
    setRejectionReason("")
    setShowRejectAlert(false)
  }

  // Satın alma talebinin durumunu güncellemek için yeni bir fonksiyon ekleyelim
  const updateRequestStatus = () => {
    // Tüm tekliflerin durumunu kontrol et
    const currentOffers = isDraft ? draftOffers : offers
    const pendingOffers = currentOffers.filter((offer) => offer.status === "pending")
    const acceptedOffers = currentOffers.filter((offer) => offer.status === "accepted")
    const rejectedOffers = currentOffers.filter((offer) => offer.status === "rejected")

    // Eğer hiç bekleyen teklif yoksa ve en az bir teklif onaylanmışsa, talebi onayla
    if (pendingOffers.length === 0 && acceptedOffers.length > 0) {
      const updatedRequest = { ...request, status: "approved" as const }
      onUpdateRequest(updatedRequest)
    }
    // Eğer hiç bekleyen veya onaylanmış teklif yoksa ve en az bir red varsa, talebi reddet
    else if (pendingOffers.length === 0 && acceptedOffers.length === 0 && rejectedOffers.length > 0) {
      const updatedRequest = { ...request, status: "rejected" as const }
      onUpdateRequest(updatedRequest)
    }
    // Eğer taslak durumundaysa ve en az bir teklif eklendiyse, durumu beklemede olarak güncelle
    else if (isDraft && currentOffers.length > 0) {
      const updatedRequest = { ...request, status: "pending" as const }
      onUpdateRequest(updatedRequest)
    }
  }

  const handleAddOffer = (newOffer: SupplierOffer) => {
    setDraftOffers((prev) => [...prev, newOffer])
    setActiveTab("offers")

    // If this is the first offer, update request status from draft to pending
    if (isDraft && draftOffers.length === 0) {
      const updatedRequest = { ...request, status: "pending" as const }
      onUpdateRequest(updatedRequest)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Taslak", className: "bg-gray-100 text-gray-800 border-gray-400" },
      pending: { label: "Beklemede", className: "bg-yellow-100 text-yellow-800 border-yellow-400" },
      approved: { label: "Onaylandı", className: "bg-green-100 text-green-800 border-green-400" },
      rejected: { label: "Reddedildi", className: "bg-red-100 text-red-800 border-red-400" },
      deleted: { label: "Silindi", className: "bg-gray-100 text-gray-800 border-gray-400" },
    }
    return statusMap[status as keyof typeof statusMap]
  }

  // Bir teklif için, içerdiği ürünlerden herhangi biri için zaten onaylanmış bir teklif olup olmadığını kontrol eden fonksiyon ekleyelim
  // Bu fonksiyonu, teklif kartlarında "Kabul Et" butonunu devre dışı bırakmak için kullanacağız
  const isOfferApprovable = (offerId: string): boolean => {
    const currentOffers = isDraft ? draftOffers : offers
    const offer = currentOffers.find((o) => o.id === offerId)

    if (!offer || offer.status !== "pending") return false

    // Bu teklifin ürünlerini kontrol et
    for (const item of offer.items) {
      // Bu ürün için başka onaylanmış teklif var mı?
      const hasApprovedOffer = currentOffers.some(
        (o) => o.id !== offerId && o.status === "accepted" && o.items.some((i) => i.productName === item.productName),
      )

      if (hasApprovedOffer) {
        return false // Onaylanmış teklif varsa, bu teklif onaylanamaz
      }
    }

    return true // Hiçbir ürün için onaylanmış teklif yoksa, bu teklif onaylanabilir
  }

  // Bir ürün için zaten onaylanmış teklif varsa, o ürünün adını döndüren fonksiyon
  const getAlreadyApprovedProduct = (offerId: string): string | null => {
    const currentOffers = isDraft ? draftOffers : offers
    const offer = currentOffers.find((o) => o.id === offerId)

    if (!offer) return null

    // Bu teklifin ürünlerini kontrol et
    for (const item of offer.items) {
      // Bu ürün için başka onaylanmış teklif var mı?
      const hasApprovedOffer = currentOffers.some(
        (o) => o.id !== offerId && o.status === "accepted" && o.items.some((i) => i.productName === item.productName),
      )

      if (hasApprovedOffer) {
        return item.productName
      }
    }

    return null
  }

  return (
    <div className="h-full flex flex-col bg-blue-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(request.status === "draft" || request.status === "pending") && (
              <DropdownMenuItem onClick={() => setActiveTab("add-offer")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Teklif Ekle
              </DropdownMenuItem>
            )}
            {!isDraft && <DropdownMenuItem onClick={handleApprove}>Onayla</DropdownMenuItem>}
            {!isDraft && <DropdownMenuItem onClick={handleReject}>Reddet</DropdownMenuItem>}
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={!(request.status === "pending" || request.status === "draft")}
              className={request.status === "pending" || request.status === "draft" ? "text-red-600" : "text-gray-400"}
            >
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Satın Alma Talebi #{request.id}</h2>
          <Badge variant="outline" className={cn("whitespace-nowrap", getStatusBadge(request.status).className)}>
            {getStatusBadge(request.status).label}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b bg-white">
        <button
          className={cn(
            "flex items-center justify-center gap-2 flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "summary"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
          onClick={() => setActiveTab("summary")}
        >
          <Info className="h-4 w-4" />
          Özet
        </button>
        <button
          className={cn(
            "flex items-center justify-center gap-2 flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
          onClick={() => setActiveTab("products")}
        >
          <Package className="h-4 w-4" />
          Ürünler
        </button>
        <button
          className={cn(
            "flex items-center justify-center gap-2 flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "offers"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
          onClick={() => setActiveTab("offers")}
        >
          <FileText className="h-4 w-4" />
          Teklifler {displayOffers.length > 0 && `(${displayOffers.length})`}
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          {activeTab === "summary" && (
            <div className="p-4">
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Talep Tarihi:</p>
                    <p>{request.requestDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Termin Tarihi:</p>
                    <p>{request.deadline}</p>
                  </div>
                  <div>
                    <p className="font-medium">Durum:</p>
                    <Badge
                      variant="outline"
                      className={cn("whitespace-nowrap", getStatusBadge(request.status).className)}
                    >
                      {getStatusBadge(request.status).label}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Talep Tipi:</p>
                    <p>{request.requestType === "internal" ? "Kurum İçi" : "Yüklenici"}</p>
                  </div>
                  {request.requestType === "internal" && (
                    <>
                      {request.requesterName && (
                        <div>
                          <p className="font-medium">Talep Eden Kişi:</p>
                          <p>{request.requesterName}</p>
                        </div>
                      )}
                      {request.requesterDepartment && (
                        <div>
                          <p className="font-medium">Departman:</p>
                          <p>{request.requesterDepartment}</p>
                        </div>
                      )}
                      {request.isFieldEmployee && request.location && (
                        <div>
                          <p className="font-medium">Lokasyon:</p>
                          <p>{request.location}</p>
                        </div>
                      )}
                    </>
                  )}
                  {request.requestType === "contractor" && (
                    <>
                      <div>
                        <p className="font-medium">Yüklenici:</p>
                        <p>{request.contractor}</p>
                      </div>
                      <div>
                        <p className="font-medium">Yüklenici Yöneticisi:</p>
                        <p>{request.contractorManager}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="font-medium">Proje İçin mi?:</p>
                    <p>{request.isForProject ? "Evet" : "Hayır"}</p>
                  </div>
                  {request.isForProject && (
                    <div>
                      <p className="font-medium">Proje ID:</p>
                      <p>{request.projectId}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="font-medium">Talep Nedeni:</p>
                    <p>{request.reason}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "products" && (
            <div className="p-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Talep Edilen Ürünler</h3>
                <div className="space-y-4">
                  {request.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-2 gap-2 text-sm border-b pb-2 last:border-b-0">
                      <div>
                        <p className="font-medium">Ürün Grubu:</p>
                        <p>{item.productGroup}</p>
                      </div>
                      <div>
                        <p className="font-medium">Ürün:</p>
                        <p>{item.product}</p>
                      </div>
                      <div>
                        <p className="font-medium">Birim:</p>
                        <p>{item.unit}</p>
                      </div>
                      <div>
                        <p className="font-medium">Miktar:</p>
                        <p>{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "offers" && (
            <div className="p-4 space-y-4">
              {isDraft && displayOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">Henüz Teklif Eklenmemiş</h3>
                  <p className="text-gray-500 mt-2 mb-6">Bu talep için henüz tedarikçi teklifi bulunmamaktadır.</p>
                  <Button onClick={() => setActiveTab("add-offer")} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Yeni Teklif Ekle
                  </Button>
                </div>
              ) : (
                <>
                  {/* Sorting and Select All Controls */}
                  {displayOffers.length > 0 && (
                    <div className="flex items-center justify-between gap-2 px-1 mb-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs font-medium bg-blue"
                        size="sm"
                        className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={selectAllOffers}
                      >
                        {selectedOffers.size === sortedOffers.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                      </Button>

                      <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                        <SelectTrigger className="h-9 text-xs">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <ArrowDownUp className="h-3 w-3 flex-shrink-0" />
                            <SelectValue placeholder="Sırala" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                          <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                          <SelectItem value="delivery-asc">Teslimat: En Hızlı</SelectItem>
                          <SelectItem value="delivery-desc">Teslimat: En Geç</SelectItem>
                          <SelectItem value="status">Duruma Göre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Product Filters */}
                  {uniqueProducts.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {uniqueProducts.map((product) => {
                        const offerCount = getOfferCountForProduct(product)
                        return (
                          <div key={product} className="relative inline-flex">
                            <Badge
                              variant="outline"
                              className={cn(
                                "cursor-pointer transition-colors pr-6 py-1.5 text-xs font-medium shadow-sm",
                                selectedProductFilter === product
                                  ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
                              )}
                              onClick={() =>
                                setSelectedProductFilter(selectedProductFilter === product ? null : product)
                              }
                            >
                              {product}
                              {selectedProductFilter === product && (
                                <X
                                  className="h-3.5 w-3.5 absolute right-1.5 top-1/2 transform -translate-y-1/2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedProductFilter(null)
                                  }}
                                />
                              )}
                            </Badge>
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full border-2 border-white shadow-sm">
                              {offerCount}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {sortedOffers.map((offer, index) => (
                    <Card key={offer.id} className="p-4 overflow-hidden">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleOfferSelection(offer.id)}
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                            selectedOffers.has(offer.id)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600",
                          )}
                        >
                          {selectedOffers.has(offer.id) ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                        </button>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{offer.supplierName}</h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                "whitespace-nowrap",
                                offer.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                                  : offer.status === "accepted"
                                    ? "bg-green-100 text-green-800 border-green-400"
                                    : "bg-red-100 text-red-800 border-red-400",
                              )}
                            >
                              {offer.status === "pending"
                                ? "Değerlendirmede"
                                : offer.status === "accepted"
                                  ? "Kabul Edildi"
                                  : "Reddedildi"}
                            </Badge>
                          </div>

                          {offer.status === "rejected" && offer.rejectionReason && (
                            <div className="mt-1 text-xs text-red-600">
                              <span className="font-medium">Red Nedeni:</span> {offer.rejectionReason}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="font-medium">Teklif No:</p>
                              <p>{offer.id}</p>
                            </div>
                            <div>
                              <p className="font-medium">Toplam Satış Fiyatı:</p>
                              <p className="font-semibold text-blue-700">
                                {offer.totalSellingPrice.toLocaleString()} {offer.currency}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Toplam Alış Fiyatı:</p>
                              <p className="font-semibold text-green-700">
                                {offer.totalPurchasePrice.toLocaleString()} {offer.currency}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Teslimat Süresi:</p>
                              <p>{offer.deliveryTime}</p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="font-medium text-sm mb-2">Teklif Detayları:</p>
                            <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                              {offer.items.map((item) => (
                                <div key={item.productId} className="mb-2 last:mb-0 text-sm">
                                  <div className="flex justify-between">
                                    <span>{item.productName}</span>
                                    <span className="font-medium">
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>Alış Fiyatı:</span>
                                    <span>
                                      {item.purchasePrice.toLocaleString()} {offer.currency}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>Satış Fiyatı:</span>
                                    <span>
                                      {item.sellingPrice.toLocaleString()} {offer.currency}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-medium">
                                    <span>Kar Marjı:</span>
                                    <span className="text-green-600">
                                      {(((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(
                                        2,
                                      )}
                                      %
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {offer.status === "pending" && (
                            <div className="flex justify-end gap-2 mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectOffer(offer.id)}
                              >
                                Reddet
                              </Button>
                              <div className="relative group">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className={cn(
                                    "bg-green-600 hover:bg-green-700",
                                    !isOfferApprovable(offer.id) &&
                                      "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400",
                                  )}
                                  onClick={() => isOfferApprovable(offer.id) && handleApproveOffer(offer.id)}
                                  disabled={!isOfferApprovable(offer.id)}
                                >
                                  Kabul Et
                                </Button>
                                {!isOfferApprovable(offer.id) && (
                                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                    <div className="relative">
                                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                      <p>
                                        {getAlreadyApprovedProduct(offer.id)} ürünü için zaten onaylanmış bir teklif
                                        bulunmaktadır.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "add-offer" && (
            <div className="p-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Yeni Tedarikçi Teklifi Ekle</h3>
                <AddSupplierOfferForm
                  request={request}
                  onSubmit={handleAddOffer}
                  onCancel={() => setActiveTab("offers")}
                />
              </Card>
            </div>
          )}
        </ScrollArea>

        {/* Bulk action buttons - now part of the main layout, not fixed */}
        {activeTab === "offers" && selectedOffers.size > 0 && (
          <div className="p-3 bg-white border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleBulkReject}
              >
                Reddet ({selectedOffers.size})
              </Button>
              <Button variant="default" className="flex-1 bg-green-500 hover:bg-green-600" onClick={handleBulkApprove}>
                Onayla ({selectedOffers.size})
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Standart onay/red uyarıları */}
      <IOSAlert
        isOpen={showApproveAlert}
        onClose={() => setShowApproveAlert(false)}
        onConfirm={confirmBulkApprove}
        title="Teklifleri Onayla"
        message={
          <div className="space-y-2">
            <p>Seçili {selectedOffers.size} teklifi onaylamak istediğinizden emin misiniz?</p>
            <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
              {Array.from(selectedOffers).map((id) => {
                const offer = displayOffers.find((o) => o.id === id)
                return offer ? (
                  <div key={id} className="mb-2 pb-2 border-b last:border-b-0">
                    <p className="font-medium">{offer.supplierName}</p>
                    <p className="text-blue-700">
                      {offer.totalSellingPrice.toLocaleString()} {offer.currency}
                    </p>
                  </div>
                ) : null
              })}
            </div>
          </div>
        }
        confirmText="Onayla"
        cancelText="İptal"
      />

      <IOSAlert
        isOpen={showRejectAlert}
        onClose={() => setShowRejectAlert(false)}
        onConfirm={confirmBulkReject}
        title="Teklifleri Reddet"
        message={
          <div className="space-y-4">
            <p>Seçili {selectedOffers.size} teklifi reddetmek istediğinizden emin misiniz?</p>
            <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto mb-3">
              {Array.from(selectedOffers).map((id) => {
                const offer = displayOffers.find((o) => o.id === id)
                return offer ? (
                  <div key={id} className="mb-2 pb-2 border-b last:border-b-0">
                    <p className="font-medium">{offer.supplierName}</p>
                    <p className="text-blue-700">
                      {offer.totalSellingPrice.toLocaleString()} {offer.currency}
                    </p>
                  </div>
                ) : null
              })}
            </div>
            <div className="space-y-2">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                Reddetme Nedeni
              </label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Neden seçin" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        confirmText="Reddet"
        cancelText="İptal"
        confirmVariant="destructive"
      />

      <IOSAlert
        isOpen={showOfferApproveAlert}
        onClose={() => setShowOfferApproveAlert(false)}
        onConfirm={confirmApproveOffer}
        title="Teklifi Onayla"
        message={
          <div className="space-y-2">
            <p>Bu teklifi onaylamak istediğinizden emin misiniz?</p>
            {currentOfferId && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{displayOffers.find((o) => o.id === currentOfferId)?.supplierName}</p>
                <p className="text-blue-700 font-medium">
                  {displayOffers.find((o) => o.id === currentOfferId)?.totalSellingPrice.toLocaleString()}{" "}
                  {displayOffers.find((o) => o.id === currentOfferId)?.currency}
                </p>
                <p className="text-sm">Teslimat: {displayOffers.find((o) => o.id === currentOfferId)?.deliveryTime}</p>
              </div>
            )}
          </div>
        }
        confirmText="Onayla"
        cancelText="İptal"
      />

      <IOSAlert
        isOpen={showOfferRejectAlert}
        onClose={() => setShowOfferRejectAlert(false)}
        onConfirm={confirmRejectOffer}
        title="Teklifi Reddet"
        message={
          <div className="space-y-4">
            <p>Bu teklifi reddetmek istediğinizden emin misiniz?</p>
            {currentOfferId && (
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <p className="font-medium">{displayOffers.find((o) => o.id === currentOfferId)?.supplierName}</p>
                <p className="text-blue-700 font-medium">
                  {displayOffers.find((o) => o.id === currentOfferId)?.totalSellingPrice.toLocaleString()}{" "}
                  {displayOffers.find((o) => o.id === currentOfferId)?.currency}
                </p>
                <p className="text-sm">Teslimat: {displayOffers.find((o) => o.id === currentOfferId)?.deliveryTime}</p>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="offerRejectionReason" className="block text-sm font-medium text-gray-700">
                Reddetme Nedeni
              </label>
              <Select value={offerRejectionReason} onValueChange={setOfferRejectionReason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Neden seçin" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        confirmText="Reddet"
        cancelText="İptal"
        confirmVariant="destructive"
      />

      <IOSAlert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={confirmDelete}
        title="Talebi Sil"
        message="Bu satın alma talebini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        confirmVariant="destructive"
      />

      {/* Aynı ürün için birden fazla teklif onaylama uyarısı */}
      <IOSAlert
        isOpen={showDuplicateProductAlert}
        onClose={() => setShowDuplicateProductAlert(false)}
        onConfirm={() => setShowDuplicateProductAlert(false)}
        title="Uyarı: Aynı Ürün İçin Birden Fazla Teklif"
        message={
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>Aynı ürün için birden fazla teklif seçtiniz. Her ürün için yalnızca bir teklif onaylanabilir.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="font-medium mb-2">Çoklu teklif seçilen ürünler:</p>
              <ul className="list-disc pl-5 space-y-1">
                {duplicateProducts.map((product) => (
                  <li key={product}>{product}</li>
                ))}
              </ul>
            </div>

            <p className="text-sm">Lütfen her ürün için tek bir teklif seçin ve tekrar deneyin.</p>
          </div>
        }
        confirmText="Anladım"
        showCancel={false}
      />

      {/* Zaten onaylanmış ürün için teklif onaylama uyarısı */}
      <IOSAlert
        isOpen={showAlreadyApprovedAlert}
        onClose={() => setShowAlreadyApprovedAlert(false)}
        onConfirm={() => setShowAlreadyApprovedAlert(false)}
        title="Uyarı: Zaten Onaylanmış Ürün"
        message={
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-semibold">{alreadyApprovedProduct}</span> ürünü için zaten onaylanmış bir teklif
                bulunmaktadır.
              </p>
            </div>

            <p>
              Aynı ürün için birden fazla teklif onaylayamazsınız. Mevcut onayı kaldırmak isterseniz, önce onaylanmış
              teklifi reddetmeniz gerekir.
            </p>
          </div>
        }
        confirmText="Anladım"
        showCancel={false}
      />
    </div>
  )
}

// Keep default export for backward compatibility
export default PurchaseDetailScreen

