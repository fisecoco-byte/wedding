import './mobile-long.css'
import { useStaggerReveal } from '../hooks/useStaggerReveal'

export default function MobileLongImage() {
  const timelineRef = useStaggerReveal('.reveal-item', 100)
  
  return (
    <div className="mobile-long">
      <div className="ml-hero" style={{ backgroundImage: 'url(/images/mobile-hero.svg)' }}>
      </div>
      <div className="ml-timeline" ref={timelineRef}>
        {/* 顶部装饰 */}
        <img src="/images/header.png" className="ml-header reveal-item" alt="header" />
        <p className="ml-title reveal-item">Time line</p>
        <div className="ml-timeline-card">
          <div className="ml-left">
            <div className="ml-row" />
            <div className="ml-row">
              <img src="/images/map.png" alt="path" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>10:30</strong><br/>打卡签到</div>
            </div>
            <div className="ml-row" />
            <div className="ml-row">
              <img src="/images/lunch.png" alt="dish" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>12:30</strong><br/>午宴开始</div>
            </div>
            <div className="ml-row" />
            <div className="ml-row">
              <img src="/images/dinner.png" alt="goblets" className="ml-icon reveal-item" />
              <div className="ml-text reveal-item"><strong>17:00</strong><br/>晚餐</div>
            </div>
          </div>
          <img src="/images/time-line.png" alt="vline" className="ml-vline-img reveal-item" />
          <div className="ml-right">
            <div className="ml-row" />
            <div className="ml-row" />
            <div className="ml-row">
              <div className="ml-text reveal-item"><strong>12:00</strong><br/>仪式开始</div>
              <img src="/images/flower.png" alt="flowers" className="ml-icon reveal-item" />
            </div>
            <div className="ml-row" />

            <div className="ml-row">
              <div className="ml-text reveal-item"><strong>13:10</strong><br/>合影</div>
              <img src="/images/camera.png" alt="camera" className="ml-icon reveal-item" />
            </div>
          </div>
        </div>
        <p className="ml-tips reveal-item"><span className="ml-tips-label">Tips：</span>停车场 塞尚庄园停车场</p>
      </div>
    </div>
  )
}
