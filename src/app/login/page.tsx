'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'შესვლის შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="text-3xl font-bold tracking-wider text-[#a8d941]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            X AREA FITNESS
          </Link>
          <p className="mt-2 text-sm text-gray-400">ადმინისტრატორის პანელი</p>
        </div>
        <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] p-8">
          <h2 className="text-xl font-bold mb-6">შესვლა</h2>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">ელ-ფოსტა</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-[#a8d941] outline-none" placeholder="admin@xarea.ge" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">პაროლი</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-[#a8d941] outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'მიმდინარეობს...' : 'შესვლა'}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link href="/landing" className="text-sm text-gray-400 hover:text-[#a8d941] transition-colors">
            ← დაბრუნება მთავარზე
          </Link>
        </div>
      </div>
    </div>
  )
}
