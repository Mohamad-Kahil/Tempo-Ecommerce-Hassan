-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  image_urls TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  sku TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations
DROP POLICY IF EXISTS "Allow all operations" ON products;
CREATE POLICY "Allow all operations"
  ON products
  FOR ALL
  USING (true);

-- Enable realtime for products table
alter publication supabase_realtime add table products;
