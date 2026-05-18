'use client'

import { useState } from 'react'
import { usePricing } from '@/hooks'
import { PricingPlan } from '@/types'

export default function PricingPage() {
  const { plans, loading, add, update, remove } = usePricing()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PricingPlan | null>(null)
  const [form, setForm] = useState({ name: '', price: '', period: '', features: '', is_featured: false, badge: '', cta_text: '', is_active: true, sort_order: 0 })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', price: '', period: '', features: '', is_featured: false, badge: '', cta_text: '', is_active: true, sort_order: plans.length })
    setShowModal(true)
  }

  const openEdit = (p: PricingPlan) => {
    setEditing(p)
    setForm({ name: p.name, price: p.price, period: p.period || '', features: p.features.join(', '), is_featured: p.is_featured, badge: p.badge || '', cta_text: p.cta_text || '', is_active: p.is_active, sort_order: p.sort_order })
    setShowModal(true)
  }

  const handleSave = async () => {
    const featuresArr = form.features.split(',').map(f => f.trim()).filter(Boolean)
    const data = { ...form, features: featuresArr }
    if (editing) {
      await update(editing.id, data)
    } else {
      await add(data)
    }
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">ფასები ({plans.length})</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">
          + დამატება
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">იტვირთება...</p>
      ) : (
        <div className="space-y-3">
          {plans.map(p => (
            <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border ${p.is_featured ? 'bg-[#a8d941]/10 border-[#a8d941]/30' : 'bg-[#111111] border-[#2a2a2a]'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{p.name}</span>
                  {p.badge && <span className="px-2 py-0.5 rounded text-xs bg-[#a8d941] text-[#0a0a0a]">{p.badge}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">{p.price}₾ {p.period && `/ ${p.period}`}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                {p.is_active ? 'აქტიური' : 'უქმი'}
              </span>
              <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">რედაქტირება</button>
              <button onClick={() => remove(p.id)} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs text-red-400 hover:text-red-300 transition-colors">წაშლა</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-lg w-full bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'რედაქტირება' : 'ახალი გეგმა'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">სახელი *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ფასი *</label>
                  <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">პერიოდი</label>
                <input type="text" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="მაგ: თვე" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">ფუნქციები (მძიმით გამოყოფილი)</label>
                <textarea rows={3} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder="ულიმიტო წვდომა, საუნა, პირადი კარადა" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ბეიჯი</label>
                  <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="მაგ: პოპულარული" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">CTA ტექსტი</label>
                  <input type="text" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="მაგ: არჩევა" className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-[#a8d941]" />
                  რეკომენდებული
                </label>
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
