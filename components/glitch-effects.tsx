"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchEffectProps {
  children: React.ReactNode
  className?: string
  intensity?: number // 1-10 scale
  enabled?: boolean
}

export function GlitchEffect({ children, className, intensity = 5, enabled = true }: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Normalize intensity to a 0-1 scale
  const normalizedIntensity = intensity / 10

  // Calculate glitch parameters based on intensity
  const glitchFrequency = 2000 - normalizedIntensity * 1500 // 500ms to 2000ms
  const glitchDuration = 50 + normalizedIntensity * 200 // 50ms to 250ms

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsGlitching(false)
      return
    }

    const triggerGlitch = () => {
      setIsGlitching(true)

      // Reset glitch after duration
      timeoutRef.current = setTimeout(() => {
        setIsGlitching(false)

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
  }, [enabled, glitchFrequency, glitchDuration])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}

      {/* Glitch overlays */}
      {enabled && (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-cyan-500 mix-blend-exclusion opacity-0 transition-opacity duration-100",
              isGlitching && "opacity-20",
            )}
            style={{
              clipPath: isGlitching
                ? `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`
                : "inset(50% 0 50% 0)",
            }}
          />

          <div
            className={cn(
              "absolute inset-0 bg-red-500 mix-blend-exclusion opacity-0 transition-opacity duration-100",
              isGlitching && "opacity-20",
            )}
            style={{
              clipPath: isGlitching
                ? `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`
                : "inset(50% 0 50% 0)",
              transform: isGlitching ? `translateX(${(Math.random() - 0.5) * 10}px)` : "translateX(0)",
            }}
          />

          {/* Horizontal lines */}
          {isGlitching &&
            Array.from({ length: Math.floor(normalizedIntensity * 5) }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-white opacity-70"
                style={{
                  top: `${Math.random() * 100}%`,
                  transform: `translateY(${Math.random() * 5}px)`,
                  boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                }}
              />
            ))}
        </>
      )}
    </div>
  )
}

