import './mobile-long.css'
import { useStaggerReveal } from '../hooks/useStaggerReveal'

export default function MobileLongImage() {
  const containerRef = useStaggerReveal('.ml-reveal', 200) // Changed selector and delay
  
  return (
    <div className="mobile-long" ref={containerRef}>
      {/* Save The Date Card */}
      <div className="ml-card">
        <div className="ml-card-content">
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
