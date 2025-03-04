"use client"

import { useState } from "react"
import { Wallet, ChevronDown, LogOut, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { connectToBlockchain } from "@/lib/utils/blockchain"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConnectWalletButton() {
  const { isConnected, setIsConnected, walletAddress, setWalletAddress } = useStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect wallet
      setIsConnected(false)
      setWalletAddress("")
      return
    }

    try {
      setIsConnecting(true)
      const { address } = await connectToBlockchain()
      setWalletAddress(address)
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/50"
      >
        {isConnecting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2"
            >
              <Wallet className="h-4 w-4" />
            </motion.div>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300"
        >
          <Wallet className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-indigo-600 dark:text-indigo-400">
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-xs font-medium text-muted-foreground">Connected as</p>
          <p className="text-sm font-medium truncate">{walletAddress}</p>
        </div>
        <DropdownMenuSeparator />
        <TooltipProvider>
          <Tooltip open={copied}>
            <TooltipTrigger asChild>
              <DropdownMenuItem onClick={copyAddress}>
                {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy Address"}</span>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Address copied!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuItem onClick={handleConnect}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

