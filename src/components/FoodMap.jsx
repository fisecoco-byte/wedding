import { useEffect, useRef, useState } from 'react'
import './food-map.css'

const FOOD_SPOTS = [
  { category: '小吃', name: '左麻右辣', lng: 103.53, lat: 30.59, description: '地道的四川麻辣风味，老字号兔头，兔腿等小吃。排队小店。' },
  { category: '小吃', name: '头头是道', lng: 103.53, lat: 30.60, description: '新起小吃店，店里的兔头也是特色，炸洋芋花等小吃也不错，可以作为左麻右辣的备选' },
  { category: '小吃', name: '箭道街美食', lng: 103.53, lat: 30.60, description: '汇聚多种地道小吃，充满市井烟火气，大邑最local的小吃街。人多，闲逛时保护好自己的财产' },
  { category: '夜宵', name: '邛崃老字号清汤面', lng: 103.54, lat: 30.59, description: '宵夜之王，强烈推荐他家的清汤奶汤面和红油水饺' },
  { category: '夜宵', name: '老地方烧烤', lng: 103.43, lat: 30.54, description: '炭火烤制，焦香四溢，食材新鲜，我发小家开的，猪鼻筋、烤年糕无敌。' },
  { category: '面包', name: '一口面包', lng: 103.53, lat: 30.59, description: '每日现烤，每天中午12点后开始售卖。日式面包为主，推荐蔓越莓面包。' },
  { category: '面包', name: '安仁瑶石窯面包', lng: 103.62, lat: 30.52, description: '使用传统石窑烘焙，外皮酥脆内里湿润。小店在安仁的一条小街上，这家欧宝很地道。' },
  { category: '咖啡', name: '安仁咖啡博物馆', lng: 103.62, lat: 30.51, description: '在此不仅能品尝香醇咖啡，还能了解咖啡文化历史，环境优雅复古。本人觉得大邑目前最好喝的咖啡店' },
  { category: '特色菜', name: '庹血旺', lng: 103.53, lat: 30.58, description: '大邑名菜，血旺嫩滑如豆腐，红油香辣开胃，极为下饭。很local的一家店，推荐去试一下。饭点人会比较多' },
  { category: '特色菜', name: '坛子烤肉', lng: 103.52, lat: 30.60, description: '独特坛子焖烤工艺，锁住肉汁，肥而不腻，风味独特。杨老师推荐，不好吃找他' },
  { category: '特色菜', name: '犟拐拐', lng: 103.52, lat: 30.59, description: '主打卤味与特色家常菜，味道正宗，分量十足，性价比极高。杨老师推荐，不好吃找他' },
  { category: '特色菜', name: '盆盆虾', lng: 103.53, lat: 30.57, description: '鲜虾个大饱满，麻辣鲜香，搭配丰富的配菜，让人欲罢不能。大邑老字号网红店，很多外地人开车来吃的，现在比较商业化了。' },
  { category: '婚礼酒店', name: '推荐酒店', lng: 103.51, lat: 30.58, description: '婚礼指定推荐住宿酒店，环境舒适，交通便利。' },
]

const CATEGORIES = ['小吃', '夜宵', '面包', '咖啡', '特色菜', '婚礼酒店']

export default function FoodMap() {
  const mapRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('婚礼酒店')
  const [mapInstance, setMapInstance] = useState(null)
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [error, setError] = useState('')
  
  const ak = import.meta.env.VITE_BAIDU_MAP_AK

  function initMap() {
    if (!mapRef.current) return
    const BMap = window.BMap
    const map = new BMap.Map(mapRef.current)
    const point = new BMap.Point(103.53, 30.59) // Center around Anren/Dayi area based on points
    map.centerAndZoom(point, 13)
    map.enableScrollWheelZoom(true)
    map.enableDragging() // Ensure dragging is enabled
    
    // Add navigation control
    map.addControl(new BMap.NavigationControl())
    map.addControl(new BMap.ScaleControl())

    setMapInstance(map)
  }

  useEffect(() => {
    if (!ak || ak === 'YOUR_BAIDU_MAP_AK') {
      // Defer error setting to avoid sync update in effect
      const timer = setTimeout(() => setError('请在 .env 文件中配置 VITE_BAIDU_MAP_AK'), 0)
      return () => clearTimeout(timer)
    }

    // Check if script is already loaded
    if (window.BMap) {
      initMap()
      return
    }

    // Load script
    const script = document.createElement('script')
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=initBaiduMapCallback`
    script.async = true
    script.onerror = () => setError('百度地图脚本加载失败')
    
    window.initBaiduMapCallback = () => {
      initMap()
    }
    
    document.body.appendChild(script)

    return () => {
      window.initBaiduMapCallback = null
    }
  }, [ak])

  // Update markers when category or map instance changes
  useEffect(() => {
    if (!mapInstance || !window.BMap) return

    const BMap = window.BMap
    
    // Clear existing markers
    mapInstance.clearOverlays()
    
    const newMarkers = []
    
    const filteredSpots = activeCategory === '全部' 
      ? FOOD_SPOTS 
      : FOOD_SPOTS.filter(s => s.category === activeCategory)

    filteredSpots.forEach(spot => {
      const point = new BMap.Point(spot.lng, spot.lat)
      const marker = new BMap.Marker(point)
      
      // Add label to marker
      const label = new BMap.Label(spot.name, { offset: new BMap.Size(20, -10) })
      label.setStyle({
        color: '#143C88',
        fontSize: '12px',
        border: '1px solid #99BADD',
        borderRadius: '4px',
        padding: '2px 5px',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer'
      })
      
      // Allow clicking on the label to trigger the same action as clicking the marker
      label.addEventListener('click', () => {
        // Prevent map click propagation if needed, though BMap usually handles this
        setSelectedSpot(spot)
      })
      
      marker.setLabel(label)

      marker.addEventListener('click', () => {
        setSelectedSpot(spot)
      })

      mapInstance.addOverlay(marker)
      newMarkers.push(marker)
    })

    // Adjust view to fit markers if there are any
    if (filteredSpots.length > 0) {
      const points = filteredSpots.map(s => new BMap.Point(s.lng, s.lat))
      const viewport = mapInstance.getViewport(points)
      mapInstance.setViewport(viewport)
    }

  }, [mapInstance, activeCategory])

  return (
    <div className="food-map-container reveal-item">
      <h2 className="map-title">美食地图</h2>
      <p className="map-subtitle">大邑周边游玩推荐（点击地图标记查看详情）</p>
      
      {error && <div className="map-error">{error}</div>}
      
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="map-wrapper" ref={mapRef} />

      {selectedSpot && (
        <div className="modal-overlay" onClick={() => setSelectedSpot(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSpot(null)}>×</button>
            <h3 className="modal-title">{selectedSpot.name}</h3>
            <span className="modal-tag">{selectedSpot.category}</span>
            <p className="modal-desc">
              {selectedSpot.description || `这里是${selectedSpot.name}的简介。推荐大家来尝试这里的特色美味，绝对让您不虚此行！`}
            </p>
            <a 
              href={`http://api.map.baidu.com/marker?location=${selectedSpot.lat},${selectedSpot.lng}&title=${encodeURIComponent(selectedSpot.name)}&content=${encodeURIComponent(selectedSpot.category)}&output=html&src=webapp.wedding`}
              target="_blank" 
              className="modal-cta"
            >
              📍 导航前往
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
