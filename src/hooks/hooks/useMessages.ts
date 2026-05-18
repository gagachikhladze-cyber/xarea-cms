import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ContactMessage } from '@/types'

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setMessages(data as ContactMessage[])
      setLoading(false)
    })
  }, [])

  return { messages, loading }
}
