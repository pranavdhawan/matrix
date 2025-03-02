import {useEffect, useRef} from 'react'

const Music: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.3
                    audioRef.current.loop = true
                    await audioRef.current.play()
                } catch (err) {
                    // Handle autoplay policy
                    document.addEventListener('click', () => {
                        audioRef.current?.play()
                    }, { once: true })
                }
            }
        }
        playAudio()
    }, [])
  return (
    <audio
        ref={audioRef}
        autoPlay
        src="/music.mp3"
    />
  )
}

export default Music