export const MOCK_PRE_REGISTERED_COMPANIES = [
  {
    id: "1",
    name: "ABC Company",
    taxId: "1234567890",
    taxOffice: "Sample Tax Office",
    address: "123 Main St",
    city: "Anytown",
    district: "Central District",
  },
  {
    id: "2",
    name: "XYZ Corporation",
    taxId: "9876543210",
    taxOffice: "Another Tax Office",
    address: "456 Elm St",
    city: "Springfield",
    district: "West District",
  },
  {
    id: "3",
    name: "123 Industries",
    taxId: "5555555555",
    taxOffice: "Yet Another Tax Office",
    address: "789 Oak Ave",
    city: "Smallville",
    district: "North District",
  },
]

// 123 Sanayi firmasına ek hizmetler ekleyin
export const mockPreRegisteredCompanies = [
  {
    id: "3",
    companyName: "123 Sanayi",
    taxId: "5678901234",
    city: "İzmir",
    district: "Merkez",
    address: "İzmir, Türkiye",
    contactName: "Ayşe Demir",
    contactPhone: "0544 333 6677",
    contactEmail: "ayse@123sanayi.com",
    type: "preregistered",
    sozlesmeTipi: "gecici", // geçici iş ilişkisi
    sector: "2", // Üretim
    selectedProfessionCodes: [
      { code: "1234", name: "Yazılım Geliştirici", count: "3" },
      { code: "5678", name: "Muhasebeci", count: "2" },
    ],
    additionalServices: [
      { service: "İş Sağlığı ve Güvenliği", unit: "Aylık", price: "2500" },
      { service: "Araç Kiralama", unit: "Kişi Başı", price: "3000" },
    ],
  },
  {
    id: "4",
    companyName: "DEF Limited",
    taxId: "9876543210",
    city: "Bursa",
    district: "Nilüfer",
    address: "Bursa, Türkiye",
    contactName: "Ali Yıldız",
    contactPhone: "0532 444 5566",
    contactEmail: "ali@deflimited.com",
    type: "preregistered",
    sozlesmeTipi: "danismanlik", // danışmanlık
    sector: "1", // Bilişim
    selectedProfessionCodes: [{ code: "9012", name: "İnsan Kaynakları Uzmanı", count: "1" }],
    additionalServices: [{ service: "Eğitim Hizmetleri", unit: "Aylık", price: "5000" }],
  },
]

