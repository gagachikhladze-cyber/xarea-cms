import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Trainer } from '@/types'

export function useTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('trainers').select('*').order('sort_order')
    if (data) setTrainers(data as Trainer[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (t: Omit<Trainer, 'id' | 'created_at'>) => {
    const { data } = await supabase.from('trainers').insert(t).select().single()
    if (data) fetch()
  }

  const update = async (id: string, t: Partial<Trainer>) => {
    await supabase.from('trainers').update(t).eq('id', id)
    fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('trainers').delete().eq('id', id)
    fetch()
  }

  return { trainers, loading, add, update, remove, refresh: fetch }
}
