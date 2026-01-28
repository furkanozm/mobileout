import type React from "react"

interface FormCardProps {
  title: string
  children: React.ReactNode
}

export function FormCard({ title, children }: FormCardProps) {
  return (
    <>
      <h3 className="text-lg font-medium mb-4 text-gray-800">{title}</h3>
      {children}
    </>
  )
}

