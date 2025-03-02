"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScreenGlitchProps {
  children: ReactNode
  intensity?: number // 1-10 scale
  frequency?: number // How often glitches occur (in ms)
}

export default function ScreenGlitch({
  children,
  intensity = 5,
  frequency = 5000, // Default: glitch every ~5 seconds on average
}: ScreenGlitchProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchStyles, setGlitchStyles] = useState({
    transform: "",
    clipPath: "",
    filter: "",
  })
  const [overlayStyles, setOverlayStyles] = useState<
    Array<{
      top: string
      height: string
      transform: string
      opacity: number
      delay: number
    }>
  >([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Normalize intensity to a 0-1 scale
  const normalizedIntensity = intensity / 10

  // Calculate glitch parameters based on intensity
  const maxDuration = 120 + normalizedIntensity * 200 // 120-320ms max duration
  const minDuration = 50 // Minimum glitch duration

  useEffect(() => {
    const scheduleNextGlitch = () => {
      // Random delay based on frequency with some randomness
      const randomDelay = frequency * (0.5 + Math.random())

      timeoutRef.current = setTimeout(() => {
        triggerGlitch()
        scheduleNextGlitch()
      }, randomDelay)
    }

    const triggerGlitch = () => {
      // Generate random glitch parameters
      const glitchDuration = minDuration + Math.random() * (maxDuration - minDuration)

      // Create horizontal scan lines
      const scanLines = Array.from({ length: Math.floor(3 + normalizedIntensity * 5) }).map(() => ({
        top: `${Math.random() * 100}%`,
        height: `${1 + Math.random() * 3}px`,
        transform: `translateX(${(Math.random() - 0.5) * 10}px)`,
        opacity: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 50, // Stagger the appearance
      }))

      setOverlayStyles(scanLines)

      // Set main glitch styles
      setGlitchStyles({
        transform: Math.random() > 0.7 ? `translateX(${(Math.random() - 0.5) * normalizedIntensity * 10}px)` : "",
        clipPath: Math.random() > 0.5 ? `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)` : "",
        filter: `hue-rotate(${Math.random() * 360}deg) saturate(${1 + normalizedIntensity * 5})`,
      })

      // Start glitching
      setIsGlitching(true)

      // Stop glitching after duration
      setTimeout(() => {
        setIsGlitching(false)
      }, glitchDuration)
    }

    // Start the glitch cycle
    scheduleNextGlitch()

    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [frequency, normalizedIntensity, maxDuration])

  return (
    <div className="relative w-full h-full">
      {/* Main content */}
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-50",
          isGlitching && "will-change-transform",
        )}
        style={isGlitching ? glitchStyles : {}}
      >
        {children}
      </div>

      {/* Glitch overlays - only rendered during glitch */}
      {isGlitching && (
        <>
          {/* RGB split overlays */}
          <div
            className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen pointer-events-none"
            style={{
              transform: `translateX(${normalizedIntensity * 5}px)`,
              backgroundColor: "rgba(255,0,0,0.2)",
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
          />
          <div
            className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen pointer-events-none"
            style={{
              transform: `translateX(-${normalizedIntensity * 5}px)`,
              backgroundColor: "rgba(0,255,255,0.2)",
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
          />

          {/* Scan lines */}
          {overlayStyles.map((style, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 bg-white pointer-events-none"
              style={{
                top: style.top,
                height: style.height,
                transform: style.transform,
                opacity: style.opacity,
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                transition: `opacity ${style.delay}ms ease`,
                zIndex: 10,
              }}
            />
          ))}

          {/* Noise overlay */}
          <div
            className="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Occasional vertical tear */}
          {Math.random() > 0.7 && (
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-white pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 8px rgba(255, 255, 255, 1)",
                opacity: 0.8,
              }}
            />
          )}
        </>
      )}
    </div>
  )
}

