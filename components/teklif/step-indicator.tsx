import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between px-4 py-2 bg-white border-b">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number

        return (
          <div key={step.number} className="flex flex-col items-center relative flex-1">
            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute w-full top-4 left-[calc(50%+12px)] h-[2px] -translate-y-1/2",
                  isCompleted ? "bg-green-500" : "bg-gray-200",
                )}
              />
            )}

            {/* Circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 relative z-10 bg-white",
                isCompleted && "border-green-500 bg-green-500",
                isCurrent && "border-blue-600",
                !isCompleted && !isCurrent && "border-gray-200",
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span className={cn("text-xs font-medium", isCurrent ? "text-blue-600" : "text-gray-400")}>
                  {step.number}
                </span>
              )}
            </div>

            {/* Title */}
            <span
              className={cn(
                "text-xs",
                isCompleted && "text-green-600",
                isCurrent && "text-blue-600 font-medium",
                !isCompleted && !isCurrent && "text-gray-400",
              )}
            >
              {step.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}

