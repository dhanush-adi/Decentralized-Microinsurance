"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStore } from "@/lib/store"

export function TransactionStatus() {
  const { transactionStatus, setTransactionStatus } = useStore()

  // Auto-hide success/error messages after 5 seconds
  useEffect(() => {
    if (transactionStatus && (transactionStatus.status === "success" || transactionStatus.status === "error")) {
      const timer = setTimeout(() => {
        setTransactionStatus(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [transactionStatus, setTransactionStatus])

  if (!transactionStatus) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50 max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <Alert
          variant={
            transactionStatus.status === "success"
              ? "default"
              : transactionStatus.status === "error"
                ? "destructive"
                : "outline"
          }
        >
          {transactionStatus.status === "success" && <CheckCircle className="h-4 w-4" />}
          {transactionStatus.status === "error" && <XCircle className="h-4 w-4" />}
          {transactionStatus.status === "pending" && <Loader2 className="h-4 w-4 animate-spin" />}
          <AlertTitle>
            {transactionStatus.status === "success" && "Success"}
            {transactionStatus.status === "error" && "Error"}
            {transactionStatus.status === "pending" && "Processing"}
          </AlertTitle>
          <AlertDescription>
            {transactionStatus.message}
            {transactionStatus.txHash && (
              <div className="mt-2 text-xs">
                <a
                  href={`https://sepolia.scrollscan.dev/tx/${transactionStatus.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  View transaction
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}

