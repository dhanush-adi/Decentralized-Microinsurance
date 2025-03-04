"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, isInView])

  // Generate random particles
  const particles: Particle[] = []
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 2,
      color: [
        "rgba(99, 102, 241, 0.2)", // indigo
        "rgba(168, 85, 247, 0.2)", // purple
        "rgba(236, 72, 153, 0.2)", // pink
        "rgba(59, 130, 246, 0.2)", // blue
        "rgba(14, 165, 233, 0.2)", // cyan
      ][Math.floor(Math.random() * 5)],
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 10,
    })
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
          }}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: [0, 1, 0.5, 0],
              y: [20, -20, -40, -60],
              x: index % 2 === 0 ? [0, 20, 0, -20] : [0, -20, 0, 20],
              transition: {
                delay: particle.delay,
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            },
          }}
        />
      ))}
    </div>
  )
}

