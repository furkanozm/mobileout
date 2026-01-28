import { Info } from "lucide-react"

interface InfoBoxProps {
  message: string
  type?: "info" | "warning"
}

export function InfoBox({ message, type = "warning" }: InfoBoxProps) {
  const isWarning = type === "warning"

  return (
    <div
      className={`p-3 border-2 rounded-md flex items-start gap-2 mt-2 ${
        isWarning ? "border-amber-400 bg-amber-50" : "border-blue-200 bg-blue-50"
      }`}
    >
      <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isWarning ? "text-amber-500" : "text-blue-500"}`} />
      <p className={`text-sm ${isWarning ? "text-amber-700" : "text-blue-700"}`}>{message}</p>
    </div>
  )
}

