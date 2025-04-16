-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  logo_url TEXT,
  website_url TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add brand_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id);

-- Insert default Generic brand
INSERT INTO brands (name, description, is_active) 
VALUES ('Generic', 'Default brand for products without a specific brand', true);

-- Enable realtime for brands table
ALTER PUBLICATION supabase_realtime ADD TABLE brands;