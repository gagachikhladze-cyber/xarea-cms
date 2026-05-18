import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { SiteSettings } from '@/types'

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'X AREA FITNESS',
  phone: '+995579055367',
  phoneDisplay: '+995 579 055 367',
  address: 'სულხან-საბას N10',
  city: 'ქუთაისი, საქართველო',
  hours: 'ყოველდღე 9:00-23:59',
  instagram: 'https://www.instagram.com/xarea_fitness/',
  facebook: 'https://www.facebook.com/GymXarea',
  heroBadge: 'ქუთაისის #1 ფიტნეს დარბაზი',
  heroTitle1: 'TRAIN',
  heroTitle2: 'DIFFERENT',
  heroSubtitle: '263+ კმაყოფილი წევრი. საუკეთესო აღჭურვილობა. პროფესიონალი მწვრთნელები.',
  heroCta1: 'დაიწყე ახლა',
  heroCta2: 'ვარჯიშების ნახვა',
  heroBgImage: 'https://nyamie.com/uploads/photos/medium/Entity-FxeETG5uwVNJ69iI.png',
  aboutLabel: 'ჩვენს შესახებ',
  aboutTitle: 'მეტ ვიდრე<br>უბრალოდ დარბაზი',
  aboutDescription: 'X AREA FITNESS არის ქუთაისის პრემიუმ ფიტნეს სივრცე.',
  aboutImage: 'https://nyamie.com/uploads/photos/medium/Entity-budkg1AiEQQzqzUD.png',
  ctaTitle: 'მზად ხარ<br>ტრანსფორმაციისთვის?',
  ctaText: 'შემოგვიერთდი X AREA FITNESS-ში.',
  ctaBgImage: 'https://nyamie.com/uploads/photos/medium/Entity-KgfN5uU98lJJsgqu.png',
  ctaCta1: 'დაგვიკავშირდი',
  ctaCta2: 'ფასების ნახვა',
  scheduleEnabled: true,
  galleryEnabled: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const merged = { ...DEFAULT_SETTINGS }
        data.forEach(row => {
          const val = row.value as Record<string, unknown>
          Object.keys(val).forEach(k => { merged[k as keyof SiteSettings] = val[k] as never })
        })
        setSettings(merged)
      }
      setLoading(false)
    })
  }, [])

  const update = useCallback(async (updates: Partial<SiteSettings>) => {
    const existing = { ...settings, ...updates }
    const chunks: Record<string, unknown>[] = []
    let chunk: Record<string, unknown> = {}
    let count = 0
    Object.entries(existing).forEach(([k, v]) => {
      chunk[k] = v
      count++
      if (count >= 10) {
        chunks.push(chunk)
        chunk = {}
        count = 0
      }
    })
    if (count > 0) chunks.push(chunk)
    
    for (const c of chunks) {
      await supabase.from('settings').upsert({ key: 'main', value: c })
    }
    setSettings(existing)
  }, [settings])

  return { settings, loading, update }
}
