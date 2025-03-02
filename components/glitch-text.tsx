"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  children: React.ReactNode
  className?: string
  enabled?: boolean
  intensity?: number // 1-10 scale
}

export function GlitchText({ children, className, enabled = true, intensity = 5 }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [offset1, setOffset1] = useState({ x: 0, y: 0 })
  const [offset2, setOffset2] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Normalize intensity to a 0-1 scale
  const normalizedIntensity = intensity / 10

  // Calculate glitch parameters based on intensity
  const glitchFrequency = 2000 - normalizedIntensity * 1500 // 500ms to 2000ms
  const glitchDuration = 50 + normalizedIntensity * 150 // 50ms to 200ms
  const maxOffset = Math.ceil(normalizedIntensity * 10) // 1px to 10px

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsGlitching(false)
      setOffset1({ x: 0, y: 0 })
      setOffset2({ x: 0, y: 0 })
      return
    }

    const triggerGlitch = () => {
      setIsGlitching(true)

      // Set random offsets for the glitch effect
      setOffset1({
        x: (Math.random() - 0.5) * maxOffset * 2,
        y: (Math.random() - 0.5) * maxOffset * 0.5,
      })

      setOffset2({
        x: (Math.random() - 0.5) * maxOffset * 2,
        y: (Math.random() - 0.5) * maxOffset * 0.5,
      })

      // Reset glitch after duration
      timeoutRef.current = setTimeout(() => {
        setIsGlitching(false)
        setOffset1({ x: 0, y: 0 })
        setOffset2({ x: 0, y: 0 })

        // Schedule next glitch with random timing
        const randomDelay = Math.random() * glitchFrequency
        timeoutRef.current = setTimeout(triggerGlitch, randomDelay)
      }, glitchDuration)
    }

    // Initial glitch with random delay
    const initialDelay = Math.random() * glitchFrequency
    timeoutRef.current = setTimeout(triggerGlitch, initialDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, maxOffset, glitchFrequency, glitchDuration])

  return (
    <div className="relative inline-block">
      {/* Original text */}
      <span className={cn("relative inline-block", className)}>{children}</span>

      {/* Glitch layers */}
      {enabled && isGlitching && (
        <>
          {/* Red offset layer */}
          <span
            className={cn("absolute top-0 left-0 text-red-500 opacity-70 mix-blend-screen", className)}
            style={{
              transform: `translate(${offset1.x}px, ${offset1.y}px)`,
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
            aria-hidden="true"
          >
            {children}
          </span>

          {/* Cyan offset layer */}
          <span
            className={cn("absolute top-0 left-0 text-cyan-500 opacity-70 mix-blend-screen", className)}
            style={{
              transform: `translate(${offset2.x}px, ${offset2.y}px)`,
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
    </div>
  )
}

