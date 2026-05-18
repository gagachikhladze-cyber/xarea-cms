import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { GalleryItem } from '@/types'

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order')
    if (data) setItems(data as GalleryItem[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (g: Omit<GalleryItem, 'id'>) => {
    await supabase.from('gallery_items').insert(g)
    fetch()
  }

  const update = async (id: string, g: Partial<GalleryItem>) => {
    await supabase.from('gallery_items').update(g).eq('id', id)
    fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('gallery_items').delete().eq('id', id)
    fetch()
  }

  return { items, loading, add, update, remove, refresh: fetch }
}
