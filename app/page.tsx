import { GlitchEffect } from "@/components/glitch-effects"
import RainingLetters from "../components/RainingLetters"
import ScreenGlitch from "@/components/ScreenGlitch"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScreenGlitch intensity={
        Math.random() * 10
      } frequency={
        Math.random() * 10000
      }>

        <RainingLetters />
        
      </ScreenGlitch>
    </main>
  )
}

