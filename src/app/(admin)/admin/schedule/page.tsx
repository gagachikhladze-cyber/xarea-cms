'use client'

import { useState } from 'react'
import { useSchedule } from '@/hooks'
import { ScheduleClass } from '@/types'

export default function SchedulePage() {
  const { days, loading, addDay, addClass, updateClass, removeClass } = useSchedule()
  const [newDayName, setNewDayName] = useState('')
  const [addingClassFor, setAddingClassFor] = useState<string | null>(null)
  const [newClass, setNewClass] = useState({ time: '', name: '', trainer: '', level: '', sort_order: 0 })

  const handleAddDay = async () => {
    if (newDayName.trim()) {
      await addDay(newDayName.trim())
      setNewDayName('')
    }
  }

  const handleAddClass = async (dayId: string) => {
    await addClass(dayId, newClass)
    setAddingClassFor(null)
    setNewClass({ time: '', name: '', trainer: '', level: '', sort_order: 0 })
  }

  const handleUpdateClass = async (c: ScheduleClass, field: string, value: string) => {
    await updateClass(c.id, { ...c, [field]: value } as Partial<ScheduleClass>)
  }

  if (loading) return <p className="text-sm text-gray-400">იტვირთება...</p>

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">განრიგის მართვა</h2>
        <div className="flex gap-3">
          <input type="text" value={newDayName} onChange={e => setNewDayName(e.target.value)} placeholder="დღის სახელი (მაგ: ორშაბათი)" className="flex-1 px-4 py-2 rounded-xl bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
          <button onClick={handleAddDay} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity">+ დღე</button>
        </div>
      </div>
      <div className="space-y-6">
        {days.filter(d => d.is_active).map(day => (
          <div key={day.id} className="bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#a8d941]">{day.day_name}</h3>
              <button onClick={() => { setAddingClassFor(day.id); setNewClass({ time: '', name: '', trainer: '', level: '', sort_order: day.classes.length }) }} className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs hover:text-[#a8d941] transition-colors">
                + ვარჯიში
              </button>
            </div>
            {addingClassFor === day.id && (
              <div className="mb-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input type="text" value={newClass.time} onChange={e => setNewClass(f => ({ ...f, time: e.target.value }))} placeholder="დრო (მაგ: 10:00)" className="px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                  <input type="text" value={newClass.name} onChange={e => setNewClass(f => ({ ...f, name: e.target.value }))} placeholder="სახელი" className="px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                  <input type="text" value={newClass.trainer} onChange={e => setNewClass(f => ({ ...f, trainer: e.target.value }))} placeholder="მწვრთნელი" className="px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                  <input type="text" value={newClass.level} onChange={e => setNewClass(f => ({ ...f, level: e.target.value }))} placeholder="დონე" className="px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                </div>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleAddClass(day.id)} className="px-4 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-xs hover:opacity-90 transition-opacity">დამატება</button>
                  <button onClick={() => setAddingClassFor(null)} className="px-4 py-2 rounded-full bg-[#1a1a1a] text-xs hover:text-white transition-colors">გაუქმება</button>
                </div>
              </div>
            )}
            {day.classes.length === 0 ? (
              <p className="text-xs text-gray-500">ვარჯიშები არ არის</p>
            ) : (
              <div className="space-y-2">
                {day.classes.map(sc => (
                  <div key={sc.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]">
                    <input type="text" value={sc.time} onChange={e => handleUpdateClass(sc, 'time', e.target.value)} className="w-20 px-2 py-1 rounded bg-[#111111] border border-[#2a2a2a] text-sm text-[#a8d941] font-mono focus:border-[#a8d941] outline-none" />
                    <input type="text" value={sc.name} onChange={e => handleUpdateClass(sc, 'name', e.target.value)} className="flex-1 px-2 py-1 rounded bg-[#111111] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
                    <input type="text" value={sc.trainer || ''} onChange={e => handleUpdateClass(sc, 'trainer', e.target.value)} placeholder="მწვრთნელი" className="w-32 px-2 py-1 rounded bg-[#111111] border border-[#2a2a2a] text-xs text-gray-300 focus:border-[#a8d941] outline-none" />
                    <input type="text" value={sc.level || ''} onChange={e => handleUpdateClass(sc, 'level', e.target.value)} placeholder="დონე" className="w-20 px-2 py-1 rounded bg-[#111111] border border-[#2a2a2a] text-xs text-gray-300 focus:border-[#a8d941] outline-none" />
                    <button onClick={() => removeClass(sc.id)} className="px-2 py-1 rounded text-xs text-red-400 hover:text-red-300 transition-colors">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
