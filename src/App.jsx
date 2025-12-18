import './index.css'
import MobileLongImage from './components/MobileLongImage.jsx'
import { useEffect, useRef, useState } from 'react'
import { useStaggerReveal } from './hooks/useStaggerReveal'
import FoodMap from './components/FoodMap.jsx'

function App() {
  const detailsRef = useRef(null)
  const rsvpRef = useRef(null)
  const heroRef = useStaggerReveal('.reveal-item', 150)
  const rsvpRevealRef = useStaggerReveal('.reveal-item', 100)
  const mapRevealRef = useStaggerReveal('.reveal-item', 100)
  
  const [showForm, setShowForm] = useState(false)
  function handleOpenForm(e) {
    e.preventDefault()
    setShowForm(true)
    const el = rsvpRef.current
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  // Existing poem animation logic (kept for specific timing requirements)
  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    const lines = Array.from(el.querySelectorAll('.reveal-line'))
    const sub = el.querySelector('.reveal-sub')
    let done = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        done = true
        lines.forEach((n, i) => {
          n.style.transitionDelay = `${i * 120}ms`
          n.classList.add('in')
        })
        if (sub) {
          sub.style.transitionDelay = `${lines.length * 120 + 150}ms`
          sub.classList.add('in')
        }
        io.disconnect()
      }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="invitation">
      <MobileLongImage />
      <section className="hero">
        <div className="overlay" />
        <div className="content" ref={heroRef}>
          <h1 className="couple reveal-item">
            <span className="line">尹怀可 FiseCoco</span>
            <span className="line">魏萌 Ananias</span>
          </h1>
          <p className="tagline reveal-item">携手相伴，邀您共赴浪漫之约</p>
          <p className="date reveal-item">2025年1月24日</p>
          <a href="#rsvp" className="cta reveal-item" onClick={handleOpenForm}>填写出席信息</a>
        </div>
      </section>

      <div className="section-divider reveal-item" />

      <section className="details" ref={detailsRef}>
        <div className="poem">
          <span className="reveal-line">花径不曾缘客扫</span>
          <span className="reveal-line">蓬门今始为君开</span>
          <span className="reveal-sub">我们要结婚了！ 略备薄酒，诚邀挚友。 盼你前来，共叙情长。</span>
        </div>
      </section>

      <div className="section-divider reveal-item" />

      <section className="map-section" ref={mapRevealRef}>
        <FoodMap />
      </section>

      <div className="section-divider reveal-item" />

      <section id="rsvp" className="rsvp" ref={rsvpRef}>
        <div ref={rsvpRevealRef}>
          <h2 className="reveal-item">出席信息</h2>
          {!import.meta.env.VITE_SUPABASE_URL && (
            <p className="status error reveal-item">未检测到在线数据库配置，请在项目根目录创建 `.env` 并填入 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。</p>
          )}
          <div className="reveal-item">
            {showForm ? (
              <RSVPForm />
            ) : (
              <button className="cta" onClick={() => setShowForm(true)}>开始填写</button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

import RSVPForm from './components/RSVPForm.jsx'
export default App
