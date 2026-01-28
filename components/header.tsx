"use client"

import type React from "react"

interface HeaderProps {
  title: string
  onBackClick?: () => void
  rightContent?: React.ReactNode
}

// Update the header to handle long titles with nowrap and truncate
export function Header({
  title,
  onBackClick,
  rightContent,
}: {
  title: string
  onBackClick?: () => void
  rightContent?: React.ReactNode
}) {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mr-2 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="font-semibold text-lg truncate whitespace-nowrap max-w-[200px]">{title}</h1>
      </div>
      {rightContent}
    </div>
  )
}

