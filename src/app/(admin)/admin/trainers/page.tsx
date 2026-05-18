'use client'

import { useState } from 'react'
import { useTrainers } from '@/hooks'
import { uploadImage } from '@/lib/supabase'
import { Trainer } from '@/types'

export default function TrainersPage() {
  const { trainers, loading, add, update, remove } = useTrainers()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Trainer | null>(null)
  const [form, setForm] = useState({ name: '', role: '', bio: '', specialization: '', experience: '', price: '', price_label: '', schedule: '', image_url: '', is_active: true, sort_order: 0 })
  const [uploading, setUploading] = useState(false)

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', role: '', bio: '', specialization: '', experience: '', price: '', price_label: '', schedule: '', image_url: '', is_active: true, sort_order: trainers.length })
    setShowModal(true)
  }

  const openEdit = (t: Trainer) => {
    setEditing(t)
    setForm({ name: t.name, role: t.role, bio: t.bio || '', specialization: t.specialization || '', experience: t.experience || '', price: t.price || '', price_label: t.price_label || '', schedule: t.schedule || '', image_url: t.image_url || '', is_active: t.is_active, sort_order: t.sort_order })
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) setForm(f => ({ ...f, image_url: url }))
    setUploading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">მწვრთნელები ({trainers.length})</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">
          + დამატება
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">იტვირთება...</p>
      ) : (
        <div className="space-y-3">
          {trainers.map(t => (
            <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#2a2a2a]">
              {t.image_url && <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-[#a8d941]">{t.role}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${t.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                {t.is_active ? 'აქტიური' : 'უქმი'}
              </span>
              <button onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">რედაქტირება</button>
              <button onClick={() => remove(t.id)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-red-400 hover:text-red-300 transition-colors">წაშლა</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-lg w-full bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'რედაქტირება' : 'ახალი მწვრთნელი'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">სახელი *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">როლი *</label>
                <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">ბიოგრაფია</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">სპეციალიზაცია</label>
                  <input type="text" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">გამოცდილება</label>
                  <input type="text" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ფასი</label>
                  <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ფასის ლეიბლი</label>
                  <input type="text" value={form.price_label} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">განრიგი</label>
                <input type="text" value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">სურათი</label>
                <div className="flex gap-3 items-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-gray-400" />
                  {uploading && <span className="text-xs text-[#a8d941]">იტვირთება...</span>}
                </div>
                {form.image_url && <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="mt-2 w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white focus:border-[#a8d941] outline-none" />}
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
