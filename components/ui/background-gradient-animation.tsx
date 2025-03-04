"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function BackgroundGradientAnimation({
  className,
  containerClassName,
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  interactive = true,
  containerRef,
}: {
  className?: string
  containerClassName?: string
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  children?: React.ReactNode
  interactive?: boolean
  containerRef?: React.RefObject<HTMLDivElement>
}) {
  const interactiveRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorMoving, setCursorMoving] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const animationRef = useRef<number>()

  const handleMouseMove = (e: MouseEvent) => {
    if (!interactiveRef.current) return
    const rect = interactiveRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCursorPosition({ x, y })
    setCursorMoving(true)
    clearTimeout(animationRef.current)
    animationRef.current = window.setTimeout(() => {
      setCursorMoving(false)
    }, 500)
  }

  useEffect(() => {
    if (!interactive) return

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(animationRef.current)
    }
  }, [interactive])

  useEffect(() => {
    // Cycle through the blobs
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn("h-full w-full overflow-hidden top-0 left-0 absolute z-0", containerClassName)}
      ref={containerRef || interactiveRef}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: `linear-gradient(to bottom right, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      />

      <div className={cn("h-full w-full", className)}>
        {/* First Blob */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: activeIndex === 0 ? [0.3, 0.6, 0.3] : [0.3, 0.2, 0.3],
            filter: activeIndex === 0 ? ["blur(40px)", "blur(30px)", "blur(40px)"] : ["blur(40px)"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-[calc(50%-200px)] left-[calc(50%-300px)] h-[400px] w-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0%, rgba(${firstColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
          }}
        />

        {/* Second Blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: activeIndex === 1 ? [0.3, 0.6, 0.3] : [0.3, 0.2, 0.3],
            filter: activeIndex === 1 ? ["blur(40px)", "blur(30px)", "blur(40px)"] : ["blur(40px)"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-[calc(50%-150px)] left-[calc(50%+100px)] h-[300px] w-[300px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0%, rgba(${secondColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
          }}
        />

        {/* Third Blob */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: activeIndex === 2 ? [0.3, 0.6, 0.3] : [0.3, 0.2, 0.3],
            filter: activeIndex === 2 ? ["blur(40px)", "blur(30px)", "blur(40px)"] : ["blur(40px)"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[calc(50%+100px)] left-[calc(50%-200px)] h-[250px] w-[350px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0%, rgba(${thirdColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
          }}
        />

        {/* Fourth Blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: activeIndex === 3 ? [0.3, 0.6, 0.3] : [0.3, 0.2, 0.3],
            filter: activeIndex === 3 ? ["blur(40px)", "blur(30px)", "blur(40px)"] : ["blur(40px)"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-[calc(50%-300px)] left-[calc(50%+100px)] h-[270px] w-[300px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${fourthColor}, 0.8) 0%, rgba(${fourthColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
          }}
        />

        {/* Fifth Blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: activeIndex === 4 ? [0.3, 0.6, 0.3] : [0.3, 0.2, 0.3],
            filter: activeIndex === 4 ? ["blur(40px)", "blur(30px)", "blur(40px)"] : ["blur(40px)"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[calc(50%+50px)] left-[calc(50%+150px)] h-[200px] w-[200px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${fifthColor}, 0.8) 0%, rgba(${fifthColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
          }}
        />

        {/* Interactive cursor blob */}
        {interactive && (
          <motion.div
            animate={{
              x: cursorPosition.x - 150,
              y: cursorPosition.y - 150,
              scale: cursorMoving ? 1 : 0.8,
              opacity: cursorMoving ? 0.6 : 0.4,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              mass: 0.5,
            }}
            className="absolute h-[300px] w-[300px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.8) 0%, rgba(${pointerColor}, 0) 70%)`,
              mixBlendMode: blendingValue,
              filter: "blur(40px)",
            }}
          />
        )}
      </div>
      {children}
    </div>
  )
}

