"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GlitchImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  enabled?: boolean
  intensity?: number // 1-10 scale
}

export function GlitchImage({ src, alt, width, height, className, enabled = true, intensity = 5 }: GlitchImageProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchParams, setGlitchParams] = useState({
    offsetX: 0,
    offsetY: 0,
    sliceTop: 0,
    sliceBottom: 0,
    hueRotate: 0,
  })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Normalize intensity to a 0-1 scale
  const normalizedIntensity = intensity / 10

  // Calculate glitch parameters based on intensity
  const glitchFrequency = 2000 - normalizedIntensity * 1500 // 500ms to 2000ms
  const glitchDuration = 50 + normalizedIntensity * 200 // 50ms to 250ms
  const maxOffset = Math.ceil(normalizedIntensity * 15) // 1px to 15px

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

      // Set random parameters for the glitch effect
      setGlitchParams({
        offsetX: (Math.random() - 0.5) * maxOffset * 2,
        offsetY: (Math.random() - 0.5) * maxOffset,
        sliceTop: Math.random() * 100,
        sliceBottom: Math.random() * 100,
        hueRotate: Math.floor(Math.random() * 360),
      })

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
  }, [enabled, maxOffset, glitchFrequency, glitchDuration])

  return (
    <div className="relative overflow-hidden">
      {/* Original image */}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn("transition-all duration-100", isGlitching && enabled && "scale-[1.01]", className)}
      />

      {/* Glitch effects */}
      {enabled && isGlitching && (
        <>
          {/* RGB split effect */}
          <Image
            src={src || "/placeholder.svg"}
            alt=""
            width={width}
            height={height}
            className={cn("absolute top-0 left-0 opacity-50 mix-blend-screen", className)}
            style={{
              transform: `translate(${glitchParams.offsetX}px, ${glitchParams.offsetY}px)`,
              clipPath: `inset(${glitchParams.sliceTop}% 0 ${glitchParams.sliceBottom}% 0)`,
              filter: `hue-rotate(${glitchParams.hueRotate}deg) saturate(2)`,
            }}
            aria-hidden="true"
          />

          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)",
              backgroundSize: "100% 4px",
              mixBlendMode: "overlay",
              opacity: 0.3,
            }}
            aria-hidden="true"
          />

          {/* Random noise */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
            width={width}
            height={height}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  )
}

useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas || !isGlitching) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  // Draw random noise
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() > 0.5 ? 255 : 0
    data[i] = value // red
    data[i + 1] = value // green
    data[i + 2] = value // blue
    data[i + 3] = 255 // alpha
  }

  ctx.putImageData(imageData, 0, 0)
}, [isGlitching, canvasRef])

