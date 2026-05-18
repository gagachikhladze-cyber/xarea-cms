import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types'

export function useTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order')
    if (data) setItems(data as Testimonial[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (t: Omit<Testimonial, 'id'>) => {
    await supabase.from('testimonials').insert(t)
    fetch()
  }

  const update = async (id: string, t: Partial<Testimonial>) => {
    await supabase.from('testimonials').update(t).eq('id', id)
    fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id)
    fetch()
  }

  return { items, loading, add, update, remove, refresh: fetch }
}
