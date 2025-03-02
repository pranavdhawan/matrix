import { useEffect, useRef, useState } from 'react'

const Music: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3
            audioRef.current.loop = true
            audioRef.current.play()
            setIsPlaying(true)
            setIsExpanded(true)
            setTimeout(() => setIsExpanded(false), 2000)
        }
    }

    return (
        <>
            <button 
                onClick={handlePlay}
                className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full 
                    ${isExpanded ? 'bg-green-500/20 px-8 py-2' : 'bg-green-500/10 w-8 h-8'} 
                    hover:bg-green-500/30 flex items-center justify-center`}
            >
                {isExpanded ? (
                    <span className="text-green-400 whitespace-nowrap">Sound Enabled</span>
                ) : (
                    <span className="text-green-400 text-xl">▶</span>
                )}
            </button>
            <audio
                ref={audioRef}
                src="/music.mp3"
                loop
            />
        </>
    )
}

export default Music