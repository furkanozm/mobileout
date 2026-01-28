export interface StepComponentProps {
  onNext: () => void
  onBack: () => void
}

export interface PurchaseRequestItem {
  id?: string
  productGroup: string
  product: string
  unit: string
  quantity: number
}

export interface Contractor {
  id: string
  name: string
  managers: {
    id: string
    name: string
    position: string
  }[]
}

export interface ProductGroup {
  id: string
  name: string
  products: {
    id: string
    name: string
    group: string
    units: string[]
  }[]
}

export type RequestReason = string

export interface PurchaseRequest {
  id: string
  requestDate: string
  deadline: string
  requestType: "internal" | "contractor"
  contractor?: string
  contractorManager?: string
  isForProject: boolean
  projectId?: string
  items: {
    id: string
    productGroup: string
    product: string
    unit: string
    quantity: number
  }[]
  reason: string
  status: "draft" | "pending" | "approved" | "rejected"
  requesterName?: string
  requesterDepartment?: string
  isFieldEmployee?: boolean
  location?: string
  includeInCurrentBilling?: boolean
  issueSeparateInvoice?: boolean
  includeInCurrentBillingPeriod?: boolean
  separateInvoice?: boolean
}

export interface Supplier {
  id: string
  name: string
}

export interface SupplierOfferItem {
  productId: string
  productName: string
  purchasePrice: number
  sellingPrice: number
  quantity: number
  unit: string
}

export interface SupplierOffer {
  id: string
  supplierName: string
  supplierContact?: string
  isRegisteredSupplier: boolean
  supplierId?: string
  items: SupplierOfferItem[]
  totalPurchasePrice: number
  totalSellingPrice: number
  currency: string
  deliveryTime?: string
  deliveryDays: number
  status: "pending" | "accepted" | "rejected"
  rejectionReason?: string
  createdAt: string
  notes?: string
}

export interface FilterState {
  status: string
  requestType: string
  date: string
  searchTerm: string
  isForProject: string
}

export type PurchaseItem = {
  id: string
  productGroup: string
  product: string
  unit: string
  quantity: number
}

export type FormStep = 1 | 2 | 3 | 4

