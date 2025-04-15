-- Create homepage_layouts table if it doesn't exist
CREATE TABLE IF NOT EXISTS homepage_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  is_default BOOLEAN DEFAULT false,
  layout_data JSONB DEFAULT '{}'::jsonb,
  language VARCHAR(10) DEFAULT 'en',
  region VARCHAR(50) DEFAULT 'global',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE homepage_layouts;
