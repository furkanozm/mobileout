"use client"

import type React from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface IOSAlertProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
  confirmText: string
  confirmVariant?: "default" | "destructive"
  cancelText?: string
  showCancel?: boolean
}

export function IOSAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = "default",
  cancelText = "İptal",
  showCancel = true,
}: IOSAlertProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="rounded-2xl p-0 overflow-hidden w-[280px] font-inter">
        <div className="p-4 text-center space-y-2">
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {message}
          </AlertDialogDescription>
        </div>
        <div className={`border-t ${showCancel ? "divide-x grid grid-cols-2" : ""}`}>
          {showCancel && (
            <Button
              variant="ghost"
              className="h-12 rounded-none text-base font-normal hover:bg-zinc-50"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant={confirmVariant}
            className={`h-12 rounded-none text-base font-semibold ${
              confirmVariant === "destructive"
                ? "hover:bg-red-50 bg-transparent text-red-500"
                : "hover:bg-blue-50 bg-transparent text-blue-500"
            } ${!showCancel ? "w-full" : ""}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

