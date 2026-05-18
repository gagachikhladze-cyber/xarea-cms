'use client'

import { useState } from 'react'
import { useClasses } from '@/hooks'
import { GymClass } from '@/types'

export default function ClassesPage() {
  const { classes, loading, add, update, remove } = useClasses()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<GymClass | null>(null)
  const [form, setForm] = useState({ name: '', subtitle: '', badge: '', badge_color: '#a8d941', schedule_text: '', level: '', image_url: '', is_active: true, sort_order: 0 })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', subtitle: '', badge: '', badge_color: '#a8d941', schedule_text: '', level: '', image_url: '', is_active: true, sort_order: classes.length })
    setShowModal(true)
  }

  const openEdit = (c: GymClass) => {
    setEditing(c)
    setForm({ name: c.name, subtitle: c.subtitle || '', badge: c.badge || '', badge_color: c.badge_color || '#a8d941', schedule_text: c.schedule_text || '', level: c.level || '', image_url: c.image_url || '', is_active: c.is_active, sort_order: c.sort_order })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (editing) {
      await update(editing.id, form)
    } else {
      await add(form)
    }
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">კლასები ({classes.length})</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">
          + დამატება
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">იტვირთება...</p>
      ) : (
        <div className="space-y-3">
          {classes.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#2a2a2a]">
              {c.image_url && <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{c.name}</div>
                {c.subtitle && <div className="text-xs text-gray-400">{c.subtitle}</div>}
              </div>
              {c.badge && (
                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: c.badge_color || undefined, color: '#0a0a0a' }}>{c.badge}</span>
              )}
              <span className={`px-2 py-1 rounded text-xs ${c.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                {c.is_active ? 'აქტიური' : 'უქმი'}
              </span>
              <button onClick={() => openEdit(c)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">რედაქტირება</button>
              <button onClick={() => remove(c.id)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-red-400 hover:text-red-300 transition-colors">წაშლა</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-lg w-full bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'რედაქტირება' : 'ახალი კლასი'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">სახელი *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">სუბტიტრი</label>
                <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ბეიჯი</label>
                  <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ბეიჯის ფერი</label>
                  <input type="color" value={form.badge_color} onChange={e => setForm(f => ({ ...f, badge_color: e.target.value }))} className="w-full h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">დონე</label>
                  <input type="text" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">განრიგის ტექსტი</label>
                <input type="text" value={form.schedule_text} onChange={e => setForm(f => ({ ...f, schedule_text: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">სურათის URL</label>
                <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-[#a8d941]" />
                  აქტიური
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">რიგი:</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="w-16 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">შენახვა</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-full bg-[#1a1a1a] text-sm hover:text-white transition-colors">გაუქმება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
