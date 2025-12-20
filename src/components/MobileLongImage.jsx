import './mobile-long.css'
import { useStaggerReveal } from '../hooks/useStaggerReveal'

export default function MobileLongImage() {
  const containerRef = useStaggerReveal('.reveal-item', 100)
  
  return (
    <div className="mobile-long" ref={containerRef}>
      {/* Save The Date Card */}
      <div className="ml-card reveal-item">
        <div className="ml-card-content">
          <img src="/images/SAVETHEDATE.png" alt="decoration" style={{width: 'auto'}} />
          <div>
            <img src="/images/top.png" alt="decoration" />
            <div className="ml-name">魏萌 & 尹怀可</div>
          </div>
          <div className="ml-center-img-container">
            <img  className="ml-center-img" src="/images/center.png" alt="decoration" />
          </div>
          <img src="/images/bottom.png" style={{width: '80%'}} alt="decoration" />
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{width: '100%', padding: '0 10px'}}> <img src="/images/time-line.png"  alt="decoration" className="ml-timeline-img" /></div>

      {/* <div className="ml-timeline">
        <div className="ml-timeline-header reveal-item">
          <p className="ml-title">TIME LINE</p>
        </div>
        
        <div className="ml-timeline-card">
          <div className="ml-left">
            <div className="ml-row">
              <img src="/images/map.png" alt="path" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>10:30</strong><br/>宾客签到</div>
            </div>
            <div className="ml-row spacer" />
            <div className="ml-row">
              <img src="/images/lunch.png" alt="dish" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>12:30</strong><br/>婚宴开始</div>
            </div>
            <div className="ml-row spacer" />
            <div className="ml-row">
              <img src="/images/dinner.png" alt="goblets" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>17:00</strong><br/>婚宴晚餐</div>
            </div>
          </div>

          <div className="ml-center-line">
            <img src="/images/time-line.png" alt="line" className="ml-vline-img reveal-item" />
          </div>

          <div className="ml-right">
            <div className="ml-row spacer" />
            <div className="ml-row">
              <div className="ml-text reveal-item"><strong>12:08</strong><br/>婚礼仪式</div>
              <img src="/images/flower.png" alt="flowers" className="ml-icon reveal-item" />
            </div>
            <div className="ml-row spacer" />
            <div className="ml-row">
              <div className="ml-text reveal-item"><strong>13:10</strong><br/>合影纪念</div>
              <img src="/images/camera.png" alt="camera" className="ml-icon reveal-item" />
            </div>
          </div>
        </div>
        
        <div className="ml-footer-deco reveal-item">
        </div>
        
        <p className="ml-tips reveal-item"><span className="ml-tips-label">Tips：</span>停车场 塞尚庄园停车场</p>
      </div> */}
    </div>
  )
}
