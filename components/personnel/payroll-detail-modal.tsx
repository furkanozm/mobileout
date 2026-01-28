import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PayrollItem {
  id: number
  month: string
  year: number
  amount: number
  missingDays: number
  grossSalary: number
  netSalary: number
  incomeTax: number
  socialSecurityPremium: number
}

interface PayrollDetailModalProps {
  payroll: PayrollItem
  onClose: () => void
}

export function PayrollDetailModal({ payroll, onClose }: PayrollDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-md rounded-lg overflow-hidden shadow-xl">
        <div className="bg-blue-500 px-4 py-3 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white">
            {payroll.month} {payroll.year} Bordro Detayı
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-600">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <DetailItem label="Brüt Maaş" value={payroll.grossSalary} />
            <DetailItem label="Net Maaş" value={payroll.netSalary} />
            <DetailItem label="Gelir Vergisi" value={payroll.incomeTax} />
            <DetailItem label="SGK Primi" value={payroll.socialSecurityPremium} />
            <DetailItem label="Eksik Gün" value={payroll.missingDays} unit="gün" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value, unit = "₺" }: { label: string; value: number; unit?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">
        {unit === "₺" ? value.toLocaleString("tr-TR") : value} {unit}
      </span>
    </div>
  )
}

