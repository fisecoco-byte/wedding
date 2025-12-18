import { useEffect, useState } from 'react'
import { listRsvps, updateRsvp, deleteRsvp } from '../services/rsvp.js'

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
  const [filters, setFilters] = useState({
    name: '',
    guests: '',
    phone: '',
    date: '',
    attendance: 'all',
    needsLodging: 'all',
    note: ''
  })

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

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  async function handleDelete(id) {
    if (!confirm('确定要删除这条记录吗？')) return
    try {
      await deleteRsvp(id)
      setRows(rows.filter(r => r.id !== id))
    } catch (e) {
      alert('删除失败')
      console.error(e)
    }
  }

  function startEdit(r) {
    setEditingId(r.id)
    setEditForm({ ...r })
  }

  async function saveEdit() {
    try {
      await updateRsvp(editingId, editForm)
      setRows(rows.map(r => r.id === editingId ? editForm : r))
      setEditingId(null)
    } catch (e) {
      alert('保存失败')
      console.error(e)
    }
  }

  const filteredRows = rows.filter(r => {
    // Name filter
    if (filters.name && !r.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    // Guests filter
    if (filters.guests && String(r.guests) !== filters.guests) return false
    // Phone filter
    if (filters.phone && !String(r.phone || '').includes(filters.phone)) return false
    // Date filter
    if (filters.date && r.date !== filters.date) return false
    // Attendance filter
    if (filters.attendance !== 'all') {
      const isAttending = filters.attendance === 'yes'
      if ((r.attendance ? true : false) !== isAttending) return false
    }
    // Lodging filter
    if (filters.needsLodging !== 'all') {
      const needs = filters.needsLodging === 'yes'
      if ((r.needs_lodging ? true : false) !== needs) return false
    }
    // Note filter
    if (filters.note && !String(r.note || '').toLowerCase().includes(filters.note.toLowerCase())) return false
    
    return true
  })

  return (
    <div className="min-h-screen bg-[#FFFCF3] p-8 font-serif text-[#2b4c7e]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-wider">RSVP 数据管理</h2>
            <span className="bg-[#2b4c7e]/10 text-[#2b4c7e] px-3 py-1 rounded-full text-xs font-bold">
              共 {filteredRows.length} / {rows.length} 条
            </span>
          </div>
          {!loading && !error && (
            <button 
              onClick={handleExport}
              className="bg-[#2b4c7e] text-white px-6 py-2.5 rounded-full text-sm tracking-widest hover:bg-[#1a365d] transition-colors flex items-center gap-2 shadow-lg shadow-[#2b4c7e]/20"
            >
              <iconify-icon icon="lucide:download" width="16"></iconify-icon>
              导出 CSV
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-[#2b4c7e]/20 border-t-[#2b4c7e] rounded-full animate-spin mb-4"></div>
            <p className="text-[#2b4c7e]/60 tracking-widest text-sm">正在加载数据...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#FFF5F5] border border-[#FC8181]/30 rounded-lg p-6 text-center">
            <iconify-icon icon="lucide:alert-circle" width="32" class="text-[#E53E3E] mb-2"></iconify-icon>
            <p className="text-[#E53E3E]">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-[#2b4c7e]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2b4c7e]/5 text-[#2b4c7e] text-xs uppercase tracking-widest">
                    <th className="py-4 px-6 font-semibold min-w-[120px]">
                      <div className="mb-2">姓名</div>
                      <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.name}
                        onChange={e => setFilters({...filters, name: e.target.value})}
                      />
                    </th>
                    <th className="py-4 px-6 font-semibold w-[100px]">
                      <div className="mb-2">人数</div>
                      <input 
                        type="number" 
                        placeholder="#" 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.guests}
                        onChange={e => setFilters({...filters, guests: e.target.value})}
                      />
                    </th>
                    <th className="py-4 px-6 font-semibold min-w-[140px]">
                      <div className="mb-2">联系方式</div>
                      <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.phone}
                        onChange={e => setFilters({...filters, phone: e.target.value})}
                      />
                    </th>
                    <th className="py-4 px-6 font-semibold min-w-[140px]">
                      <div className="mb-2">到达日期</div>
                      <select 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.date}
                        onChange={e => setFilters({...filters, date: e.target.value})}
                      >
                        <option value="">全部</option>
                        <option value="2026-01-23">1月23日</option>
                        <option value="2026-01-24">1月24日</option>
                      </select>
                    </th>
                    <th className="py-4 px-6 font-semibold w-[120px]">
                      <div className="mb-2">出席状态</div>
                      <select 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.attendance}
                        onChange={e => setFilters({...filters, attendance: e.target.value})}
                      >
                        <option value="all">全部</option>
                        <option value="yes">准时赴约</option>
                        <option value="no">遗憾缺席</option>
                      </select>
                    </th>
                    <th className="py-4 px-6 font-semibold w-[120px]">
                      <div className="mb-2">住宿需求</div>
                      <select 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.needsLodging}
                        onChange={e => setFilters({...filters, needsLodging: e.target.value})}
                      >
                        <option value="all">全部</option>
                        <option value="yes">需要</option>
                        <option value="no">不需要</option>
                      </select>
                    </th>
                    <th className="py-4 px-6 font-semibold min-w-[200px]">
                      <div className="mb-2">备注</div>
                      <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="w-full px-2 py-1 text-xs border border-[#2b4c7e]/20 rounded bg-white/50 focus:outline-none focus:border-[#2b4c7e]"
                        value={filters.note}
                        onChange={e => setFilters({...filters, note: e.target.value})}
                      />
                    </th>
                    <th className="py-4 px-6 font-semibold text-right min-w-[160px]">
                      <div className="mb-2">提交时间</div>
                      <div className="h-[26px]"></div> {/* Spacer for alignment */}
                    </th>
                    <th className="py-4 px-6 font-semibold w-[100px]">
                      <div className="mb-2">操作</div>
                      <div className="h-[26px]"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b4c7e]/5">
                  {filteredRows.map((r) => (
                    <tr key={r.id ?? r.created_at} className="hover:bg-[#FFFDF5] transition-colors">
                      {editingId === r.id ? (
                        <>
                          <td className="py-4 px-6"><input className="w-full border rounded px-1" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                          <td className="py-4 px-6"><input type="number" className="w-full border rounded px-1" value={editForm.guests} onChange={e => setEditForm({...editForm, guests: parseInt(e.target.value)})} /></td>
                          <td className="py-4 px-6"><input className="w-full border rounded px-1" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></td>
                          <td className="py-4 px-6">
                            <select className="w-full border rounded px-1" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})}>
                              <option value="2026-01-23">1月23日</option>
                              <option value="2026-01-24">1月24日</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <select className="w-full border rounded px-1" value={editForm.attendance ? 'yes' : 'no'} onChange={e => setEditForm({...editForm, attendance: e.target.value === 'yes'})}>
                              <option value="yes">赴约</option>
                              <option value="no">缺席</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <select className="w-full border rounded px-1" value={editForm.needs_lodging ? 'yes' : 'no'} onChange={e => setEditForm({...editForm, needs_lodging: e.target.value === 'yes'})}>
                              <option value="yes">需要</option>
                              <option value="no">不需要</option>
                            </select>
                          </td>
                          <td className="py-4 px-6"><input className="w-full border rounded px-1" value={editForm.note} onChange={e => setEditForm({...editForm, note: e.target.value})} /></td>
                          <td className="py-4 px-6 text-right text-xs opacity-50 font-mono">
                            {new Date(r.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button onClick={saveEdit} className="text-green-600 hover:text-green-800"><iconify-icon icon="lucide:check" width="16"></iconify-icon></button>
                              <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><iconify-icon icon="lucide:x" width="16"></iconify-icon></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4 px-6 font-medium">{r.name}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2b4c7e]/5 text-xs font-bold">
                              {r.guests}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-sm opacity-80">{r.phone || '-'}</td>
                          <td className="py-4 px-6 font-mono text-sm opacity-80">{r.date || '-'}</td>
                          <td className="py-4 px-6">
                            {r.attendance ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#2F855A] bg-[#C6F6D5] px-2.5 py-1 rounded-full font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2F855A]"></div>
                                准时赴约
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#C53030] bg-[#FED7D7] px-2.5 py-1 rounded-full font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C53030]"></div>
                                遗憾缺席
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {r.needs_lodging ? (
                              <span className="text-[#D69E2E] font-medium text-sm flex items-center gap-1">
                                <iconify-icon icon="lucide:bed-double" width="14"></iconify-icon>
                                需要
                              </span>
                            ) : (
                              <span className="opacity-30">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm max-w-xs truncate opacity-70" title={r.note}>{r.note || '-'}</td>
                          <td className="py-4 px-6 text-right text-xs opacity-50 font-mono">
                            {new Date(r.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-3 justify-end">
                              <button onClick={() => startEdit(r)} className="text-[#2b4c7e] hover:text-[#1a365d] transition-colors" title="编辑">
                                <iconify-icon icon="lucide:pencil" width="16"></iconify-icon>
                              </button>
                              <button onClick={() => handleDelete(r.id)} className="text-[#d64045] hover:text-[#9b2c30] transition-colors" title="删除">
                                <iconify-icon icon="lucide:trash-2" width="16"></iconify-icon>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-[#2b4c7e]/40">
                        <iconify-icon icon="lucide:inbox" width="48" class="mb-2 opacity-50"></iconify-icon>
                        <p>暂无符合条件的 RSVP 数据</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
