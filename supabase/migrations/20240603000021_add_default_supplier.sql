-- Add default supplier if it doesn't exist
INSERT INTO suppliers (id, name, contact_email, regions)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Supplier', 'supplier@example.com', ARRAY['Egypt'])
ON CONFLICT (id) DO NOTHING;
