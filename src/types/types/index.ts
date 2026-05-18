export interface SiteSettings {
  siteTitle: string
  phone: string
  phoneDisplay: string
  address: string
  city: string
  hours: string
  instagram: string
  facebook: string
  heroBadge: string
  heroTitle1: string
  heroTitle2: string
  heroSubtitle: string
  heroCta1: string
  heroCta2: string
  heroBgImage: string
  aboutLabel: string
  aboutTitle: string
  aboutDescription: string
  aboutImage: string
  ctaTitle: string
  ctaText: string
  ctaBgImage: string
  ctaCta1: string
  ctaCta2: string
  scheduleEnabled: boolean
  galleryEnabled: boolean
}

export interface Trainer {
  id: string
  name: string
  role: string
  bio: string | null
  specialization: string | null
  experience: string | null
  price: string | null
  price_label: string | null
  schedule: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
}

export interface GymClass {
  id: string
  name: string
  subtitle: string | null
  badge: string | null
  badge_color: string | null
  schedule_text: string | null
  level: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
}

export interface ScheduleDay {
  id: string
  day_name: string
  sort_order: number
  is_active: boolean
  classes: ScheduleClass[]
}

export interface ScheduleClass {
  id: string
  day_id: string
  time: string
  name: string
  trainer: string | null
  level: string | null
  sort_order: number
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string | null
  features: string[]
  is_featured: boolean
  badge: string | null
  cta_text: string | null
  is_active: boolean
  sort_order: number
}

export interface Testimonial {
  id: string
  client_name: string
  initials: string
  text: string
  date: string | null
  is_active: boolean
  sort_order: number
}

export interface GalleryItem {
  id: string
  name: string
  result: string | null
  before_url: string | null
  after_url: string | null
  is_active: boolean
  sort_order: number
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  interest: string | null
  message: string | null
  created_at: string
}

export interface AboutFeature {
  icon: string
  title: string
  desc: string
}
