import { ChevronLeft, Globe, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChangelogPageProps {
  onBack: () => void
  timesheetId: string
}

// Update interface
interface ApprovalStep {
  approver: string
  approvalTime: string
}

// Update mock data
const MOCK_APPROVAL_STEPS: ApprovalStep[] = [
  { approver: "Ahmet Yılmaz", approvalTime: "15.02.2024 14:30" },
  { approver: "Mehmet Demir", approvalTime: "15.02.2024 16:45" },
  { approver: "Ayşe Kaya", approvalTime: "15.02.2024 18:20" },
]

export function ChangelogPage({ onBack, timesheetId }: ChangelogPageProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-4">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">OutsourceHub</span>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">Puantaj ID: {timesheetId}</div>
            <h1 className="text-blue-600 mt-2">Onay Geçmişi</h1>
          </div>

          <div className="space-y-6 mt-6">
            {MOCK_APPROVAL_STEPS.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-medium">{step.approver}</h3>
                  <p className="text-sm text-gray-500 mt-1">Onay Zamanı: {step.approvalTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="p-4 border-t">
        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white" onClick={onBack}>
          <ClipboardList className="h-5 w-5 mr-2" />
          Puantaja Dön
        </Button>
      </div>
    </div>
  )
}

