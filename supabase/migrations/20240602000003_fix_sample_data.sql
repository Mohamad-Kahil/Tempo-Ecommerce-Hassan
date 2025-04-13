-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'product-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images');

-- Create storage policy to allow public access to product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  level INTEGER DEFAULT 1,
  parent_id UUID REFERENCES categories(id),
  slug TEXT UNIQUE
);

-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  logo_url TEXT,
  regions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
  END IF;
END $$;

-- Add supplier_id column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'supplier_id') THEN
    ALTER TABLE products ADD COLUMN supplier_id UUID REFERENCES suppliers(id);
  END IF;
END $$;

-- Enable realtime for categories and suppliers
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'categories') THEN
    alter publication supabase_realtime add table categories;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'suppliers') THEN
    alter publication supabase_realtime add table suppliers;
  END IF;
END $$;

-- Insert sample categories
INSERT INTO categories (name, description, level, slug, image_url)
VALUES
('Flooring', 'All types of flooring materials', 1, 'flooring', 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500&q=80'),
('Wall Coverings', 'Materials for wall decoration and protection', 1, 'wall-coverings', 'https://images.unsplash.com/photo-1589407361968-f0efee8f11fe?w=500&q=80'),
('Bathroom', 'Bathroom fixtures and accessories', 1, 'bathroom', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80'),
('Kitchen', 'Kitchen fixtures and materials', 1, 'kitchen', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80'),
('Lighting', 'Indoor and outdoor lighting solutions', 1, 'lighting', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&q=80');

-- Insert sample suppliers
INSERT INTO suppliers (name, description, contact_email, contact_phone, website, logo_url, regions)
VALUES
('Dubai Ceramics', 'Leading supplier of ceramic and porcelain tiles in the UAE', 'info@dubaiceramics.com', '+971-4-123-4567', 'https://dubaiceramics.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DubaiCeramics', ARRAY['UAE', 'Saudi Arabia']),
('Al Futtaim Building Materials', 'Major distributor of construction materials across MENA', 'contact@alfuttaim.com', '+971-4-987-6543', 'https://alfuttaim.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlFuttaim', ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt']),
('Saudi Building Solutions', 'Premium building materials supplier based in Riyadh', 'info@saudibuilding.com', '+966-11-234-5678', 'https://saudibuilding.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaudiBuilding', ARRAY['Saudi Arabia', 'UAE']),
('Egyptian Construction Supplies', 'Comprehensive supplier of construction materials in Egypt', 'sales@egyptconstruction.com', '+20-2-345-6789', 'https://egyptconstruction.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EgyptConstruction', ARRAY['Egypt']),
('Kuwait Home Innovations', 'Innovative home improvement solutions in Kuwait', 'info@kuwaithome.com', '+965-2345-6789', 'https://kuwaithome.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=KuwaitHome', ARRAY['Kuwait', 'UAE']),
('Luxury Interiors', 'High-end interior decoration materials and solutions', 'contact@luxuryinteriors.com', '+971-4-567-8901', 'https://luxuryinteriors.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuxuryInteriors', ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt']),
('Modern Lighting Solutions', 'Specialized in contemporary lighting fixtures for residential and commercial spaces', 'sales@modernlighting.com', '+971-4-789-0123', 'https://modernlighting.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ModernLighting', ARRAY['UAE', 'Saudi Arabia']),
('Cairo Marble & Granite', 'Premium supplier of natural stone products from Egyptian quarries', 'info@cairomarble.com', '+20-2-456-7890', 'https://cairomarble.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CairoMarble', ARRAY['Egypt', 'UAE', 'Saudi Arabia']),
('Gulf Kitchen Systems', 'Complete kitchen solutions for residential and commercial projects', 'contact@gulfkitchen.com', '+966-12-345-6789', 'https://gulfkitchen.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GulfKitchen', ARRAY['Saudi Arabia', 'UAE', 'Kuwait']),
('Riyadh Wood Works', 'Custom wooden flooring and furniture for luxury projects', 'info@riyadhwood.com', '+966-11-987-6543', 'https://riyadhwood.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=RiyadhWood', ARRAY['Saudi Arabia']),
('Kuwait Bathroom Innovations', 'Modern bathroom fixtures and accessories', 'sales@kuwaitbathroom.com', '+965-3456-7890', 'https://kuwaitbathroom.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=KuwaitBathroom', ARRAY['Kuwait']),
('Alexandria Paints & Coatings', 'High-quality paints and wall coatings for interior and exterior use', 'info@alexandriapaints.com', '+20-3-567-8901', 'https://alexandriapaints.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexandriaPaints', ARRAY['Egypt']),
('Dubai Smart Homes', 'Integrated smart home solutions and automation systems', 'support@dubaismarthomes.com', '+971-4-234-5678', 'https://dubaismarthomes.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DubaiSmartHomes', ARRAY['UAE']),
('Jeddah Tile Factory', 'Manufacturer of premium ceramic and porcelain tiles', 'orders@jeddahtile.com', '+966-12-876-5432', 'https://jeddahtile.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=JeddahTile', ARRAY['Saudi Arabia', 'UAE']),
('Kuwait Glass Industries', 'Specialized in decorative and functional glass solutions', 'info@kuwaitglass.com', '+965-4567-8901', 'https://kuwaitglass.example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=KuwaitGlass', ARRAY['Kuwait', 'UAE']);