'use client'

import { useState } from 'react'
import { useGallery } from '@/hooks'
import { uploadImage } from '@/lib/supabase'
import { GalleryItem } from '@/types'

export default function GalleryPage() {
  const { items, loading, add, update, remove } = useGallery()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState({ name: '', result: '', before_url: '', after_url: '', is_active: true, sort_order: 0 })
  const [uploading, setUploading] = useState(false)
  const [uploadField, setUploadField] = useState<'before' | 'after'>('before')

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', result: '', before_url: '', after_url: '', is_active: true, sort_order: items.length })
    setShowModal(true)
  }

  const openEdit = (g: GalleryItem) => {
    setEditing(g)
    setForm({ name: g.name, result: g.result || '', before_url: g.before_url || '', after_url: g.after_url || '', is_active: g.is_active, sort_order: g.sort_order })
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
    if (url) {
      setForm(f => ({ ...f, [uploadField === 'before' ? 'before_url' : 'after_url']: url }))
    }
    setUploading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">გალერეა ({items.length})</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">
          + დამატება
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">იტვირთება...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(g => (
            <div key={g.id} className="rounded-xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
              <div className="grid grid-cols-2">
                {g.before_url && (
                  <div className="relative">
                    <img src={g.before_url} alt="მდე" className="w-full h-32 object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs">მდე</span>
                  </div>
                )}
                {g.after_url && (
                  <div className="relative">
                    <img src={g.after_url} alt="შემდეგ" className="w-full h-32 object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#a8d941]/80 text-[#0a0a0a] rounded text-xs">შემდეგ</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{g.name}</div>
                  {g.result && <div className="text-xs text-gray-400 mt-1">{g.result}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${g.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {g.is_active ? 'აქტიური' : 'უქმი'}
                  </span>
                  <button onClick={() => openEdit(g)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">რედაქტირება</button>
                  <button onClick={() => remove(g.id)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-red-400 hover:text-red-300 transition-colors">წაშლა</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-lg w-full bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'რედაქტირება' : 'ახალი ელემენტი'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">სახელი *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">შედეგი</label>
                <input type="text" value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="მაგ: -10კგ 3 თვეში" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">მდე სურათი</label>
                <div className="flex gap-3 items-center">
                  <input type="file" accept="image/*" onChange={e => { setUploadField('before'); handleImageUpload(e) }} className="text-xs text-gray-400" />
                  {uploading && <span className="text-xs text-[#a8d941]">იტვირთება...</span>}
                </div>
                {form.before_url && <input type="text" value={form.before_url} onChange={e => setForm(f => ({ ...f, before_url: e.target.value }))} className="mt-2 w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white focus:border-[#a8d941] outline-none" />}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">შემდეგ სურათი</label>
                <div className="flex gap-3 items-center">
                  <input type="file" accept="image/*" onChange={e => { setUploadField('after'); handleImageUpload(e) }} className="text-xs text-gray-400" />
                </div>
                {form.after_url && <input type="text" value={form.after_url} onChange={e => setForm(f => ({ ...f, after_url: e.target.value }))} className="mt-2 w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white focus:border-[#a8d941] outline-none" />}
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
