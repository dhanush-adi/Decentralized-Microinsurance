"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FileCheck, AlertCircle, Info, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button"
import { TransactionStatus } from "@/components/ui/transaction-status"
import { useStore } from "@/lib/store"
import { callFileClaim } from "@/lib/utils/blockchain"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FileClaimPage() {
  const router = useRouter()
  const { isConnected, transactionStatus, setTransactionStatus, policies } = useStore()
  const [formData, setFormData] = useState({
    policyId: "",
    claimAmount: "",
    claimDescription: "",
    evidenceDescription: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setEvidenceFiles((prev) => [...prev, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileClaim = async (e: React.FormEvent) => {
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
        message: "Filing your claim on the blockchain...",
      })

      // Convert string values to appropriate types for the blockchain call
      const policyId = formData.policyId
      const claimAmount = Number.parseFloat(formData.claimAmount)
      const claimDescription = formData.claimDescription

      // Call blockchain function
      const result = await callFileClaim(policyId, claimAmount, claimDescription)

      setTransactionStatus({
        status: "success",
        message: "Claim filed successfully!",
        txHash: result.txHash,
        claimId: result.claimId,
      })

      // Redirect to dashboard after successful claim filing
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error filing claim:", error)
      setTransactionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to file claim",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectPolicy = (policyId: string) => {
    setFormData((prev) => ({ ...prev, policyId }))
  }

  return (
    <div className="relative min-h-screen py-12">
      <BackgroundGradientAnimation className="opacity-50" />
      <div className="container max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-3 w-16 h-16 flex items-center justify-center">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              File Insurance Claim
            </h1>
            <p className="text-muted-foreground max-w-[600px]">Submit a claim for your existing insurance policy.</p>
          </div>

          {!isConnected && (
            <Alert className="mb-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-600 dark:text-blue-400">Wallet not connected</AlertTitle>
              <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
                Please connect your wallet to file a claim.
                <div className="mt-4">
                  <ConnectWalletButton />
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-2 border-blue-100 dark:border-blue-800/50 shadow-xl bg-white/80 dark:bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-blue-100 dark:border-blue-800/50">
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                Claim Details
              </CardTitle>
              <CardDescription>Enter the details of your insurance claim</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="manual">Enter Policy ID</TabsTrigger>
                  <TabsTrigger value="select" disabled={policies.length === 0}>
                    Select from Policies
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual">
                  <form onSubmit={handleFileClaim} className="space-y-8">
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="policyId" className="text-base font-medium">
                            Policy ID
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Policy ID info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">The unique identifier of your insurance policy.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="policyId"
                          name="policyId"
                          placeholder="Enter your policy ID"
                          value={formData.policyId}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-blue-100 dark:border-blue-800/50 focus-visible:ring-blue-500"
                        />
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="claimAmount" className="text-base font-medium">
                            Claim Amount (ETH)
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Claim amount info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">The amount you are claiming from your policy.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="claimAmount"
                            name="claimAmount"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 0.2"
                            value={formData.claimAmount}
                            onChange={handleInputChange}
                            required
                            className="border-2 border-blue-100 dark:border-blue-800/50 focus-visible:ring-blue-500"
                          />
                          <div className="bg-blue-100 dark:bg-blue-800/30 px-3 py-2 rounded-md text-blue-600 dark:text-blue-400 font-medium">
                            ETH
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="claimDescription" className="text-base font-medium">
                            Claim Description
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Claim description info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Describe the reason for your claim in detail.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea
                          id="claimDescription"
                          name="claimDescription"
                          placeholder="Describe the reason for your claim"
                          value={formData.claimDescription}
                          onChange={handleInputChange}
                          rows={4}
                          required
                          className="border-2 border-blue-100 dark:border-blue-800/50 focus-visible:ring-blue-500"
                        />
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="evidenceFiles" className="text-base font-medium">
                            Supporting Evidence (Optional)
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Evidence files info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Upload any files that support your claim (photos, documents, etc.).
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="border-2 border-dashed border-blue-100 dark:border-blue-800/50 rounded-lg p-4 text-center">
                          <Input
                            id="evidenceFiles"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Label
                            htmlFor="evidenceFiles"
                            className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4"
                          >
                            <Upload className="h-8 w-8 text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Click to upload files</span>
                            <span className="text-sm text-muted-foreground">or drag and drop</span>
                          </Label>
                        </div>

                        {evidenceFiles.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <Label className="text-sm font-medium">Uploaded Files</Label>
                            <div className="space-y-2">
                              {evidenceFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md"
                                >
                                  <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0 text-red-500"
                                  >
                                    &times;
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/50"
                        disabled={isSubmitting || !isConnected}
                      >
                        {isSubmitting ? "Processing..." : "File Claim"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="select">
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <Label className="text-base font-medium">Select a Policy</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        {policies.map((policy) => (
                          <div
                            key={policy.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              formData.policyId === policy.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-blue-100 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700"
                            }`}
                            onClick={() => selectPolicy(policy.id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">Policy #{policy.id.substring(0, 8)}</h4>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  policy.isActive
                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {policy.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Coverage:</span>
                                <span className="ml-1 font-medium">{policy.coverageAmount} ETH</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Expires:</span>
                                <span className="ml-1 font-medium">
                                  {new Date(policy.expiryDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {formData.policyId && (
                      <form onSubmit={handleFileClaim} className="space-y-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="claimAmount" className="text-base font-medium">
                              Claim Amount (ETH)
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">Claim amount info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">The amount you are claiming from your policy.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Input
                              id="claimAmount"
                              name="claimAmount"
                              type="number"
                              step="0.01"
                              placeholder="e.g., 0.2"
                              value={formData.claimAmount}
                              onChange={handleInputChange}
                              required
                              className="border-2 border-blue-100 dark:border-blue-800/50 focus-visible:ring-blue-500"
                            />
                            <div className="bg-blue-100 dark:bg-blue-800/30 px-3 py-2 rounded-md text-blue-600 dark:text-blue-400 font-medium">
                              ETH
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="claimDescription" className="text-base font-medium">
                              Claim Description
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">Claim description info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Describe the reason for your claim in detail.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Textarea
                            id="claimDescription"
                            name="claimDescription"
                            placeholder="Describe the reason for your claim"
                            value={formData.claimDescription}
                            onChange={handleInputChange}
                            rows={4}
                            required
                            className="border-2 border-blue-100 dark:border-blue-800/50 focus-visible:ring-blue-500"
                          />
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/50"
                            disabled={isSubmitting || !isConnected}
                          >
                            {isSubmitting ? "Processing..." : "File Claim"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col pt-6 border-t border-blue-100 dark:border-blue-800/50">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 w-full">
                <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Important Information</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>All claims are subject to verification by our smart contract.</li>
                  <li>Provide accurate information to avoid delays in processing.</li>
                  <li>Claims are typically processed within 24-48 hours.</li>
                </ul>
              </div>
            </CardFooter>
          </Card>

          <TransactionStatus />
        </motion.div>
      </div>
    </div>
  )
}

