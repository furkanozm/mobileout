"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
  Truck,
  Globe,
  MoreVertical,
  Info,
  AlertTriangle,
  Edit,
  Send,
  Download,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Teklif, RevisionHistory } from "./types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { IOSActionSheet, ActionSheetButton, ActionSheetButtonGroup, ActionSheetContent } from "../ui/ios-action-sheet"
import { IOSAlert } from "../ui/ios-alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TeklifDetailProps {
  teklif: Teklif
  onBack: () => void
  onUpdate?: (updatedTeklif: Teklif) => void
}

export function TeklifDetail({ teklif, onBack, onUpdate }: TeklifDetailProps) {
  const [currentTeklif, setCurrentTeklif] = useState<Teklif>(teklif)
  const [showInfoSheet, setShowInfoSheet] = useState(false)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [showRevisionHistoryModal, setShowRevisionHistoryModal] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showPdfAlert, setShowPdfAlert] = useState(false)
  const [showSendConfirmation, setShowSendConfirmation] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [revisionData, setRevisionData] = useState({
    karOrani: teklif.karOrani.toString(),
    ekHizmetFiyatlari: teklif.ekHizmetler?.map((h) => h.fiyat.toString()) || [],
    notes: "",
  })

  // Reset body scroll lock when modals close
  useEffect(() => {
    const anyModalOpen =
      showInfoSheet ||
      showRevisionModal ||
      showRevisionHistoryModal ||
      showSuccessAlert ||
      showPdfAlert ||
      showSendConfirmation

    if (anyModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [showInfoSheet, showRevisionModal, showRevisionHistoryModal, showSuccessAlert, showPdfAlert, showSendConfirmation])

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const kisiBasisEkHizmetler = currentTeklif.ekHizmetler?.filter((h) => h.tip === "kisi_basi_gun") || []
  const sabitEkHizmetler = currentTeklif.ekHizmetler?.filter((h) => h.tip === "sabit") || []

  const dahilSabitHizmetler = sabitEkHizmetler.filter((h) => h.dahilMi)
  const ayriSabitHizmetler = sabitEkHizmetler.filter((h) => !h.dahilMi)

  const totalDahilSabitHizmet = dahilSabitHizmetler.reduce((sum, h) => sum + h.fiyat, 0)
  const totalBirimMaliyet = currentTeklif.meslekKodlari?.reduce((sum, meslek) => sum + meslek.birimMaliyet, 0) || 0
  const karTutari = (totalBirimMaliyet * currentTeklif.karOrani) / 100
  const genelToplam = totalBirimMaliyet + karTutari + totalDahilSabitHizmet

  const handleRevisionSubmit = () => {
    const newRevisionNumber = (currentTeklif.currentRevision || 0) + 1

    // Create a new revision history entry
    const newRevision: RevisionHistory = {
      id: `rev-${Date.now()}`,
      revisionNumber: newRevisionNumber,
      date: new Date().toISOString(),
      karOrani: Number.parseInt(revisionData.karOrani),
      toplamMaliyet: genelToplam,
      ekHizmetler: currentTeklif.ekHizmetler?.map((hizmet, index) => ({
        ...hizmet,
        fiyat: Number.parseInt(revisionData.ekHizmetFiyatlari[index] || hizmet.fiyat.toString()),
      })),
      revizyonYapan: "Mevcut Kullanıcı",
      notes: revisionData.notes,
    }

    // Update the teklif with the new revision
    const updatedTeklif = {
      ...currentTeklif,
      durum: "revize_edildi" as const,
      karOrani: Number.parseInt(revisionData.karOrani),
      ekHizmetler: currentTeklif.ekHizmetler?.map((hizmet, index) => ({
        ...hizmet,
        fiyat: Number.parseInt(revisionData.ekHizmetFiyatlari[index] || hizmet.fiyat.toString()),
      })),
      currentRevision: newRevisionNumber,
      teklifNo: currentTeklif.teklifNo.includes("r")
        ? currentTeklif.teklifNo.replace(/r\d+$/, `r${newRevisionNumber}`)
        : `${currentTeklif.teklifNo}-r${newRevisionNumber}`,
      revisionHistory: [...(currentTeklif.revisionHistory || []), newRevision],
    }

    setCurrentTeklif(updatedTeklif)
    // Notify parent component of the update
    if (onUpdate) {
      onUpdate(updatedTeklif)
    }
    setShowRevisionModal(false)

    // Use setTimeout to prevent UI locking
    setTimeout(() => {
      setShowSuccessAlert(true)
    }, 300)
  }

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false)
    // Show PDF alert after success alert is closed with a delay
    setTimeout(() => {
      setShowPdfAlert(true)
    }, 300)
  }

  const handlePdfAlertClose = () => {
    setShowPdfAlert(false)
  }

  const handleSendPdf = () => {
    setShowPdfAlert(false)
    // Show sending confirmation after a short delay
    setTimeout(() => {
      setShowSendConfirmation(true)
    }, 300)
  }

  const handleDownloadPdf = () => {
    // Handle PDF download logic
    setShowPdfAlert(false)
  }

  const handleEkHizmetFiyatChange = (index: number, value: string) => {
    const newFiyatlar = [...revisionData.ekHizmetFiyatlari]
    newFiyatlar[index] = value
    setRevisionData({
      ...revisionData,
      ekHizmetFiyatlari: newFiyatlar,
    })
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
        <div ref={menuRef}>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentTeklif.durum === "reddedildi" && (
                <DropdownMenuItem
                  onClick={() => {
                    setIsMenuOpen(false)
                    setTimeout(() => setShowRevisionModal(true), 100)
                  }}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Revize Et
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setIsMenuOpen(false)
                  handleDownloadPdf()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF Olarak İndir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsMenuOpen(false)
                  setTimeout(() => setShowPdfAlert(true), 100)
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                E-posta Gönder
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsMenuOpen(false)
                  setTimeout(() => setShowRevisionHistoryModal(true), 100)
                }}
              >
                <History className="h-4 w-4 mr-2" />
                Revizyon Geçmişi
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Teklifi Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">{currentTeklif.firmaAdi}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{currentTeklif.firmaSehir}</span>
                    </div>
                    {currentTeklif.currentRevision && currentTeklif.currentRevision > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-xs">
                          Revizyon {currentTeklif.currentRevision}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      "px-2.5 py-0.5",
                      currentTeklif.durum === "onaylandi" && "bg-green-100 text-green-800 border-green-200",
                      currentTeklif.durum === "reddedildi" && "bg-red-100 text-red-800 border-red-200",
                      currentTeklif.durum === "revize_edildi" && "bg-blue-100 text-blue-800 border-blue-200",
                      currentTeklif.durum === "beklemede" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                    )}
                  >
                    {currentTeklif.durum === "onaylandi"
                      ? "Onaylandı"
                      : currentTeklif.durum === "reddedildi"
                        ? "Reddedildi"
                        : currentTeklif.durum === "revize_edildi"
                          ? "Revize Edildi"
                          : "Beklemede"}
                  </Badge>
                </div>

                {/* Red Nedeni - Only show if rejected */}
                {currentTeklif.durum === "reddedildi" && currentTeklif.redNedeni && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Red Nedeni</p>
                        <p className="text-sm text-red-700 mt-1">{currentTeklif.redNedeni}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Teklif Bilgileri</p>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        <p>Teklif No: {currentTeklif.teklifNo}</p>
                        <p>Teklif Tarihi: {new Date(currentTeklif.teklifTarihi).toLocaleDateString("tr-TR")}</p>
                        <p>Geçerlilik: {new Date(currentTeklif.gecerlilikTarihi).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Sözleşme Türü</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentTeklif.sozlesmeTuru === "gecici_is_iliskisi" ? "Geçici İş İlişkisi" : "Danışmanlık"}
                      </p>
                    </div>
                  </div>

                  {currentTeklif.projeBaslangicTarihi && currentTeklif.projeBitisTarihi && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Proje Süresi</p>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                          <p>Başlangıç: {new Date(currentTeklif.projeBaslangicTarihi).toLocaleDateString("tr-TR")}</p>
                          <p>Bitiş: {new Date(currentTeklif.projeBitisTarihi).toLocaleDateString("tr-TR")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    size="icon"
                    onClick={() => setShowInfoSheet(true)}
                    className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentTeklif.meslekKodlari && currentTeklif.meslekKodlari.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Personel Detayları</h3>
                <div className="space-y-4">
                  {currentTeklif.meslekKodlari.map((meslek) => (
                    <div key={meslek.kod} className="pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{meslek.meslek}</p>
                          <p className="text-sm text-muted-foreground">{meslek.kod}</p>
                        </div>
                        <Badge variant="outline">{meslek.kisiSayisi} Kişi</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Birim Maliyet:</span>
                          <span className="font-medium">{formatCurrency(meslek.birimMaliyet)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {currentTeklif.meslekKodlari.length > 1 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Toplam Birim Maliyet:</span>
                        <span className="font-medium">{formatCurrency(totalBirimMaliyet)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTeklif.ekHizmetler && currentTeklif.ekHizmetler.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Ek Hizmetler</h3>
                </div>

                {dahilSabitHizmetler.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-medium text-blue-600">Toplam Tutara Dahil Edilen Hizmetler</h4>
                    {dahilSabitHizmetler.map((hizmet) => (
                      <div key={hizmet.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">{hizmet.hizmetAdi}</span>
                          {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                        </div>
                        <span className="font-medium">{formatCurrency(hizmet.fiyat)}/ay</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Toplam:</span>
                        <span className="font-medium">{formatCurrency(totalDahilSabitHizmet)}/ay</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-amber-600">Ayrı Faturalandırılacak Hizmetler</h4>

                  {ayriSabitHizmetler.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <h5 className="text-xs font-medium text-muted-foreground">Sabit Hizmetler</h5>
                      {ayriSabitHizmetler.map((hizmet) => (
                        <div key={hizmet.id} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm">{hizmet.hizmetAdi}</span>
                            {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                          </div>
                          <span className="font-medium">{formatCurrency(hizmet.fiyat)}/ay</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {kisiBasisEkHizmetler.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-medium text-muted-foreground">Kişi Başı Günlük Hizmetler</h5>
                      {kisiBasisEkHizmetler.map((hizmet) => (
                        <div key={hizmet.id} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm">{hizmet.hizmetAdi}</span>
                            {hizmet.aciklama && <p className="text-xs text-muted-foreground">{hizmet.aciklama}</p>}
                          </div>
                          <span className="font-medium">{formatCurrency(hizmet.fiyat)}/gün</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Geçerlilik Süresi</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(currentTeklif.gecerlilikTarihi).toLocaleDateString("tr-TR")} tarihine kadar geçerlidir
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div className="w-full">
                    <p className="font-medium">Maliyet Bilgileri</p>
                    <div className="mt-2 space-y-2">
                      {/* Personel Maliyetleri */}
                      {currentTeklif.meslekKodlari && currentTeklif.meslekKodlari.length > 0 && (
                        <div className="space-y-2 pb-2">
                          {currentTeklif.meslekKodlari.map((meslek) => (
                            <div key={meslek.kod} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {meslek.kod} | {meslek.meslek}:
                              </span>
                              <span className="font-medium">{formatCurrency(meslek.birimMaliyet)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm pt-1 border-t">
                            <span className="text-muted-foreground">Aylık Olası Toplam Maliyet:</span>
                            <span className="font-medium">{formatCurrency(totalBirimMaliyet)}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kâr Oranı:</span>
                        <span className="font-medium">%{currentTeklif.karOrani}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kâr Tutarı:</span>
                        <span className="font-medium">{formatCurrency(karTutari)}</span>
                      </div>

                      {/* Toplam Tutara Dahil Edilen Hizmetler */}
                      {dahilSabitHizmetler.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium">Toplam Tutara Dahil Edilen Hizmetler:</p>
                          {dahilSabitHizmetler.map((hizmet) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{hizmet.hizmetAdi}:</span>
                              <span className="font-medium">{formatCurrency(hizmet.fiyat)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Toplam Dahil Edilen Hizmetler:</span>
                            <span className="font-medium">{formatCurrency(totalDahilSabitHizmet)}</span>
                          </div>
                        </div>
                      )}

                      {/* Ayrı Faturalandırılacak Hizmetler */}
                      {(ayriSabitHizmetler.length > 0 || kisiBasisEkHizmetler.length > 0) && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium">Ayrı Faturalandırılacak Hizmetler:</p>
                          {ayriSabitHizmetler.map((hizmet) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{hizmet.hizmetAdi} (Sabit):</span>
                              <span className="font-medium">{formatCurrency(hizmet.fiyat)}/ay</span>
                            </div>
                          ))}
                          {kisiBasisEkHizmetler.map((hizmet) => (
                            <div key={hizmet.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{hizmet.hizmetAdi} (Kişi Başı):</span>
                              <span className="font-medium">{formatCurrency(hizmet.fiyat)}/gün</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Genel Toplam */}
                      <div className="flex justify-between text-sm pt-2 border-t mt-2">
                        <span className="font-medium">Genel Toplam:</span>
                        <span className="font-medium">{formatCurrency(genelToplam)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentTeklif.notlar && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Notlar</h3>
                <p className="text-sm text-muted-foreground">{currentTeklif.notlar}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Info Action Sheet */}
      <IOSActionSheet isOpen={showInfoSheet} onClose={() => setShowInfoSheet(false)} title="Teklif Bilgileri">
        <ActionSheetContent>
          <p>Teklif No: {currentTeklif.teklifNo}</p>
          <p>Oluşturulma Tarihi: {new Date(currentTeklif.teklifTarihi).toLocaleDateString("tr-TR")}</p>
          <p>Son Güncelleme: {new Date(currentTeklif.teklifTarihi).toLocaleDateString("tr-TR")}</p>
          <p>Hazırlayan: {currentTeklif.hazirlayan || "Seda Sel"}</p>
          <p>
            Toplam Personel: {currentTeklif.meslekKodlari?.reduce((sum, meslek) => sum + meslek.kisiSayisi, 0) || 0}{" "}
            kişi
          </p>
          <p>Toplam Maliyet: {formatCurrency(genelToplam)}</p>
          {currentTeklif.durum === "reddedildi" && <p className="text-red-600">Durum: Reddedildi</p>}
          {currentTeklif.durum === "revize_edildi" && <p className="text-blue-600">Durum: Revize Edildi</p>}
          {currentTeklif.currentRevision && <p className="text-blue-600">Durum: Revize Edildi</p>}
          {currentTeklif.currentRevision && currentTeklif.currentRevision > 0 && (
            <p className="text-blue-600">Revizyon: {currentTeklif.currentRevision}</p>
          )}
        </ActionSheetContent>
        <ActionSheetButtonGroup>
          <ActionSheetButton className="text-blue-600">PDF Görüntüle</ActionSheetButton>
          <ActionSheetButton onClick={() => setShowInfoSheet(false)}>Tamam</ActionSheetButton>
        </ActionSheetButtonGroup>
      </IOSActionSheet>

      {/* Revision Modal */}
      <IOSAlert
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onConfirm={handleRevisionSubmit}
        title="Teklifi Revize Et"
        message={
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="karOrani" className="text-sm font-medium">
                Kâr Oranı (%)
              </Label>
              <Input
                id="karOrani"
                type="number"
                value={revisionData.karOrani}
                onChange={(e) => setRevisionData({ ...revisionData, karOrani: e.target.value })}
                className="h-9"
              />
            </div>

            {currentTeklif.ekHizmetler && currentTeklif.ekHizmetler.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Ek Hizmet Fiyatları</p>
                {currentTeklif.ekHizmetler.map((hizmet, index) => (
                  <div key={hizmet.id} className="space-y-1">
                    <Label htmlFor={`hizmet-${index}`} className="text-sm">
                      {hizmet.hizmetAdi}
                    </Label>
                    <Input
                      id={`hizmet-${index}`}
                      type="number"
                      value={revisionData.ekHizmetFiyatlari[index] || hizmet.fiyat}
                      onChange={(e) => handleEkHizmetFiyatChange(index, e.target.value)}
                      className="h-9"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="revisionNotes" className="text-sm font-medium">
                Revizyon Notları
              </Label>
              <Input
                id="revisionNotes"
                placeholder="Revizyon hakkında notlar..."
                value={revisionData.notes}
                onChange={(e) => setRevisionData({ ...revisionData, notes: e.target.value })}
                className="h-9"
              />
            </div>

            <p className="text-xs text-gray-500 pt-2">
              Revizyon sonrası teklif durumu "Revize Edildi" olarak güncellenecektir.
            </p>
          </div>
        }
        confirmText="Revize Et"
        cancelText="İptal"
      />

      {/* Success Alert */}
      <IOSAlert
        isOpen={showSuccessAlert}
        onClose={handleSuccessAlertClose}
        onConfirm={handleSuccessAlertClose}
        title="Revizyon Tamamlandı"
        message="Teklif başarıyla revize edildi. Durum 'Revize Edildi' olarak güncellendi."
        confirmText="Tamam"
      />

      {/* PDF Alert */}
      <IOSAlert
        isOpen={showPdfAlert}
        onClose={handlePdfAlertClose}
        onConfirm={handleSendPdf}
        title="Revize PDF"
        message={
          <div className="space-y-3 py-2">
            <p>Revize edilmiş teklif PDF'i hazır. Müşteriye göndermek ister misiniz?</p>
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" className="mr-2" onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-1" />
                İndir
              </Button>
            </div>
          </div>
        }
        confirmText="Gönder"
        confirmVariant="default"
        cancelText="Daha Sonra"
      />

      {/* Send Confirmation */}
      <IOSAlert
        isOpen={showSendConfirmation}
        onClose={() => setShowSendConfirmation(false)}
        onConfirm={() => setShowSendConfirmation(false)}
        title="PDF Gönderildi"
        message="Revize edilmiş teklif PDF'i müşteriye başarıyla gönderildi."
        confirmText="Tamam"
      />

      {/* Revision History Modal */}
      <IOSAlert
        isOpen={showRevisionHistoryModal}
        onClose={() => setShowRevisionHistoryModal(false)}
        onConfirm={() => setShowRevisionHistoryModal(false)}
        title="Revizyon Geçmişi"
        message={
          <div className="space-y-4 py-2 max-h-[60vh] overflow-auto">
            {currentTeklif.revisionHistory && currentTeklif.revisionHistory.length > 0 ? (
              currentTeklif.revisionHistory.map((revision) => (
                <div
                  key={revision.id}
                  className="border-b pb-3 last:border-b-0 last:pb-0 border border-gray-200 rounded-md p-3 mb-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50">
                          R{revision.revisionNumber}
                        </Badge>
                        <p className="text-sm font-medium">{new Date(revision.date).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Revizyon yapan: {revision.revizyonYapan || "Sistem"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Kâr: %{revision.karOrani}</p>
                      <p className="text-xs text-muted-foreground">Toplam: {formatCurrency(revision.toplamMaliyet)}</p>
                    </div>
                  </div>
                  {revision.notes && (
                    <p className="text-xs text-muted-foreground mt-2 bg-gray-50 p-2 rounded border border-gray-200">
                      {revision.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Henüz revizyon yapılmamış.</p>
            )}
          </div>
        }
        confirmText="Kapat"
        showCancel={false}
      />
    </div>
  )
}

