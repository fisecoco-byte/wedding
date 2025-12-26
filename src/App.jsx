import './index.css'
import MobileLongImage from './components/MobileLongImage.jsx'
import { useEffect, useRef, useState } from 'react'
import { useStaggerReveal } from './hooks/useStaggerReveal'
import FoodMap from './components/FoodMap.jsx'

function LoadingScreen({ isLoading }) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setVisible(false), 800) // 0.8s fade out duration
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#FFFDF5] flex flex-col items-center justify-center transition-opacity duration-800 ease-out ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDuration: '800ms' }}
    >
       <div className="relative mb-6">
         <div className="w-16 h-16 border-2 border-[#d64045]/20 rounded-full animate-spin-slow"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <iconify-icon icon="lucide:heart" width="24" class="text-[#d64045] animate-pulse"></iconify-icon>
         </div>
       </div>
       <div className="text-[#2b4c7e] font-serif tracking-[0.3em] text-sm animate-pulse">
         正在开启浪漫之旅...
       </div>
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Wait for all images to load
    const images = Array.from(document.images)
    const promises = images.map(img => {
      if (img.complete) return Promise.resolve()
      return new Promise(resolve => {
        img.onload = resolve
        img.onerror = resolve
      })
    })

    Promise.all(promises).then(() => {
      // Add a small buffer to ensure smooth transition
      setTimeout(() => setIsLoading(false), 1500)
    })
  }, [])

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

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attendance, setAttendance] = useState('yes') // 'yes' | 'no'
  const [needsLodging, setNeedsLodging] = useState('no') // 'yes' | 'no'
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasSupabase) {
      setStatus({ type: 'error', message: '未配置数据库' })
      return
    }
    setStatus({ type: 'loading', message: '提交中…' })
    
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        guests: 1, // Default to 1 for now, can be expanded
        date: '2026-01-24', // Default date
        needsLodging: needsLodging === 'yes',
        note: attendance === 'no' ? '遗憾缺席' : '',
        created_at: new Date().toISOString(),
      }

      const { saveRsvp } = await import('./services/rsvp.js')
      await saveRsvp(payload)
      setStatus({ type: 'success', message: '提交成功！期待你的到来' })
      setName('')
      setPhone('')
      setAttendance('yes')
      setNeedsLodging('no')
    } catch (err) {
      const msg = err?.message || '提交失败，请稍后重试'
      setStatus({ type: 'error', message: msg })
    }
  }

  function openMap() {
    // 经纬度：103.514894, 30.578353
    // 使用百度地图
    const lng = 103.514894
    const lat = 30.578353
    const name = '塞尚庄园酒店'
    
    // 移动端尝试打开地图 App，PC 端打开网页
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
        // 尝试打开百度地图 App
        window.location.href = `baidumap://map/marker?location=${lat},${lng}&title=${name}&content=${name}&src=webapp.wedding`
        
        // 回退到网页版
        setTimeout(() => {
            window.location.href = `http://api.map.baidu.com/marker?location=${lat},${lng}&title=${name}&content=${name}&output=html&src=webapp.wedding`
        }, 2000)
    } else {
        window.open(`http://api.map.baidu.com/marker?location=${lat},${lng}&title=${name}&content=${name}&output=html&src=webapp.wedding`, '_blank')
    }
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="invitation">
        <MobileLongImage />

      {/* Inserted Section from Generated Page */}
      <section className="py-16 px-8 space-y-16">


            <div className="space-y-6 fade-up delay-100">
                {/* 卡片样式 */}
                <div className="bg-white/40 border border-[#fff]/60 backdrop-blur-sm p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] rounded-sm text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFFDF5] p-2 rounded-full border border-[#2b4c7e]/5">
                        <iconify-icon icon="lucide:map-pin" width="20" class="text-[#d64045]"></iconify-icon>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-3 mb-2">婚礼地点</h3>
                    <p className="text-sm text-[#2b4c7e]/70 leading-relaxed mb-4">
                        成都市大邑县塞尚庄园酒店<br />
                        塞尚庄园酒店<br />
                        宴会厅
                    </p>
                    <button className="text-xs bg-[#2b4c7e] text-white px-5 py-2 rounded-sm tracking-wider flex items-center gap-2 mx-auto active:scale-95 transition-transform" onClick={openMap}>
                        查看地图 <iconify-icon icon="lucide:arrow-right" width="10"></iconify-icon>
                    </button>
                </div>

                <div className="bg-white/40 border border-[#fff]/60 backdrop-blur-sm p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] rounded-sm text-center relative mt-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFFDF5] p-2 rounded-full border border-[#2b4c7e]/5">
                        <iconify-icon icon="lucide:clock-4" width="20" class="text-[#d64045]"></iconify-icon>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-3 mb-2">良辰吉时</h3>
                    <p className="text-sm text-[#2b4c7e]/70 leading-relaxed">
                        2026年1月24日 (周六)<br />
                        农历腊月初七<br />
                        12:00 入席
                    </p>
                </div>
            </div>
        </section>

      <section className="map-section" ref={mapRevealRef}>
        <FoodMap />
      </section>


        {/* Screen 4: RSVP */}
        <section className="py-16 px-6 pb-24">
            <div className="bg-[#FFFDF5] relative p-8 rounded-sm border border-[#2b4c7e]/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] fade-up">
                {/* 邮票装饰 */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-white border border-[#2b4c7e]/10 shadow-sm flex items-center justify-center rotate-6 z-10">
                    <div className="w-[90%] h-[90%] border border-dashed border-[#d64045]/40 flex items-center justify-center">
                        <span className="text-[10px] text-[#d64045] font-en font-bold">RSVP</span>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-xl text-[#2b4c7e] font-normal mb-2">出席回执</h2>
                    <p className="text-xs text-[#2b4c7e]/50 tracking-wider">敬请赐复，以便安排席位</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs text-[#2b4c7e]/60 tracking-widest block">GUEST NAME</label>
                        <input 
                          type="text" 
                          placeholder="请输入您的姓名" 
                          className="w-full input-line text-base text-[#2b4c7e] placeholder-[#2b4c7e]/20 font-serif bg-transparent"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[#2b4c7e]/60 tracking-widest block">PHONE NUMBER</label>
                        <input 
                          type="tel" 
                          placeholder="请输入手机号码" 
                          className="w-full input-line text-base text-[#2b4c7e] placeholder-[#2b4c7e]/20 font-serif bg-transparent"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[#2b4c7e]/60 tracking-widest block">ATTENDANCE</label>
                        <div className="flex gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setAttendance('yes')}>
                                <div className={`w-4 h-4 rounded-full border border-[#2b4c7e]/30 flex items-center justify-center group-hover:border-[#d64045] ${attendance === 'yes' ? 'border-[#d64045]' : ''}`}>
                                    {attendance === 'yes' && <div className="w-2 h-2 rounded-full bg-[#d64045]"></div>}
                                </div>
                                <span className={`text-sm ${attendance === 'yes' ? 'text-[#d64045]' : 'text-[#2b4c7e]/60'}`}>准时赴约</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setAttendance('no')}>
                                <div className={`w-4 h-4 rounded-full border border-[#2b4c7e]/30 flex items-center justify-center group-hover:border-[#d64045] ${attendance === 'no' ? 'border-[#d64045]' : ''}`}>
                                    {attendance === 'no' && <div className="w-2 h-2 rounded-full bg-[#d64045]"></div>}
                                </div>
                                <span className={`text-sm ${attendance === 'no' ? 'text-[#d64045]' : 'text-[#2b4c7e]/60'}`}>遗憾缺席</span>
                            </label>
                        </div>
                    </div>

                    {/* 仅在准时赴约时显示住宿选项 */}
                    {attendance === 'yes' && (
                        <div className="space-y-2 fade-up">
                            <label className="text-xs text-[#2b4c7e]/60 tracking-widest block">ACCOMMODATION</label>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setNeedsLodging('yes')}>
                                    <div className={`w-4 h-4 rounded-full border border-[#2b4c7e]/30 flex items-center justify-center group-hover:border-[#d64045] ${needsLodging === 'yes' ? 'border-[#d64045]' : ''}`}>
                                        {needsLodging === 'yes' && <div className="w-2 h-2 rounded-full bg-[#d64045]"></div>}
                                    </div>
                                    <span className={`text-sm ${needsLodging === 'yes' ? 'text-[#d64045]' : 'text-[#2b4c7e]/60'}`}>需要住宿</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setNeedsLodging('no')}>
                                    <div className={`w-4 h-4 rounded-full border border-[#2b4c7e]/30 flex items-center justify-center group-hover:border-[#d64045] ${needsLodging === 'no' ? 'border-[#d64045]' : ''}`}>
                                        {needsLodging === 'no' && <div className="w-2 h-2 rounded-full bg-[#d64045]"></div>}
                                    </div>
                                    <span className={`text-sm ${needsLodging === 'no' ? 'text-[#d64045]' : 'text-[#2b4c7e]/60'}`}>不需要</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {status.type === 'error' && <p className="text-xs text-[#d64045] text-center">{status.message}</p>}
                    {status.type === 'success' && <p className="text-xs text-[#2b4c7e] text-center">{status.message}</p>}

                    <button type="submit" disabled={status.type === 'loading'} style={{padding: '0.25rem 0'}} className="w-full mt-8 bg-[#2b4c7e] text-white py-3.5 rounded-sm shadow-lg shadow-[#2b4c7e]/20 active:scale-[0.98] transition-all duration-300 flex flex-row items-center justify-center gap-2 disabled:opacity-70">
                        <span className="text-sm tracking-[0.2em] font-light whitespace-nowrap">{status.type === 'loading' ? '提交中...' : '发送回执'}</span>
                        <iconify-icon icon="lucide:send" width="14" class="group-hover:translate-x-1 transition-transform flex-shrink-0"></iconify-icon>
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center opacity-40">
                <iconify-icon icon="lucide:heart-handshake" width="24" style={{top: '2px', position: 'relative', left: '1px'}} class="text-[#d64045] mb-2"></iconify-icon>
                <p className="text-[10px] text-[#2b4c7e] font-en tracking-widest">THANK YOU</p>
            </div>
        </section>

    </div>
    </>
  )
}

import RSVPForm from './components/RSVPForm.jsx'
export default App
