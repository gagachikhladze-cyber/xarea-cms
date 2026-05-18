import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch {
    return null
  }
}

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('xarea-images').upload(path, file)
    if (error) return null
    const { data } = supabase.storage.from('xarea-images').getPublicUrl(path)
    return data.publicUrl
  } catch {
    return null
  }
}
