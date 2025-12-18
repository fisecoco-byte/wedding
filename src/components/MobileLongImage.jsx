import './mobile-long.css'
import { useStaggerReveal } from '../hooks/useStaggerReveal'
import { useState } from 'react'

export default function MobileLongImage() {
  const containerRef = useStaggerReveal('.ml-reveal', 200) // Changed selector and delay
  
  const [sparkles] = useState(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      top: Math.random() * 90 + 5 + '%', // Avoid extreme edges
      left: Math.random() * 90 + 5 + '%',
      size: Math.random() * 12 + 8 + 'px', // 8-20px
      delay: Math.random() * 2 + 's',
      duration: Math.random() * 1.5 + 1.5 + 's'
    }))
  })

  return (
    <div className="mobile-long" ref={containerRef}>
      {/* Save The Date Card */}
      <div className="ml-card">
        <div className="ml-card-content">
          {/* Sparkles Decoration */}
          {sparkles.map(s => (
            <div 
              key={s.id} 
              className="ml-sparkle"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
                animationDuration: s.duration
              }}
            />
          ))}

          <img src="/images/SAVETHEDATE.png" alt="decoration" style={{width: '80%'}} className="ml-reveal" string-parallax="0.05" />
          <div className="ml-reveal" string-parallax="0.08">
            <img src="/images/top.png" alt="decoration" />
            <div className="ml-name">魏萌 & 尹怀可</div>
          </div>
          <div className="ml-center-img-container ml-reveal">
            <img  className="ml-center-img" src="/images/center.png" alt="decoration" string-parallax="0.1" />
          </div>
        </div>
      </div>

    </div>
  )
}
