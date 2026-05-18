-- ============================================
-- X AREA FITNESS — Supabase Schema
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  specialization TEXT,
  experience TEXT,
  price TEXT,
  price_label TEXT,
  schedule TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  badge_color TEXT,
  schedule_text TEXT,
  level TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS schedule_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID REFERENCES schedule_days(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  name TEXT NOT NULL,
  trainer TEXT,
  level TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  badge TEXT,
  cta_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  initials TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  result TEXT,
  before_url TEXT,
  after_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read_settings" ON settings FOR SELECT USING (true);
CREATE POLICY "public_read_trainers" ON trainers FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_classes" ON classes FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_schedule_days" ON schedule_days FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_schedule_classes" ON schedule_classes FOR SELECT USING (true);
CREATE POLICY "public_read_pricing" ON pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_gallery" ON gallery_items FOR SELECT USING (is_active = true);

-- Authenticated full access
CREATE POLICY "auth_all_settings" ON settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_trainers" ON trainers FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_classes" ON classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_schedule_days" ON schedule_days FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_schedule_classes" ON schedule_classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_pricing" ON pricing_plans FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_gallery" ON gallery_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('xarea-images', 'xarea-images', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "auth_upload_xarea" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'xarea-images' AND auth.role() = 'authenticated');
CREATE POLICY "public_read_xarea" ON storage.objects FOR SELECT USING (bucket_id = 'xarea-images');
CREATE POLICY "auth_delete_xarea" ON storage.objects FOR DELETE USING (bucket_id = 'xarea-images' AND auth.role() = 'authenticated');

-- Contact messages: anyone can insert
CREATE POLICY "anyone_insert_messages" ON contact_messages FOR INSERT WITH CHECK (true);
