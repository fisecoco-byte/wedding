import { useEffect, useMemo, useState } from 'react'

function RSVPForm() {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('2025-01-23')
  const [needsLodging, setNeedsLodging] = useState(false)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

  const lodgingEnabled = useMemo(() => date === '2025-01-23', [date])

  useEffect(() => {
    if (!lodgingEnabled) setNeedsLodging(false)
  }, [lodgingEnabled])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasSupabase) {
      setStatus({ type: 'error', message: '未检测到数据库配置，请在 .env 写入 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY' })
      return
    }
    setStatus({ type: 'loading', message: '提交中…' })
    try {
      const payload = {
        name: name.trim(),
        guests: Number(guests) || 0,
        phone: phone.trim(),
        date,
        needsLodging: lodgingEnabled ? needsLodging : false,
        note: note.trim(),
        created_at: new Date().toISOString(),
      }

      const { saveRsvp } = await import('../services/rsvp.js')
      await saveRsvp(payload)
      setStatus({ type: 'success', message: '提交成功，感谢回复！' })
      setName('')
      setGuests(1)
      setPhone('')
      setDate('2025-01-23')
      setNeedsLodging(false)
      setNote('')
    } catch (err) {
      const msg = err?.message || '提交失败，请稍后重试'
      setStatus({ type: 'error', message: msg })
      console.error(err)
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <label>
        姓名
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="您的姓名"
        />
      </label>

      <label>
        联系方式
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="手机号或微信"
        />
      </label>

      <label>
        同行人数
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </label>

      <fieldset className="group">
        <div className="group-head">
          <legend>前往日期</legend>
          <small>请选择抵达日期</small>
        </div>
        <div className="option-grid">
          <label className={`option-card ${date === '2025-01-23' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="date"
              value="2025-01-23"
              checked={date === '2025-01-23'}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="option-title">1月23日</div>
            <div className="option-desc">可安排住宿</div>
          </label>
          <label className={`option-card ${date === '2025-01-24' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="date"
              value="2025-01-24"
              checked={date === '2025-01-24'}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="option-title">1月24日</div>
            <div className="option-desc">当日抵达</div>
          </label>
        </div>
      </fieldset>

      <fieldset className={`group ${lodgingEnabled ? '' : 'disabled'}`}>
        <div className="group-head">
          <legend>住宿需求</legend>
          <small>{lodgingEnabled ? '仅 1 月 23 日可选择住宿' : '选择 1 月 23 日后可填写住宿'}</small>
        </div>
        <div className="segmented">
          <label className={`seg-item ${lodgingEnabled && needsLodging ? 'active' : ''}`}>
            <input
              type="radio"
              name="lodging"
              value="yes"
              disabled={!lodgingEnabled}
              checked={lodgingEnabled && needsLodging}
              onChange={() => setNeedsLodging(true)}
            />
            <span>需要</span>
          </label>
          <label className={`seg-item ${lodgingEnabled && !needsLodging ? 'active' : ''}`}>
            <input
              type="radio"
              name="lodging"
              value="no"
              disabled={!lodgingEnabled}
              checked={lodgingEnabled && !needsLodging}
              onChange={() => setNeedsLodging(false)}
            />
            <span>不需要</span>
          </label>
        </div>
      </fieldset>

      <label>
        备注
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="饮食禁忌或其他说明"
        />
      </label>

      {!hasSupabase && (
        <p className="status error">未检测到在线数据库配置，提交按钮已禁用</p>
      )}

      <button type="submit" disabled={status.type === 'loading' || !hasSupabase}>
        {status.type === 'loading' ? '提交中…' : '提交'}
      </button>

      {status.type === 'error' && (
        <p className="status error">{status.message}</p>
      )}
      {status.type === 'success' && (
        <p className="status success">{status.message}</p>
      )}
    </form>
  )
}

export default RSVPForm
