ALTER TABLE homepage_layouts ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE homepage_layouts ADD COLUMN IF NOT EXISTS description_ar TEXT;

alter publication supabase_realtime add table homepage_layouts;