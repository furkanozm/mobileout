"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface IOSActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function IOSActionSheet({ isOpen, onClose, title, children, className }: IOSActionSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "absolute bottom-0 left-0 right-0 z-50 bg-gray-50 rounded-t-[20px] overflow-hidden pb-12",
              className,
            )}
          >
            <div className="p-6 space-y-6">
              {title && (
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ActionSheetButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full p-4 text-center text-sm font-medium bg-white active:bg-gray-100 first:rounded-t-xl last:rounded-b-xl border border-gray-200 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ActionSheetButtonGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md">{children}</div>
  )
}

export function ActionSheetContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 mb-4 space-y-1 text-center text-gray-600">{children}</div>
}

