"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { MOCK_PRODUCT_GROUPS } from "./mock-data"
import type { PurchaseItem, StepComponentProps } from "./types"

export function PurchaseStep3Form({ onNext, onBack }: StepComponentProps) {
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: "1",
      productGroup: "",
      product: "",
      unit: "",
      quantity: 0,
    },
  ])

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productGroup: "",
        product: "",
        unit: "",
        quantity: 0,
      },
    ])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleItemChange = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              ...(field === "productGroup" && {
                product: "",
                unit: "",
              }),
              ...(field === "product" && {
                unit: "",
              }),
            }
          : item,
      ),
    )
  }

  const getAvailableProducts = (groupId: string) => {
    return MOCK_PRODUCT_GROUPS.find((g) => g.id === groupId)?.products || []
  }

  const getAvailableUnits = (groupId: string, productId: string) => {
    const group = MOCK_PRODUCT_GROUPS.find((g) => g.id === groupId)
    const product = group?.products.find((p) => p.id === productId)
    return product?.units || []
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="p-4 space-y-4 flex-grow overflow-auto pb-24">
        <form id="purchase-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4 w-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Ürün {index + 1}</h3>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`productGroup-${item.id}`}>Ürün Grubu</Label>
                      <Select
                        value={item.productGroup}
                        onValueChange={(value) => handleItemChange(item.id, "productGroup", value)}
                      >
                        <SelectTrigger id={`productGroup-${item.id}`}>
                          <SelectValue placeholder="Ürün grubu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_PRODUCT_GROUPS.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`product-${item.id}`}>Ürün</Label>
                      <Select
                        value={item.product}
                        onValueChange={(value) => handleItemChange(item.id, "product", value)}
                        disabled={!item.productGroup}
                      >
                        <SelectTrigger id={`product-${item.id}`}>
                          <SelectValue placeholder="Ürün seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableProducts(item.productGroup).map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`unit-${item.id}`}>Birim</Label>
                        <Select
                          value={item.unit}
                          onValueChange={(value) => handleItemChange(item.id, "unit", value)}
                          disabled={!item.product}
                        >
                          <SelectTrigger id={`unit-${item.id}`}>
                            <SelectValue placeholder="Birim seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableUnits(item.productGroup, item.product).map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${item.id}`}>Adet</Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity || ""}
                          onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={handleAddItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ürün Ekle
            </Button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-[80px] left-0 right-0 p-4 bg-white border-t">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
            Geri
          </Button>
          <Button type="submit" form="purchase-form" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
            Devam Et
          </Button>
        </div>
      </div>
    </div>
  )
}

