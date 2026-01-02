import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ shouldPlay }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!shouldPlay) return

    // Try to auto-play when component mounts
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.5
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(error => {
            console.log("Auto-play was prevented:", error)
            setIsPlaying(false)
            
            // Add one-time listener to document to start music on first interaction
            const startMusic = () => {
              audio.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Play failed:", e))
              document.removeEventListener('click', startMusic)
              document.removeEventListener('touchstart', startMusic)
            }
            document.addEventListener('click', startMusic)
            document.addEventListener('touchstart', startMusic)
          })
      }
    }
  }, [shouldPlay])

  const togglePlay = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div 
      className="fixed top-4 right-4 z-50 cursor-pointer transition-transform active:scale-95"
      onClick={togglePlay}
    >
      <audio ref={audioRef} src="/backup.mp3" loop />
      <div className="relative">
        {/* Tonearm (唱臂) */}
        <div 
            className={`absolute -top-3 right-0 w-4 h-8 z-20 origin-[top_center] transition-transform duration-500 ease-in-out ${isPlaying ? 'rotate-[20deg] translate-x-[-2px]' : '-rotate-[30deg]'}`}
        >
            <svg viewBox="0 0 20 60" className="w-full h-full drop-shadow-sm filter drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)]">
                {/* Base */}
                <circle cx="10" cy="5" r="3" fill="#E2041E" />
                {/* Arm */}
                <path d="M10 5 L10 40 L6 48" fill="none" stroke="#E2041E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Head */}
                <rect x="3" y="45" width="6" height="8" rx="1" fill="#E2041E" />
            </svg>
        </div>

        {/* Simple Vinyl Disc - SVG Style */}
        <div className={`w-11 h-11 rounded-full shadow-sm bg-[#FFFCF3] border border-[#E2041E] flex items-center justify-center overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '8s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Grooves */}
                {[...Array(6)].map((_, i) => (
                    <circle key={i} cx="50" cy="50" r={20 + i * 4} fill="none" stroke="#E2041E" strokeWidth="0.5" opacity="0.5" />
                ))}
                {/* Inner Label Area */}
                <circle cx="50" cy="50" r="16" fill="none" stroke="#E2041E" strokeWidth="1" opacity="0.3" />
                {/* Center Solid Dot */}
                <circle cx="50" cy="50" r="6" fill="#E2041E" />
                <circle cx="50" cy="50" r="2" fill="#FFFCF3" />
            </svg>
        </div>
        
        {/* Play/Pause Icon Badge - Center Overlay when paused */}
        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="w-5 h-5 bg-[#FFFCF3]/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#E2041E] shadow-sm">
                    <iconify-icon icon="lucide:play" width="8" className="text-[#E2041E] ml-0.5"></iconify-icon>
                </div>
            </div>
        )}
        
        {/* Music Notes */}
        {isPlaying && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
               <iconify-icon icon="lucide:music" width="10" class="text-[#E2041E] absolute opacity-0 music-note-1"></iconify-icon>
               <iconify-icon icon="lucide:music-2" width="12" class="text-[#E2041E] absolute opacity-0 music-note-2"></iconify-icon>
               <iconify-icon icon="lucide:music" width="8" class="text-[#E2041E] absolute opacity-0 music-note-3"></iconify-icon>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
