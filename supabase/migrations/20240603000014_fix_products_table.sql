-- Ensure products table has the correct structure
ALTER TABLE IF EXISTS products
ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;

-- Ensure the image_urls column is properly initialized
UPDATE products
SET image_urls = '[]'::jsonb
WHERE image_urls IS NULL;
