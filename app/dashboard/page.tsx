"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { BarChart3, Shield, FileCheck, AlertCircle, Plus, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button"
import { useStore } from "@/lib/store"
import { listenForEvents } from "@/lib/utils/blockchain"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { isConnected, policies, claims } = useStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    if (isConnected) {
      // Start listening for blockchain events when wallet is connected
      const unsubscribe = listenForEvents()

      // Cleanup function to stop listening when component unmounts
      return () => {
        unsubscribe()
      }
    }
  }, [isConnected])

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateCards(true)
  }, [])

  if (!isConnected) {
    return (
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Alert className="border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50">
            <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <AlertTitle className="text-indigo-600 dark:text-indigo-400">Wallet not connected</AlertTitle>
            <AlertDescription className="text-indigo-600/90 dark:text-indigo-400/90">
              Please connect your wallet to view your dashboard.
              <div className="mt-4">
                <ConnectWalletButton />
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  // Calculate dashboard statistics
  const totalPolicies = policies.length
  const activePolicies = policies.filter((p) => p.isActive).length
  const totalClaims = claims.length
  const pendingClaims = claims.filter((c) => c.status === "Pending").length
  const totalCoverage = policies.reduce((sum, policy) => sum + policy.coverageAmount, 0)
  const totalPremium = policies.reduce((sum, policy) => sum + policy.premiumAmount, 0)

  return (
    <div className="relative min-h-screen">
      <BackgroundGradientAnimation className="opacity-30" />
      <div className="container py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 w-16 h-16 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground max-w-[600px]">View and manage your insurance policies and claims.</p>
          </div>

          <div className="grid gap-8">
            {/* Dashboard Actions */}
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/50"
              >
                <Link href="/buy-policy">
                  <Plus className="mr-2 h-4 w-4" />
                  New Policy
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300"
              >
                <Link href="/file-claim">
                  <FileCheck className="mr-2 h-4 w-4" />
                  File Claim
                </Link>
              </Button>
            </div>

            {/* Dashboard Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Policies",
                  value: totalPolicies,
                  icon: Shield,
                  color: "from-indigo-500 to-blue-500",
                  delay: 0,
                },
                {
                  title: "Active Policies",
                  value: activePolicies,
                  icon: CheckCircle,
                  color: "from-green-500 to-emerald-500",
                  delay: 0.1,
                },
                {
                  title: "Total Claims",
                  value: totalClaims,
                  icon: FileCheck,
                  color: "from-blue-500 to-cyan-500",
                  delay: 0.2,
                },
                {
                  title: "Pending Claims",
                  value: pendingClaims,
                  icon: Clock,
                  color: "from-amber-500 to-orange-500",
                  delay: 0.3,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={animateCards ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: stat.delay }}
                >
                  <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        <div
                          className={`rounded-full bg-gradient-to-r ${stat.color} p-3 w-12 h-12 flex items-center justify-center`}
                        >
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Coverage Summary */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Coverage Summary
                  </CardTitle>
                  <CardDescription>Overview of your insurance coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Coverage</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {totalCoverage.toFixed(2)} ETH
                        </span>
                      </div>
                      <Progress
                        value={(totalCoverage / (totalCoverage + 1)) * 100}
                        className="h-2 bg-indigo-100 dark:bg-indigo-800/30"
                        indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Premium</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {totalPremium.toFixed(2)} ETH
                        </span>
                      </div>
                      <Progress
                        value={(totalPremium / (totalCoverage * 0.2)) * 100}
                        className="h-2 bg-indigo-100 dark:bg-indigo-800/30"
                        indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                    <div className="pt-2 mt-4 border-t border-indigo-100 dark:border-indigo-800/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Active Rate</p>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {totalPolicies > 0 ? Math.round((activePolicies / totalPolicies) * 100) : 0}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Claim Rate</p>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {totalPolicies > 0 ? Math.round((totalClaims / totalPolicies) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest insurance activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...policies, ...claims]
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .slice(0, 4)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-800/50 last:border-0 last:pb-0"
                        >
                          <div
                            className={`rounded-full p-2 ${
                              "id" in item && "policyId" in item
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            }`}
                          >
                            {"id" in item && "policyId" in item ? (
                              <FileCheck className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              {"id" in item && "policyId" in item
                                ? `Claim Filed: #${item.id.substring(0, 8)}`
                                : `Policy Created: #${item.id.substring(0, 8)}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                          {"id" in item && "policyId" in item && (
                            <Badge
                              variant={
                                item.status === "Approved"
                                  ? "default"
                                  : item.status === "Pending"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {item.status}
                            </Badge>
                          )}
                          {"isActive" in item && (
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </div>
                      ))}

                    {[...policies, ...claims].length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No activity yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={policies.length > 0 ? "/file-claim" : "/buy-policy"}>
                      {policies.length > 0 ? "File a New Claim" : "Buy Your First Policy"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Detailed Tabs */}
            <Tabs defaultValue="policies" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-indigo-50 dark:bg-indigo-900/20 p-1 rounded-lg">
                <TabsTrigger
                  value="policies"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md"
                >
                  Policies
                </TabsTrigger>
                <TabsTrigger
                  value="claims"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md"
                >
                  Claims
                </TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="mt-6">
                {policies.length === 0 ? (
                  <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                    <CardContent className="pt-6 text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-16 h-16 flex items-center justify-center">
                          <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-medium">No Active Policies</h3>
                        <p className="text-muted-foreground max-w-md">
                          You don't have any active insurance policies yet. Get started by purchasing your first policy.
                        </p>
                        <Button
                          asChild
                          className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                          <Link href="/buy-policy">Buy Your First Policy</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence>
                      {policies.map((policy, index) => (
                        <motion.div
                          key={policy.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Policy #{policy.id.substring(0, 8)}</CardTitle>
                                <Badge
                                  variant={policy.isActive ? "default" : "secondary"}
                                  className={policy.isActive ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}
                                >
                                  {policy.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <CardDescription>
                                Created on {new Date(policy.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                  <span className="text-muted-foreground">Coverage</span>
                                  <span className="font-medium text-lg text-indigo-600 dark:text-indigo-400">
                                    {policy.coverageAmount} ETH
                                  </span>
                                </div>
                                <div className="flex flex-col p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                  <span className="text-muted-foreground">Premium</span>
                                  <span className="font-medium text-lg text-indigo-600 dark:text-indigo-400">
                                    {policy.premiumAmount} ETH
                                  </span>
                                </div>
                                <div className="flex flex-col p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium text-lg text-indigo-600 dark:text-indigo-400">
                                    {policy.policyDuration} days
                                  </span>
                                </div>
                                <div className="flex flex-col p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                  <span className="text-muted-foreground">Expiry</span>
                                  <span className="font-medium text-lg text-indigo-600 dark:text-indigo-400">
                                    {new Date(policy.expiryDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="w-full border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              >
                                <Link href={`/file-claim?policyId=${policy.id}`}>
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  File Claim
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="claims" className="mt-6">
                {claims.length === 0 ? (
                  <Card className="border-2 border-indigo-100 dark:border-indigo-800/50 bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                    <CardContent className="pt-6 text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-16 h-16 flex items-center justify-center">
                          <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-medium">No Claims Filed</h3>
                        <p className="text-muted-foreground max-w-md">
                          You haven't filed any claims yet. If you need to make a claim on your policy, you can do so
                          easily.
                        </p>
                        <Button
                          asChild
                          className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                        >
                          <Link href="/file-claim">File Your First Claim</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence>
                      {claims.map((claim, index) => (
                        <motion.div
                          key={claim.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-blue-100 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Claim #{claim.id.substring(0, 8)}</CardTitle>
                                <Badge
                                  variant={
                                    claim.status === "Approved"
                                      ? "default"
                                      : claim.status === "Pending"
                                        ? "outline"
                                        : "secondary"
                                  }
                                  className={
                                    claim.status === "Approved"
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                      : claim.status === "Pending"
                                        ? "border-amber-500 text-amber-500"
                                        : ""
                                  }
                                >
                                  {claim.status}
                                </Badge>
                              </div>
                              <CardDescription>
                                Filed on {new Date(claim.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex flex-col p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-muted-foreground">Policy ID</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                      #{claim.policyId.substring(0, 8)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-medium text-lg text-blue-600 dark:text-blue-400">
                                      {claim.claimAmount} ETH
                                    </span>
                                  </div>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <span className="text-muted-foreground">Description</span>
                                  <p className="font-medium text-blue-600 dark:text-blue-400 mt-1">
                                    {claim.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <div className="text-sm text-muted-foreground">
                                {claim.status === "Pending" ? (
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-amber-500" />
                                    <span>Processing</span>
                                  </div>
                                ) : claim.status === "Approved" ? (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    <span>Approved</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    <span>Rejected</span>
                                  </div>
                                )}
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard?claimId=${claim.id}`}>View Details</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

