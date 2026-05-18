import { useState, useEffect } from 'react'
import { supabase, getSession } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(s => { setSession(s); setLoading(false) })
    supabase.auth.onAuthStateChange((_event, s) => setSession(s))
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return { session, loading, login, logout }
}
