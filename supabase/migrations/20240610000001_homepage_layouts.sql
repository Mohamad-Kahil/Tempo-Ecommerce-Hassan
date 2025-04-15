-- Create homepage_layouts table
CREATE TABLE IF NOT EXISTS homepage_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layout_type TEXT NOT NULL CHECK (layout_type IN ('hero_grid', 'category_grid', 'editorial_layout', 'product_first')),
  hero_banner JSONB,
  featured_categories UUID[] DEFAULT '{}',
  highlighted_products UUID[] DEFAULT '{}',
  custom_blocks JSONB[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE homepage_layouts ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admins can do all operations" ON homepage_layouts;
CREATE POLICY "Admins can do all operations"
ON homepage_layouts
FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'admin'));

DROP POLICY IF EXISTS "Content Editors can do all operations" ON homepage_layouts;
CREATE POLICY "Content Editors can do all operations"
ON homepage_layouts
FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'content_editor'));

DROP POLICY IF EXISTS "Store Managers can read" ON homepage_layouts;
CREATE POLICY "Store Managers can read"
ON homepage_layouts
FOR SELECT
USING (auth.uid() IN (SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'store_manager'));

DROP POLICY IF EXISTS "Viewers can read" ON homepage_layouts;
CREATE POLICY "Viewers can read"
ON homepage_layouts
FOR SELECT
USING (auth.uid() IN (SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'viewer'));

DROP POLICY IF EXISTS "Public can read published" ON homepage_layouts;
CREATE POLICY "Public can read published"
ON homepage_layouts
FOR SELECT
USING (status = 'published' AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- Add to realtime publication
alter publication supabase_realtime add table homepage_layouts;