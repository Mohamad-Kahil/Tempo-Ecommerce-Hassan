-- Ensure the products table has the correct stock field
ALTER TABLE IF EXISTS products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
