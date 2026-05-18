'use client'

import { useTrainers, useClasses, useTestimonials, useMessages } from '@/hooks'
import Link from 'next/link'

export default function AdminDashboard() {
  const { trainers } = useTrainers()
  const { classes } = useClasses()
  const { items: testimonials } = useTestimonials()
  const { messages } = useMessages()

  const stats = [
    { label: 'მწვრთნელები', value: trainers.length, href: '/admin/trainers', color: '#a8d941' },
    { label: 'კლასები', value: classes.length, href: '/admin/classes', color: '#4caf50' },
    { label: 'შეფასებები', value: testimonials.length, href: '/admin/testimonials', color: '#f59e0b' },
    { label: 'შეტყობინებები', value: messages.length, href: '/admin/messages', color: '#6366f1' },
  ]

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="p-6 rounded-2xl bg-[#111111] border border-[#2a2a2a] hover:border-[#a8d941]/30 transition-colors">
            <div className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: s.color }}>{s.value}</div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>
      <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6">
        <h2 className="text-lg font-bold mb-4">ბოლო შეტყობინებები</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400">შეტყობინებები არ არის</p>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-start justify-between p-4 rounded-xl bg-[#1a1a1a]">
                <div>
                  <div className="font-medium text-sm">{m.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.phone}</div>
                  {m.message && <div className="text-xs text-gray-300 mt-2">{m.message}</div>}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(m.created_at).toLocaleDateString('ka-GE')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
