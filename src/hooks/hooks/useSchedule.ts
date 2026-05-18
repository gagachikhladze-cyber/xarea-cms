import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ScheduleDay, ScheduleClass } from '@/types'

export function useSchedule() {
  const [days, setDays] = useState<ScheduleDay[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data: dayData } = await supabase.from('schedule_days').select('*').order('sort_order')
    if (!dayData) { setLoading(false); return }
    const result: ScheduleDay[] = []
    for (const day of dayData) {
      const { data: classData } = await supabase.from('schedule_classes').select('*').eq('day_id', day.id).order('sort_order')
      result.push({ ...day, classes: (classData || []) as ScheduleClass[] })
    }
    setDays(result)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addDay = async (name: string) => {
    await supabase.from('schedule_days').insert({ day_name: name, sort_order: days.length })
    fetch()
  }

  const addClass = async (dayId: string, c: Omit<ScheduleClass, 'id' | 'day_id'>) => {
    await supabase.from('schedule_classes').insert({ ...c, day_id: dayId })
    fetch()
  }

  const updateClass = async (id: string, c: Partial<ScheduleClass>) => {
    await supabase.from('schedule_classes').update(c).eq('id', id)
    fetch()
  }

  const removeClass = async (id: string) => {
    await supabase.from('schedule_classes').delete().eq('id', id)
    fetch()
  }

  return { days, loading, addDay, addClass, updateClass, removeClass, refresh: fetch }
}
