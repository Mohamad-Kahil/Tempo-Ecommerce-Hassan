-- Make supplier_id nullable in products table
ALTER TABLE products ALTER COLUMN supplier_id DROP NOT NULL;

-- Add a default supplier if one doesn't exist
INSERT INTO suppliers (id, name, contact_email, regions)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Supplier', 'supplier@example.com', ARRAY['Egypt'])
ON CONFLICT (id) DO NOTHING;
