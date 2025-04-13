-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policy to allow public access to product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to products table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'supplier_id') THEN
    ALTER TABLE products ADD COLUMN supplier_id UUID REFERENCES suppliers(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'currency') THEN
    ALTER TABLE products ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
    ALTER TABLE products ADD COLUMN rating NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
    ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
    ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_new') THEN
    ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
    ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
  
  -- Rename 'stock' to 'stock_quantity' if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock') THEN
    ALTER TABLE products RENAME COLUMN stock TO stock_quantity;
  END IF;
END $$;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Flooring', 'All types of flooring materials including tiles, wood, and vinyl'),
('Wall Coverings', 'Materials for covering walls including paint, wallpaper, and panels'),
('Bathroom', 'Bathroom fixtures, fittings, and accessories'),
('Kitchen', 'Kitchen fixtures, appliances, and accessories'),
('Lighting', 'Indoor and outdoor lighting solutions'),
('Doors & Windows', 'Doors, windows, and related hardware'),
('Outdoor', 'Materials and products for outdoor spaces'),
('Tools', 'Hand tools, power tools, and accessories');

-- Insert sample suppliers
INSERT INTO suppliers (name, description, logo_url) VALUES
('Al Futtaim Building Materials', 'Leading supplier of premium building materials in the UAE', 'https://api.dicebear.com/7.x/initials/svg?seed=AFBM'),
('Dubai Ceramics', 'Specializing in high-quality ceramic products', 'https://api.dicebear.com/7.x/initials/svg?seed=DC'),
('Saudi Building Solutions', 'Comprehensive building materials provider in KSA', 'https://api.dicebear.com/7.x/initials/svg?seed=SBS'),
('Egyptian Construction Supplies', 'Major supplier of construction materials in Egypt', 'https://api.dicebear.com/7.x/initials/svg?seed=ECS'),
('Kuwait Home Innovations', 'Premium home improvement products in Kuwait', 'https://api.dicebear.com/7.x/initials/svg?seed=KHI'),
('Luxury Interiors', 'High-end interior decoration materials', 'https://api.dicebear.com/7.x/initials/svg?seed=LI'),
('Tools & More', 'Specialized in professional construction tools', 'https://api.dicebear.com/7.x/initials/svg?seed=TM');
