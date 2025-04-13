-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sku TEXT UNIQUE,
  slug TEXT UNIQUE,
  brand TEXT,
  rating NUMERIC,
  review_count INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  discount NUMERIC,
  regions TEXT[],
  features TEXT[],
  tags TEXT[],
  specifications JSONB,
  delivery_time TEXT
);

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  type TEXT DEFAULT 'gallery',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for products and product_images
DO $ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
    alter publication supabase_realtime add table products;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'product_images') THEN
    alter publication supabase_realtime add table product_images;
  END IF;
END $;

-- Insert sample products
INSERT INTO products (name, description, price, currency, category_id, supplier_id, stock, rating, review_count, is_featured, is_new, discount, regions, sku, slug, brand, features, specifications)
VALUES
-- Flooring Category
(
  'Premium Ceramic Floor Tile - Marble Effect',
  'High-quality ceramic floor tiles with elegant marble effect. Perfect for kitchens, bathrooms, and living areas. Durable, stain-resistant, and easy to clean.',
  249.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Flooring' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Dubai Ceramics' LIMIT 1),
  56,
  4.7,
  124,
  true,
  false,
  0,
  ARRAY['UAE', 'Saudi Arabia'],
  'FLR-TILE-001',
  'premium-ceramic-floor-tile-marble',
  'CeramicPro',
  ARRAY['Stain-resistant', 'Easy to clean', 'Durable', 'Elegant finish'],
  '{"dimensions": "60cm x 60cm", "thickness": "10mm", "material": "Ceramic", "finish": "Polished", "color": "White/Gray Marble", "package_quantity": "10 tiles per box", "coverage": "3.6 sq.m per box"}'::jsonb
),
(
  'Luxury Vinyl Flooring - Wood Effect',
  'Premium vinyl flooring with realistic wood effect. Water-resistant, durable, and easy to install. Ideal for high-traffic areas.',
  189.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Flooring' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Al Futtaim Building Materials' LIMIT 1),
  78,
  4.5,
  98,
  false,
  true,
  10,
  ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt'],
  'FLR-VINYL-002',
  'luxury-vinyl-flooring-wood-effect',
  'VinylLux',
  ARRAY['Water-resistant', 'Easy installation', 'Realistic wood texture', 'Durable'],
  '{"dimensions": "122cm x 18cm", "thickness": "5mm", "material": "Vinyl", "finish": "Textured", "color": "Oak", "package_quantity": "8 planks per box", "coverage": "1.76 sq.m per box"}'::jsonb
),
(
  'Natural Stone Flooring Tiles',
  'Authentic natural stone tiles for indoor and outdoor use. Each tile has unique patterns and colors. Extremely durable and adds elegance to any space.',
  349.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Flooring' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Saudi Building Solutions' LIMIT 1),
  32,
  4.8,
  76,
  true,
  false,
  0,
  ARRAY['Saudi Arabia', 'UAE'],
  'FLR-STONE-003',
  'natural-stone-flooring-tiles',
  'StoneMaster',
  ARRAY['Natural material', 'Unique patterns', 'Indoor/outdoor use', 'Frost-resistant'],
  '{"dimensions": "40cm x 40cm", "thickness": "12mm", "material": "Natural Stone", "finish": "Honed", "color": "Multi-color", "package_quantity": "6 tiles per box", "coverage": "0.96 sq.m per box"}'::jsonb
),

-- Wall Coverings Category
(
  'Premium Interior Wall Paint - Matte Finish',
  'High-quality interior wall paint with excellent coverage. Low VOC, washable, and long-lasting. Available in various colors.',
  129.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Wall Coverings' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Egyptian Construction Supplies' LIMIT 1),
  120,
  4.6,
  152,
  false,
  false,
  5,
  ARRAY['Egypt'],
  'WALL-PAINT-001',
  'premium-interior-wall-paint-matte',
  'ColorMaster',
  ARRAY['Low VOC', 'Washable', 'Excellent coverage', 'Long-lasting'],
  '{"volume": "5L", "coverage_area": "Up to 50 sq.m", "finish": "Matte", "drying_time": "2-4 hours", "recoat_time": "4-6 hours", "color": "Various"}'::jsonb
),
(
  'Decorative 3D Wall Panels',
  'Modern 3D wall panels to add texture and style to any room. Easy to install, paintable, and moisture-resistant.',
  199.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Wall Coverings' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Luxury Interiors' LIMIT 1),
  45,
  4.7,
  89,
  true,
  true,
  0,
  ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt'],
  'WALL-3D-002',
  'decorative-3d-wall-panels',
  'WallArt',
  ARRAY['Easy installation', 'Paintable', 'Moisture-resistant', 'Textured design'],
  '{"dimensions": "50cm x 50cm", "material": "PVC", "thickness": "8mm", "package_quantity": "12 panels per box", "coverage": "3 sq.m per box", "color": "White (paintable)"}'::jsonb
),

-- Bathroom Category
(
  'Modern Bathroom Vanity Set',
  'Complete bathroom vanity set including cabinet, sink, and mirror. Contemporary design with ample storage space.',
  899.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Bathroom' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Kuwait Home Innovations' LIMIT 1),
  18,
  4.9,
  67,
  true,
  false,
  15,
  ARRAY['Kuwait', 'UAE'],
  'BATH-VANITY-001',
  'modern-bathroom-vanity-set',
  'BathElite',
  ARRAY['Soft-close drawers', 'Ceramic sink', 'LED mirror', 'Waterproof finish'],
  '{"dimensions": "120cm x 60cm x 85cm", "material": "MDF with waterproof coating", "sink_material": "Ceramic", "mirror_dimensions": "120cm x 70cm", "includes": "Cabinet, sink, mirror, mounting hardware"}'::jsonb
),
(
  'Rainfall Shower Head System',
  'Luxury rainfall shower system with handheld sprayer. Adjustable water pressure and multiple spray patterns.',
  349.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Bathroom' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Al Futtaim Building Materials' LIMIT 1),
  42,
  4.7,
  112,
  false,
  true,
  0,
  ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt'],
  'BATH-SHOWER-002',
  'rainfall-shower-head-system',
  'AquaLuxe',
  ARRAY['Rainfall head', 'Handheld sprayer', 'Multiple spray patterns', 'Easy installation'],
  '{"rainfall_head_dimensions": "25cm x 25cm", "material": "Stainless Steel", "finish": "Chrome", "spray_patterns": "5", "includes": "Rainfall head, handheld sprayer, hose, mounting hardware"}'::jsonb
),

-- Kitchen Category
(
  'Granite Kitchen Countertop',
  'Premium granite countertop for kitchens. Heat-resistant, durable, and adds elegance to any kitchen design.',
  1299.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Kitchen' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Saudi Building Solutions' LIMIT 1),
  15,
  4.8,
  54,
  true,
  false,
  0,
  ARRAY['Saudi Arabia', 'UAE'],
  'KITCH-COUNTER-001',
  'granite-kitchen-countertop',
  'StoneElite',
  ARRAY['Heat-resistant', 'Scratch-resistant', 'Unique patterns', 'Polished finish'],
  '{"thickness": "3cm", "material": "Natural Granite", "edge_profile": "Bullnose", "finish": "Polished", "color": "Various", "custom_sizing": "Available"}'::jsonb
),
(
  'Modern Kitchen Faucet - Stainless Steel',
  'Contemporary kitchen faucet with pull-down sprayer. Spot-resistant stainless steel finish and easy installation.',
  249.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Kitchen' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Kuwait Home Innovations' LIMIT 1),
  38,
  4.6,
  87,
  false,
  false,
  10,
  ARRAY['Kuwait', 'UAE'],
  'KITCH-FAUCET-002',
  'modern-kitchen-faucet-stainless',
  'FlowMaster',
  ARRAY['Pull-down sprayer', 'Spot-resistant finish', 'Single handle', 'Easy installation'],
  '{"height": "45cm", "material": "Stainless Steel", "finish": "Brushed Nickel", "handle_type": "Single lever", "spray_modes": "2", "installation": "Deck mount"}'::jsonb
),

-- Lighting Category
(
  'Modern Pendant Light Fixture',
  'Contemporary pendant light fixture for dining areas and kitchens. Adjustable height and compatible with LED bulbs.',
  179.99,
  'AED',
  (SELECT id FROM categories WHERE name = 'Lighting' LIMIT 1),
  (SELECT id FROM suppliers WHERE name = 'Luxury Interiors' LIMIT 1),
  52,
  4.5,
  93,
  true,
  true,
  0,
  ARRAY['UAE', 'Saudi Arabia', 'Kuwait', 'Egypt'],
  'LIGHT-PEND-001',
  'modern-pendant-light-fixture',
  'LightCraft',
  ARRAY['Adjustable height', 'LED compatible', 'Modern design', 'Easy installation'],
  '{"dimensions": "30cm diameter", "material": "Metal and Glass", "color": "Black/Clear", "bulb_type": "E27", "max_wattage": "60W", "includes": "Fixture, mounting hardware, ceiling canopy"}'::jsonb
);

-- Insert product images
INSERT INTO product_images (product_id, url, alt, sort_order, type)
VALUES
-- Premium Ceramic Floor Tile images
(
  (SELECT id FROM products WHERE slug = 'premium-ceramic-floor-tile-marble' LIMIT 1),
  'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
  'Marble effect ceramic floor tile - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'premium-ceramic-floor-tile-marble' LIMIT 1),
  'https://images.unsplash.com/photo-1600607687644-c7ddd0d03d62?w=800&q=80',
  'Marble effect ceramic floor tile - close-up',
  2,
  'gallery'
),
(
  (SELECT id FROM products WHERE slug = 'premium-ceramic-floor-tile-marble' LIMIT 1),
  'https://images.unsplash.com/photo-1600607687920-4e4a92f082f6?w=800&q=80',
  'Marble effect ceramic floor tile - room view',
  3,
  'gallery'
),

-- Luxury Vinyl Flooring images
(
  (SELECT id FROM products WHERE slug = 'luxury-vinyl-flooring-wood-effect' LIMIT 1),
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',
  'Wood effect vinyl flooring - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'luxury-vinyl-flooring-wood-effect' LIMIT 1),
  'https://images.unsplash.com/photo-1581229876834-176c5b6f7e5c?w=800&q=80',
  'Wood effect vinyl flooring - installed view',
  2,
  'gallery'
),

-- Natural Stone Flooring images
(
  (SELECT id FROM products WHERE slug = 'natural-stone-flooring-tiles' LIMIT 1),
  'https://images.unsplash.com/photo-1604743315016-a9f473c3e776?w=800&q=80',
  'Natural stone flooring tiles - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'natural-stone-flooring-tiles' LIMIT 1),
  'https://images.unsplash.com/photo-1604743315293-9b3636d2f787?w=800&q=80',
  'Natural stone flooring tiles - close-up',
  2,
  'gallery'
),

-- Premium Interior Wall Paint images
(
  (SELECT id FROM products WHERE slug = 'premium-interior-wall-paint-matte' LIMIT 1),
  'https://images.unsplash.com/photo-1589407361968-f0efee8f11fe?w=800&q=80',
  'Interior wall paint - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'premium-interior-wall-paint-matte' LIMIT 1),
  'https://images.unsplash.com/photo-1580893246395-52aead8960dc?w=800&q=80',
  'Interior wall paint - application',
  2,
  'gallery'
),

-- Decorative 3D Wall Panels images
(
  (SELECT id FROM products WHERE slug = 'decorative-3d-wall-panels' LIMIT 1),
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
  '3D wall panels - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'decorative-3d-wall-panels' LIMIT 1),
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
  '3D wall panels - installed view',
  2,
  'gallery'
),

-- Modern Bathroom Vanity Set images
(
  (SELECT id FROM products WHERE slug = 'modern-bathroom-vanity-set' LIMIT 1),
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Bathroom vanity set - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'modern-bathroom-vanity-set' LIMIT 1),
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
  'Bathroom vanity set - detail view',
  2,
  'gallery'
),

-- Rainfall Shower Head System images
(
  (SELECT id FROM products WHERE slug = 'rainfall-shower-head-system' LIMIT 1),
  'https://images.unsplash.com/photo-1575245121636-3f359ab4e40a?w=800&q=80',
  'Rainfall shower system - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'rainfall-shower-head-system' LIMIT 1),
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
  'Rainfall shower system - installed view',
  2,
  'gallery'
),

-- Granite Kitchen Countertop images
(
  (SELECT id FROM products WHERE slug = 'granite-kitchen-countertop' LIMIT 1),
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  'Granite kitchen countertop - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'granite-kitchen-countertop' LIMIT 1),
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
  'Granite kitchen countertop - close-up',
  2,
  'gallery'
),

-- Modern Kitchen Faucet images
(
  (SELECT id FROM products WHERE slug = 'modern-kitchen-faucet-stainless' LIMIT 1),
  'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=800&q=80',
  'Kitchen faucet - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'modern-kitchen-faucet-stainless' LIMIT 1),
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Kitchen faucet - installed view',
  2,
  'gallery'
),

-- Modern Pendant Light Fixture images
(
  (SELECT id FROM products WHERE slug = 'modern-pendant-light-fixture' LIMIT 1),
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80',
  'Pendant light fixture - main view',
  1,
  'thumbnail'
),
(
  (SELECT id FROM products WHERE slug = 'modern-pendant-light-fixture' LIMIT 1),
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
  'Pendant light fixture - installed view',
  2,
  'gallery'
);
