import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:h-3.5 [&>svg]:w-3.5",
  {
    variants: {
      variant: {
        default: "border-blue-700 bg-blue-100 text-blue-800 hover:bg-blue-200",
        secondary: "border-purple-700 bg-purple-100 text-purple-800 hover:bg-purple-200",
        destructive: "border-red-700 bg-red-100 text-red-800 hover:bg-red-200",
        outline: "border-gray-600 text-gray-800 bg-gray-50 hover:bg-gray-100",
        success: "border-green-700 bg-green-100 text-green-800 hover:bg-green-200",
        blue: "border-blue-700 bg-blue-100 text-blue-800 hover:bg-blue-200",
        pending: "border-orange-700 bg-orange-100 text-orange-800 hover:bg-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

