'use client'

import { useState } from 'react'
import { useTestimonials } from '@/hooks'
import { Testimonial } from '@/types'

export default function TestimonialsPage() {
  const { items, loading, add, update, remove } = useTestimonials()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ client_name: '', initials: '', text: '', date: '', is_active: true, sort_order: 0 })

  const openAdd = () => {
    setEditing(null)
    setForm({ client_name: '', initials: '', text: '', date: '', is_active: true, sort_order: items.length })
    setShowModal(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({ client_name: t.client_name, initials: t.initials, text: t.text, date: t.date || '', is_active: t.is_active, sort_order: t.sort_order })
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
        <h2 className="text-lg font-bold">შეფასებები ({items.length})</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">
          + დამატება
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">იტვირთება...</p>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-[#111111] border border-[#2a2a2a]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#a8d941] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">{t.initials}</div>
                  <div>
                    <div className="font-medium text-sm">{t.client_name}</div>
                    {t.date && <div className="text-xs text-gray-400">{t.date}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${t.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {t.is_active ? 'აქტიური' : 'უქმი'}
                  </span>
                  <button onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">რედაქტირება</button>
                  <button onClick={() => remove(t.id)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-red-400 hover:text-red-300 transition-colors">წაშლა</button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-300">{t.text}</p>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-lg w-full bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'რედაქტირება' : 'ახალი შეფასება'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">სახელი *</label>
                  <input type="text" value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ინიციალები *</label>
                  <input type="text" value={form.initials} onChange={e => setForm(f => ({ ...f, initials: e.target.value }))} maxLength={3} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">ტექსტი *</label>
                <textarea rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">თარიღი</label>
                <input type="text" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="მაგ: იანვარი 2026" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
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
