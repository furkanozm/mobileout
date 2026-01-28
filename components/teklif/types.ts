export interface MeslekKodu {
  kod: string
  meslek: string
  kisiSayisi: number
  birimMaliyet: number
}

export interface EkHizmet {
  id: string
  hizmetAdi: string
  fiyat: number
  tip: "kisi_basi_gun" | "sabit"
  dahilMi: boolean
  aciklama?: string
}

export interface RevisionHistory {
  id: string
  revisionNumber: number
  date: string
  karOrani: number
  toplamMaliyet: number
  ekHizmetler?: EkHizmet[]
  revizyonYapan: string
  notes?: string
}

export type TeklifDurumu = "beklemede" | "onaylandi" | "reddedildi"
export type SozlesmeTuru = "gecici_is_iliskisi" | "danismanlik"

export interface Teklif {
  id: string
  teklifNo: string
  firmaAdi: string
  firmaSehir: string
  teklifTarihi: string
  gecerlilikTarihi: string
  durum: TeklifDurumu
  sozlesmeTuru: SozlesmeTuru
  karOrani: number
  toplamMaliyet: number
  projeBaslangicTarihi?: string
  projeBitisTarihi?: string
  meslekKodlari?: MeslekKodu[]
  ekHizmetler?: EkHizmet[]
  redNedeni?: string
  notlar?: string
  hazirlayan?: string
  currentRevision?: number
  revisionHistory?: RevisionHistory[]
}

