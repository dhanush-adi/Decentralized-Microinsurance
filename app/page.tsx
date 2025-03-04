"use client"

import Link from "next/link"
import { ArrowRight, Shield, FileCheck, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { FloatingParticles } from "@/components/ui/floating-particles"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <BackgroundGradientAnimation />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Blockchain-Based Microinsurance
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Secure, transparent, and efficient insurance policies powered by blockchain technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/50"
                >
                  <Link href="/buy-policy">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-2 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300"
                >
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto lg:ml-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-xl overflow-hidden border bg-background/80 backdrop-blur-sm p-8 shadow-xl">
                <div className="flex flex-col space-y-4">
                  <div className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-3 w-16 h-16 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Instant Coverage</h3>
                  <p className="text-muted-foreground">
                    Get insured in minutes with our blockchain-powered policies. Transparent, secure, and efficient.
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link href="/buy-policy">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Floating Particles */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background relative overflow-hidden">
        <FloatingParticles />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Key Features
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers a range of features to make insurance accessible, transparent, and efficient.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Buy Policy",
                description: "Purchase customizable insurance policies with transparent terms and conditions.",
                color: "from-purple-500 to-indigo-500",
                delay: 0,
              },
              {
                icon: FileCheck,
                title: "File Claim",
                description: "Submit and track claims with our streamlined blockchain-based process.",
                color: "from-indigo-500 to-blue-500",
                delay: 0.2,
              },
              {
                icon: BarChart3,
                title: "Dashboard",
                description: "Monitor your policies and claims in real-time with our interactive dashboard.",
                color: "from-blue-500 to-cyan-500",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl border bg-background p-6 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:translate-y-[-5px]">
                  <div className="flex flex-col gap-4">
                    <div
                      className={`rounded-full bg-gradient-to-r ${feature.color} p-3 w-14 h-14 flex items-center justify-center`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-indigo-50 dark:from-background dark:to-indigo-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                How It Works
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our blockchain-based insurance platform simplifies the entire process from policy purchase to claim
                settlement.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700 rounded-full hidden md:block"></div>

            {/* Steps */}
            <div className="space-y-16 relative">
              {[
                {
                  title: "Connect Your Wallet",
                  description:
                    "Link your cryptocurrency wallet to our platform to enable secure blockchain transactions.",
                  align: "right",
                  icon: "💼",
                  delay: 0,
                },
                {
                  title: "Choose Your Coverage",
                  description: "Select the coverage amount, duration, and premium that best suits your needs.",
                  align: "left",
                  icon: "🛡️",
                  delay: 0.2,
                },
                {
                  title: "Purchase Policy",
                  description:
                    "Complete your purchase with a single transaction. Your policy is instantly recorded on the blockchain.",
                  align: "right",
                  icon: "📝",
                  delay: 0.4,
                },
                {
                  title: "File Claims Easily",
                  description: "If needed, submit claims directly through our platform with minimal paperwork.",
                  align: "left",
                  icon: "✅",
                  delay: 0.6,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${step.align === "left" ? "md:flex-row-reverse text-right" : "text-left"}`}
                  initial={{ opacity: 0, x: step.align === "left" ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: step.delay }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 flex flex-col gap-4">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  <div className="md:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl z-10 relative shadow-lg">
                        {step.icon}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-indigo-200 dark:bg-indigo-800 blur-lg opacity-50"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <motion.div
              className="space-y-4 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Get Started?
              </h2>
              <p className="text-indigo-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our platform today and experience the future of insurance. Secure, transparent, and efficient.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col gap-4 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg shadow-indigo-800/30"
              >
                <Link href="/buy-policy">
                  Buy Policy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-2 border-white text-white hover:bg-white/10"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                What Our Users Say
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from people who have experienced the benefits of our blockchain-based insurance platform.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "The transparency of blockchain insurance gives me peace of mind. I can see exactly what I'm covered for.",
                name: "Alex Johnson",
                role: "Small Business Owner",
                delay: 0,
              },
              {
                quote:
                  "Filing a claim was incredibly easy. The process was quick and I received my payout within days.",
                name: "Sarah Williams",
                role: "Freelance Designer",
                delay: 0.2,
              },
              {
                quote:
                  "As someone who values security, I appreciate how the blockchain ensures my policy details can't be altered.",
                name: "Michael Chen",
                role: "Software Developer",
                delay: 0.4,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="rounded-xl border bg-background p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 w-12 h-12 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

