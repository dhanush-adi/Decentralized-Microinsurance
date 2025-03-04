"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Shield, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button"
import { TransactionStatus } from "@/components/ui/transaction-status"
import { useStore } from "@/lib/store"
import { callCreatePolicy } from "@/lib/utils/blockchain"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { Slider } from "@/components/ui/slider"

export default function BuyPolicyPage() {
  const router = useRouter()
  const { isConnected, transactionStatus, setTransactionStatus } = useStore()
  const [formData, setFormData] = useState({
    coverageAmount: "0.5",
    policyDuration: "30",
    premiumAmount: "0.05",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0].toString() }))
  }

  const handleBuyPolicy = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      setTransactionStatus({
        status: "error",
        message: "Please connect your wallet first",
      })
      return
    }

    try {
      setIsSubmitting(true)
      setTransactionStatus({
        status: "pending",
        message: "Creating your policy on the blockchain...",
      })

      // Convert string values to appropriate types for the blockchain call
      const coverageAmount = Number.parseFloat(formData.coverageAmount)
      const policyDuration = Number.parseInt(formData.policyDuration)
      const premiumAmount = Number.parseFloat(formData.premiumAmount)

      // Call blockchain function
      const result = await callCreatePolicy(coverageAmount, policyDuration, premiumAmount)

      setTransactionStatus({
        status: "success",
        message: "Policy created successfully!",
        txHash: result.txHash,
        policyId: result.policyId,
      })

      // Redirect to dashboard after successful policy creation
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error creating policy:", error)
      setTransactionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to create policy",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen py-12">
      <BackgroundGradientAnimation className="opacity-50" />
      <div className="container max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-3 w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Buy Insurance Policy
            </h1>
            <p className="text-muted-foreground max-w-[600px]">
              Create a new insurance policy by specifying your coverage details below.
            </p>
          </div>

          {!isConnected && (
            <Alert className="mb-8 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50">
              <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <AlertTitle className="text-indigo-600 dark:text-indigo-400">Wallet not connected</AlertTitle>
              <AlertDescription className="text-indigo-600/90 dark:text-indigo-400/90">
                Please connect your wallet to buy a policy.
                <div className="mt-4">
                  <ConnectWalletButton />
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 shadow-xl bg-white/80 dark:bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-indigo-100 dark:border-indigo-800/50">
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Policy Details
              </CardTitle>
              <CardDescription>Enter the details of your insurance policy</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleBuyPolicy} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="coverageAmount" className="text-base font-medium">
                        Coverage Amount (ETH)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Coverage amount info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The maximum amount that can be claimed in case of an incident.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0.5]}
                        max={5}
                        min={0.1}
                        step={0.1}
                        onValueChange={(value) => handleSliderChange("coverageAmount", value)}
                        className="py-2"
                      />
                      <div className="flex items-center space-x-4">
                        <Input
                          id="coverageAmount"
                          name="coverageAmount"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 0.5"
                          value={formData.coverageAmount}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-indigo-100 dark:border-indigo-800/50 focus-visible:ring-indigo-500"
                        />
                        <div className="bg-indigo-100 dark:bg-indigo-800/30 px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 font-medium">
                          ETH
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="policyDuration" className="text-base font-medium">
                        Policy Duration (Days)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Policy duration info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The number of days your policy will be active.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[30]}
                        max={365}
                        min={7}
                        step={1}
                        onValueChange={(value) => handleSliderChange("policyDuration", value)}
                        className="py-2"
                      />
                      <div className="flex items-center space-x-4">
                        <Input
                          id="policyDuration"
                          name="policyDuration"
                          type="number"
                          placeholder="e.g., 30"
                          value={formData.policyDuration}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-indigo-100 dark:border-indigo-800/50 focus-visible:ring-indigo-500"
                        />
                        <div className="bg-indigo-100 dark:bg-indigo-800/30 px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 font-medium">
                          Days
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="premiumAmount" className="text-base font-medium">
                        Premium Amount (ETH)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Premium amount info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The amount you pay for the insurance coverage.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0.05]}
                        max={1}
                        min={0.01}
                        step={0.01}
                        onValueChange={(value) => handleSliderChange("premiumAmount", value)}
                        className="py-2"
                      />
                      <div className="flex items-center space-x-4">
                        <Input
                          id="premiumAmount"
                          name="premiumAmount"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 0.05"
                          value={formData.premiumAmount}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-indigo-100 dark:border-indigo-800/50 focus-visible:ring-indigo-500"
                        />
                        <div className="bg-indigo-100 dark:bg-indigo-800/30 px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 font-medium">
                          ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/50"
                    disabled={isSubmitting || !isConnected}
                  >
                    {isSubmitting ? "Processing..." : "Buy Policy"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col pt-6 border-t border-indigo-100 dark:border-indigo-800/50">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-4 w-full">
                <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Policy Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {formData.coverageAmount} ETH
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Premium</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {formData.premiumAmount} ETH
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {formData.policyDuration} days
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Expiry</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {new Date(
                        Date.now() + Number.parseInt(formData.policyDuration) * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                By purchasing a policy, you agree to our terms and conditions.
              </p>
            </CardFooter>
          </Card>

          <TransactionStatus />
        </motion.div>
      </div>
    </div>
  )
}

