import type { Contractor, ProductGroup, RequestReason, PurchaseRequest, Supplier } from "./types"

export const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: "1",
    name: "ABC İnşaat Ltd. Şti.",
    managers: [
      { id: "1", name: "Ahmet Yılmaz", position: "Proje Müdürü" },
      { id: "2", name: "Mehmet Demir", position: "Saha Müdürü" },
    ],
  },
  {
    id: "2",
    name: "XYZ Yapı A.Ş.",
    managers: [
      { id: "3", name: "Ayşe Kaya", position: "Proje Müdürü" },
      { id: "4", name: "Ali Öztürk", position: "Teknik Müdür" },
    ],
  },
]

export const MOCK_PRODUCT_GROUPS: ProductGroup[] = [
  {
    id: "1",
    name: "İnşaat Malzemeleri",
    products: [
      {
        id: "1",
        name: "Çimento",
        group: "İnşaat Malzemeleri",
        units: ["Torba", "Kg"],
      },
      {
        id: "2",
        name: "Demir",
        group: "İnşaat Malzemeleri",
        units: ["Ton", "Kg"],
      },
    ],
  },
  {
    id: "2",
    name: "El Aletleri",
    products: [
      {
        id: "3",
        name: "Matkap",
        group: "El Aletleri",
        units: ["Adet"],
      },
      {
        id: "4",
        name: "Testere",
        group: "El Aletleri",
        units: ["Adet"],
      },
    ],
  },
]

export const REQUEST_REASONS: RequestReason[] = [
  "Yeni İhtiyaç",
  "Yenileme",
  "Arıza/Tamir",
  "Stok Tamamlama",
  "Proje İhtiyacı",
  "Diğer",
]

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: "SA-2024-001",
    requestDate: "2024-02-20",
    deadline: "2024-03-05",
    requestType: "internal",
    isForProject: true,
    projectId: "1",
    items: [
      {
        id: "1",
        productGroup: "İnşaat Malzemeleri",
        product: "Çimento",
        unit: "Torba",
        quantity: 100,
      },
      {
        id: "2",
        productGroup: "El Aletleri",
        product: "Matkap",
        unit: "Adet",
        quantity: 5,
      },
    ],
    reason: "Proje İhtiyacı",
    status: "pending",
    requesterName: "Ahmet Yılmaz",
    requesterDepartment: "IT",
    isFieldEmployee: false,
  },
  {
    id: "SA-2024-002",
    requestDate: "2024-02-18",
    deadline: "2024-03-01",
    requestType: "contractor",
    contractor: "ABC İnşaat Ltd. Şti.",
    contractorManager: "1",
    isForProject: false,
    items: [
      {
        id: "3",
        productGroup: "İnşaat Malzemeleri",
        product: "Demir",
        unit: "Ton",
        quantity: 10,
      },
    ],
    reason: "Yeni İhtiyaç",
    status: "approved",
  },
  {
    id: "SA-2024-003",
    requestDate: "2024-02-15",
    deadline: "2024-02-28",
    requestType: "internal",
    isForProject: true,
    projectId: "2",
    items: [
      {
        id: "4",
        productGroup: "El Aletleri",
        product: "Testere",
        unit: "Adet",
        quantity: 20,
      },
    ],
    reason: "Arıza/Tamir",
    status: "rejected",
    requesterName: "Mehmet Demir",
    requesterDepartment: "Saha Operasyonları",
    isFieldEmployee: true,
    location: "İstanbul - Kadıköy Şantiyesi",
  },
  // Add draft purchase request
  {
    id: "SA-2024-004",
    requestDate: "2024-03-01",
    deadline: "2024-03-15",
    requestType: "internal",
    isForProject: false,
    items: [
      {
        id: "5",
        productGroup: "Elektronik",
        product: "Laptop",
        unit: "Adet",
        quantity: 3,
      },
      {
        id: "6",
        productGroup: "Elektronik",
        product: "Monitör",
        unit: "Adet",
        quantity: 5,
      },
    ],
    reason: "Yeni İhtiyaç",
    status: "draft",
    requesterName: "Ayşe Kaya",
    requesterDepartment: "Muhasebe",
    isFieldEmployee: false,
  },
  {
    id: "SA-2024-005",
    requestDate: "2024-03-05",
    deadline: "2024-03-20",
    requestType: "contractor",
    contractor: "XYZ Yapı A.Ş.",
    contractorManager: "3",
    isForProject: true,
    projectId: "3",
    items: [
      {
        id: "7",
        productGroup: "İnşaat Malzemeleri",
        product: "Tuğla",
        unit: "Adet",
        quantity: 1000,
      },
    ],
    reason: "Proje İhtiyacı",
    status: "draft",
  },
]

// Kayıtlı tedarikçiler
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "1", name: "Yapı Market A.Ş." },
  { id: "2", name: "İnşaat Malzemeleri Ltd." },
  { id: "3", name: "Teknik Malzeme San. Tic." },
  { id: "4", name: "ABC Elektronik" },
  { id: "5", name: "XYZ Endüstriyel Ürünler" },
]

// For backward compatibility
export const MOCK_PURCHASE_REQUESTS = mockPurchaseRequests

