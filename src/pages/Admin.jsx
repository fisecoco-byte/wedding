import { useEffect, useState } from 'react'
import { listRsvps } from '../services/rsvp.js'

function toCSV(rows) {
  const headers = ['name','guests','phone','date','needsLodging','note','created_at']
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }
  const lines = [headers.join(',')]
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(','))
  }
  return lines.join('\n')
}

export default function Admin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await listRsvps()
        setRows(data)
      } catch (e) {
        setError('读取数据失败，请检查数据库配置')
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function handleExport() {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding_rsvps.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="details">
      <h2>RSVP 数据</h2>
      {loading && <p>加载中…</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && (
        <>
          <button onClick={handleExport}>导出 CSV</button>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>人数</th>
                  <th>联系方式</th>
                  <th>日期</th>
                  <th>住宿</th>
                  <th>备注</th>
                  <th>提交时间</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id ?? r.created_at}>
                    <td>{r.name}</td>
                    <td>{r.guests}</td>
                    <td>{r.phone}</td>
                    <td>{r.date}</td>
                    <td>{r.needsLodging ? '是' : '否'}</td>
                    <td>{r.note}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
