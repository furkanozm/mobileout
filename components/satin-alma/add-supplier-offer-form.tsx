"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PurchaseRequest, SupplierOffer, SupplierOfferItem } from "./types"
import { MOCK_SUPPLIERS } from "./mock-data"

interface AddSupplierOfferFormProps {
  request: PurchaseRequest
  onSubmit: (offer: SupplierOffer) => void
  onCancel: () => void
}

export function AddSupplierOfferForm({ request, onSubmit, onCancel }: AddSupplierOfferFormProps) {
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState<boolean>(true)
  const [supplierId, setSupplierId] = useState<string>("")
  const [supplierName, setSupplierName] = useState<string>("")
  const [currency, setCurrency] = useState("TL")
  const [notes, setNotes] = useState("")
  const [offerItems, setOfferItems] = useState<SupplierOfferItem[]>([])
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0)
  const [totalSellingPrice, setTotalSellingPrice] = useState(0)

  // Initialize offer items based on request items
  useEffect(() => {
    const items = request.items.map((item) => ({
      productId: item.id,
      productName: item.product,
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: item.quantity,
      unit: item.unit,
    }))
    setOfferItems(items)
  }, [request.items])

  // Calculate totals when items change
  useEffect(() => {
    const purchaseTotal = offerItems.reduce((sum, item) => sum + item.purchasePrice * item.quantity, 0)
    const sellingTotal = offerItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)

    setTotalPurchasePrice(purchaseTotal)
    setTotalSellingPrice(sellingTotal)
  }, [offerItems])

  const handlePurchasePriceChange = (index: number, value: string) => {
    const newItems = [...offerItems]
    newItems[index].purchasePrice = Number.parseFloat(value) || 0
    setOfferItems(newItems)
  }

  const handleSellingPriceChange = (index: number, value: string) => {
    const newItems = [...offerItems]
    newItems[index].sellingPrice = Number.parseFloat(value) || 0
    setOfferItems(newItems)
  }

  const handleSupplierChange = (value: string) => {
    setSupplierId(value)
    const selectedSupplier = MOCK_SUPPLIERS.find((s) => s.id === value)
    if (selectedSupplier) {
      setSupplierName(selectedSupplier.name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (isRegisteredSupplier && !supplierId) {
      alert("Lütfen kayıtlı bir tedarikçi seçin")
      return
    }

    if (!isRegisteredSupplier && !supplierName) {
      alert("Lütfen tedarikçi adını girin")
      return
    }

    // Check if all items have prices
    const hasInvalidItems = offerItems.some((item) => item.purchasePrice <= 0 || item.sellingPrice <= 0)
    if (hasInvalidItems) {
      alert("Lütfen tüm ürünler için alış ve satış fiyatı girin")
      return
    }

    const finalSupplierName = isRegisteredSupplier
      ? MOCK_SUPPLIERS.find((s) => s.id === supplierId)?.name || ""
      : supplierName

    const newOffer: SupplierOffer = {
      id: `TEK-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      supplierName: finalSupplierName,
      isRegisteredSupplier,
      supplierId: isRegisteredSupplier ? supplierId : undefined,
      items: offerItems,
      totalPurchasePrice,
      totalSellingPrice,
      currency,
      status: "pending",
      notes,
      createdAt: new Date().toISOString(),
    }

    onSubmit(newOffer)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tedarikçi Bilgileri</h3>

        <div className="space-y-4">
          <RadioGroup
            defaultValue="registered"
            className="flex space-x-4"
            onValueChange={(value) => setIsRegisteredSupplier(value === "registered")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="registered" id="registered" />
              <Label htmlFor="registered">Kayıtlı Tedarikçi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Yeni Tedarikçi</Label>
            </div>
          </RadioGroup>

          {isRegisteredSupplier ? (
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Tedarikçi Seçin <span className="text-red-500">*</span>
              </Label>
              <Select value={supplierId} onValueChange={handleSupplierChange}>
                <SelectTrigger id="supplierId">
                  <SelectValue placeholder="Tedarikçi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUPPLIERS.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="supplierName">
                Tedarikçi Adı <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Tedarikçi firma adı"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currency">Para Birimi</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Para birimi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TL">TL</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ürün Fiyatları</h3>

        {offerItems.map((item, index) => (
          <Card key={item.productId} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{item.productName}</h4>
                <div className="text-sm text-gray-500">
                  {item.quantity} {item.unit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`purchasePrice-${index}`}>
                    Alış Fiyatı ({currency}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`purchasePrice-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.purchasePrice || ""}
                    onChange={(e) => handlePurchasePriceChange(index, e.target.value)}
                    placeholder="Alış fiyatı"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`sellingPrice-${index}`}>
                    Satış Fiyatı ({currency}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`sellingPrice-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.sellingPrice || ""}
                    onChange={(e) => handleSellingPriceChange(index, e.target.value)}
                    placeholder="Satış fiyatı"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">Toplam Alış:</span>{" "}
                  {(item.purchasePrice * item.quantity).toLocaleString()} {currency}
                </div>
                <div>
                  <span className="font-medium">Toplam Satış:</span>{" "}
                  {(item.sellingPrice * item.quantity).toLocaleString()} {currency}
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Toplam Alış Fiyatı:</p>
              <p className="text-lg font-bold text-blue-700">
                {totalPurchasePrice.toLocaleString()} {currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Toplam Satış Fiyatı:</p>
              <p className="text-lg font-bold text-green-700">
                {totalSellingPrice.toLocaleString()} {currency}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">Kar Marjı:</p>
            <p className="text-md font-bold text-green-700">
              {totalPurchasePrice > 0
                ? `${(((totalSellingPrice - totalPurchasePrice) / totalPurchasePrice) * 100).toFixed(2)}%`
                : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notlar</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Teklif ile ilgili ek notlar..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Teklifi Kaydet
        </Button>
      </div>
    </form>
  )
}

