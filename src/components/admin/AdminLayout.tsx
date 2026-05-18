'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks'

const navItems = [
  { href: '/admin', label: 'დაფა', icon: '📊' },
  { href: '/admin/trainers', label: 'მწვრთნელები', icon: '👤' },
  { href: '/admin/classes', label: 'კლასები', icon: '🏋️' },
  { href: '/admin/schedule', label: 'განრიგი', icon: '📅' },
  { href: '/admin/pricing', label: 'ფასები', icon: '💰' },
  { href: '/admin/testimonials', label: 'შეფასებები', icon: '⭐' },
  { href: '/admin/gallery', label: 'გალერეა', icon: '🖼️' },
  { href: '/admin/messages', label: 'შეტყობინებები', icon: '✉️' },
  { href: '/admin/settings', label: 'პარამეტრები', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#111111] border-r border-[#2a2a2a] transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link href="/landing" className="text-xl font-bold tracking-wider text-[#a8d941]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            X AREA
          </Link>
          <p className="text-xs text-gray-500 mt-1">ადმინ პანელი</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${pathname === item.href ? 'bg-[#a8d941]/10 text-[#a8d941]' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2a]">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] transition-colors">
            <span>🚪</span>
            გასვლა
          </button>
          <Link href="/landing" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-[#a8d941] hover:bg-[#1a1a1a] transition-colors mt-1">
            <span>🌐</span>
            საიტის ნახვა
          </Link>
        </div>
      </aside>
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a] px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-[#1a1a1a] text-white">
            ☰
          </button>
          <h1 className="text-lg font-semibold">
            {navItems.find(i => i.href === pathname)?.label || 'ადმინ პანელი'}
          </h1>
          <div className="w-10" />
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
