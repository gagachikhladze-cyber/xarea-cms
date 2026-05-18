import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { GymClass } from '@/types'

export function useClasses() {
  const [classes, setClasses] = useState<GymClass[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('classes').select('*').order('sort_order')
    if (data) setClasses(data as GymClass[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (c: Omit<GymClass, 'id'>) => {
    const { data } = await supabase.from('classes').insert(c).select().single()
    if (data) fetch()
  }

  const update = async (id: string, c: Partial<GymClass>) => {
    await supabase.from('classes').update(c).eq('id', id)
    fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('classes').delete().eq('id', id)
    fetch()
  }

  return { classes, loading, add, update, remove, refresh: fetch }
}
