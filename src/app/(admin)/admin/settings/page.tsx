'use client'

import { useState } from 'react'
import { useSettings } from '@/hooks'
import { SiteSettings } from '@/types'

export default function SettingsPage() {
  const { settings, loading, update } = useSettings()
  const [form, setForm] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await update(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <p className="text-sm text-gray-400">იტვირთება...</p>

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6">
      <h3 className="text-sm font-bold text-[#a8d941] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )

  const Input = ({ label, value, onChange, type = 'text' }: { label: string; value: string | boolean; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value as string} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none resize-none" />
      ) : (
        <input type="text" value={value as string} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white focus:border-[#a8d941] outline-none" />
      )}
    </div>
  )

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
      <span className="text-sm">{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-[#a8d941] w-5 h-5" />
    </label>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">პარამეტრები</h2>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-400">შენახულია ✓</span>}
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-full bg-[#a8d941] text-[#0a0a0a] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'ინახება...' : 'შენახვა'}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <Section title="ზოგადი">
          <Input label="საიტის სათაური" value={form.siteTitle} onChange={v => setForm(f => ({ ...f, siteTitle: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="ტელეფონი" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <Input label="ტელეფონი (ჩვენება)" value={form.phoneDisplay} onChange={v => setForm(f => ({ ...f, phoneDisplay: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="მისამართი" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
            <Input label="ქალაქი" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
          </div>
          <Input label="სამუშაო საათები" value={form.hours} onChange={v => setForm(f => ({ ...f, hours: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Instagram URL" value={form.instagram} onChange={v => setForm(f => ({ ...f, instagram: v }))} />
            <Input label="Facebook URL" value={form.facebook} onChange={v => setForm(f => ({ ...f, facebook: v }))} />
          </div>
        </Section>

        <Section title="ჰეროი">
          <Input label="ბეიჯი" value={form.heroBadge} onChange={v => setForm(f => ({ ...f, heroBadge: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="სათაური 1" value={form.heroTitle1} onChange={v => setForm(f => ({ ...f, heroTitle1: v }))} />
            <Input label="სათაური 2" value={form.heroTitle2} onChange={v => setForm(f => ({ ...f, heroTitle2: v }))} />
          </div>
          <Input label="სუბტიტრი" value={form.heroSubtitle} onChange={v => setForm(f => ({ ...f, heroSubtitle: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="CTA 1" value={form.heroCta1} onChange={v => setForm(f => ({ ...f, heroCta1: v }))} />
            <Input label="CTA 2" value={form.heroCta2} onChange={v => setForm(f => ({ ...f, heroCta2: v }))} />
          </div>
          <Input label="ფონის სურათი URL" value={form.heroBgImage} onChange={v => setForm(f => ({ ...f, heroBgImage: v }))} />
        </Section>

        <Section title="ჩვენს შესახებ">
          <Input label="ლეიბლი" value={form.aboutLabel} onChange={v => setForm(f => ({ ...f, aboutLabel: v }))} />
          <Input label="სათაური (HTML)" value={form.aboutTitle} onChange={v => setForm(f => ({ ...f, aboutTitle: v }))} />
          <Input label="აღწერა" value={form.aboutDescription} onChange={v => setForm(f => ({ ...f, aboutDescription: v }))} type="textarea" />
          <Input label="სურათი URL" value={form.aboutImage} onChange={v => setForm(f => ({ ...f, aboutImage: v }))} />
        </Section>

        <Section title="CTA სექცია">
          <Input label="სათაური (HTML)" value={form.ctaTitle} onChange={v => setForm(f => ({ ...f, ctaTitle: v }))} />
          <Input label="ტექსტი" value={form.ctaText} onChange={v => setForm(f => ({ ...f, ctaText: v }))} />
          <Input label="ფონის სურათი URL" value={form.ctaBgImage} onChange={v => setForm(f => ({ ...f, ctaBgImage: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="CTA 1" value={form.ctaCta1} onChange={v => setForm(f => ({ ...f, ctaCta1: v }))} />
            <Input label="CTA 2" value={form.ctaCta2} onChange={v => setForm(f => ({ ...f, ctaCta2: v }))} />
          </div>
        </Section>

        <Section title="ხილვადობა">
          <Toggle label="განრიგის სექცია" checked={form.scheduleEnabled} onChange={v => setForm(f => ({ ...f, scheduleEnabled: v }))} />
          <Toggle label="გალერეის სექცია" checked={form.galleryEnabled} onChange={v => setForm(f => ({ ...f, galleryEnabled: v }))} />
        </Section>
      </div>
    </div>
  )
}
