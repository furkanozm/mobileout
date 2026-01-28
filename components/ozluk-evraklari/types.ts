export interface Evrak {
  id: string
  personelAdi: string
  firma: string
  projeGrubu: string
  evrakTuru: string
  dosyaTuru: string
  durum: "onaylandı" | "reddedildi" | "beklemede" | "indirildi"
  tarih: string
}

export interface FilterState {
  evrakTuru: string
  startDate: string
  endDate: string
  durum: EvrakDurum
}

export type EvrakDurum = "tumu" | "beklemede" | "onaylandı" | "reddedildi"

