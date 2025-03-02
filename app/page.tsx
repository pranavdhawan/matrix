"use client"
import { GlitchEffect } from "@/components/glitch-effects"
import RainingLetters from "../components/RainingLetters"
import ScreenGlitch from "@/components/ScreenGlitch"
import { useState, useEffect } from "react"

export default function Home() {
  const [intensity, setIntensity] = useState(0)
  const [frequency, setFrequency] = useState(0)

  useEffect(() => {
    setIntensity(Math.random() * 3 + 1) // Range: 1-4
    setFrequency(Math.random() * 5000 + 3000) // Range: 3000-8000ms
  }, [])

  return (
    <main className="min-h-screen">
      <ScreenGlitch intensity={intensity} frequency={frequency}>
        <RainingLetters />
      </ScreenGlitch>
    </main>
  )
}

