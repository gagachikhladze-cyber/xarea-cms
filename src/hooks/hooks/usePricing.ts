import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { PricingPlan } from '@/types'

export function usePricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('pricing_plans').select('*').order('sort_order')
    if (data) setPlans(data.map(p => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })) as PricingPlan[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (p: Omit<PricingPlan, 'id'>) => {
    await supabase.from('pricing_plans').insert(p)
    fetch()
  }

  const update = async (id: string, p: Partial<PricingPlan>) => {
    await supabase.from('pricing_plans').update(p).eq('id', id)
    fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('pricing_plans').delete().eq('id', id)
    fetch()
  }

  return { plans, loading, add, update, remove, refresh: fetch }
}
