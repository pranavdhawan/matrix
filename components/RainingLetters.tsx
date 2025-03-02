"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

export const useSystemInfo = () => {
  const getBrowserInfo = () => {
    const platform = window.navigator.platform;
    const vendor = window.navigator.vendor;
    const memory = (window.navigator as any).deviceMemory;

    return [
      `System: ${platform}`,
      `Browser: ${vendor || 'Unknown'}`,
      `Memory: ${memory ? memory + 'GB' : 'Unknown'}`,
    ];
  };

  return { getBrowserInfo };
};



interface Character {
  char: string
  x: number
  y: number
  speed: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

const getQuote = async () => {
  try {
    const response = await fetch('https://dummyjson.com/c/c9b1-a6f2-4bb2-b328')
    const data = await response.json()

    
      return data.quotes[Math.floor(Math.random() * data.quotes.length)]
    
  } catch(error) {
    return "Welcome to the Matrix"
  }
}

const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  const [quote, setQuote] = useState("")

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
      getQuote().then(newQuote => {
        if (newQuote) {
          setQuote(newQuote)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current && quote) {
      const useSysteminfo = useSystemInfo()
      // const phrases = [
      //   'whoever the fuck you are',
      //   `${useSysteminfo.getBrowserInfo()[0]}, ${useSysteminfo.getBrowserInfo()[1]}`,
      //   'WELCOME',
      //   '2 the',
      //   'M',
      //   '@',
      //   'T',
      //   'RIX',
      //   'MATRIX',
      //   'mAtRiX',
      //   'ENTER the WORLD right now!'
      // ]
      
      // let counter = 0
      // const next = () => {
      //   if (scramblerRef.current) {
      //     scramblerRef.current.setText(phrases[counter]).then(() => {
      //       setTimeout(next, 200)
      //     })
      //     counter = (counter + 1) % phrases.length
      //   }
      // }

      // const quote = "skjfhsajkfsa"

      const next = async () => {
        if(scramblerRef.current) {
          await scramblerRef.current.setText(quote)
          setTimeout(async () => {
            const newQuote = await getQuote()
            if(newQuote) {
              setQuote(newQuote)
            }
          }, 2500)
        }
      }

      next()
    }
  }, [mounted, quote])

  return (
    <h1 
      ref={elementRef}
      className="text-white text-6xl  text-center tracking-wider justify-center"
      style={{ fontFamily:'monospace' }}
    >
    </h1>
  )
}

const RainingLetters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  const createCharacters = useCallback(() => {
    const allChars = "わさび - 適量 海苔 - 適量 醤油 - 適量 作り方 シャリの準備 米をよく洗い、水に30分ほど浸す。 炊飯器で炊き、炊き上がったら10分ほど蒸らす。 米酢、砂糖、塩を混ぜ、炊きたてのご飯に加えて切るように混ぜる。濡れた布をかぶせ、冷ましておく。 ネタの準備 刺身用のマグロとサーモンを薄く切る。 寿司を握る手を濡らし、シャリを一口大に握る。わさびを少し乗せ、その上にネタをのせる。軽く押さえて形を整える。盛り付けお皿に並べ、醤油を添える。お好みでガリやわさびを添える。いただきます！"
    const columns = 100 // Number of columns across the screen
    const charsPerColumn = Math.ceil(300 / columns) // Distribute characters evenly
    const newCharacters: Character[] = []

    for (let col = 0; col < columns; col++) {
      for (let i = 0; i < charsPerColumn; i++) {
        newCharacters.push({
          char: allChars[Math.floor(Math.random() * allChars.length)],
          x: (col * (100 / columns)) + (Math.random() * 2 - 1), // Add slight randomness
          y: (i * (100 / charsPerColumn)) + (Math.random() * 5),
          speed: 0.1 + Math.random() * 0.3,
        })


      }
    }

    return newCharacters
  }, [])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  useEffect(() => {
    const updateActiveIndices = () => {
      const newActiveIndices = new Set<number>()
      const numActive = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numActive; i++) {
        newActiveIndices.add(Math.floor(Math.random() * characters.length))
      }
      setActiveIndices(newActiveIndices)
    }

    const flickerInterval = setInterval(updateActiveIndices, 50)
    return () => clearInterval(flickerInterval)
  }, [characters.length])

  useEffect(() => {
    let animationFrameId: number

    const updatePositions = () => {
      setCharacters(prevChars => 
        prevChars.map(char => ({
          ...char,
          y: char.y + char.speed,
          ...(char.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: "わさび - 適量 海苔 - 適量 醤油 - 適量 作り方 シャリの準備 米をよく洗い、水に30分ほど浸す。 炊飯器で炊き、炊き上がったら10分ほど蒸らす。 米酢、砂糖、塩を混ぜ、炊きたてのご飯に加えて切るように混ぜる。濡れた布をかぶせ、冷ましておく。 ネタの準備 刺身用のマグロとサーモンを薄く切る。 寿司を握る手を濡らし、シャリを一口大に握る。わさびを少し乗せ、その上にネタをのせる。軽く押さえて形を整える。盛り付けお皿に並べ、醤油を添える。お好みでガリやわさびを添える。いただきます！"[
              Math.floor(Math.random() * "わさび - 適量 海苔 - 適量 醤油 - 適量 作り方 シャリの準備 米をよく洗い、水に30分ほど浸す。 炊飯器で炊き、炊き上がったら10分ほど蒸らす。 米酢、砂糖、塩を混ぜ、炊きたてのご飯に加えて切るように混ぜる。濡れた布をかぶせ、冷ましておく。 ネタの準備 刺身用のマグロとサーモンを薄く切る。 寿司を握る手を濡らし、シャリを一口大に握る。わさびを少し乗せ、その上にネタをのせる。軽く押さえて形を整える。盛り付けお皿に並べ、醤油を添える。お好みでガリやわさびを添える。いただきます！".length)
            ],
          }),
        }))
      )
      animationFrameId = requestAnimationFrame(updatePositions)
    }

    animationFrameId = requestAnimationFrame(updatePositions)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <ScrambledTitle />
      </div>

      {/* Raining Characters */}
      {characters.map((char, index) => (
        <span
          key={index}
          className={`absolute text-xs transition-colors duration-100 ${
            activeIndices.has(index)
              ? "text-[#00ff00] text-base scale-125 z-10 font-bold animate-pulse"
              : "text-[#00FF00] font-light opacity-70 [text-shadow:_0_0_5px_#00FF00,_0_0_10px_#00FF00]"
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(index) ? 'scale(1.25)' : 'scale(1)'}`,
            textShadow: activeIndices.has(index) 
              ? '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)' 
              : 'none',
            opacity: activeIndices.has(index) ? 1 : 0.4,
            transition: 'color 0.1s, transform 0.1s, text-shadow 0.1s',
            willChange: 'transform, top',
            fontSize: '1.8rem'
          }}
        >
          {char.char}
        </span>
      ))}

      <style jsx global>{`
        .dud {
          color: #0f0;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

export default RainingLetters

