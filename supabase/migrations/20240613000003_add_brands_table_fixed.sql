-- Create brands table if it doesn't exist already
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  logo_url TEXT,
  website_url TEXT,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE brands;

-- Create a default "Generic" brand
INSERT INTO brands (name, description, is_active)
VALUES ('Generic', 'Default brand for products without a specific brand', TRUE)
ON CONFLICT (name) DO NOTHING;
