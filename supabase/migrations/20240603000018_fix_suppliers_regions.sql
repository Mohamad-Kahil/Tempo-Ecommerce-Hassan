-- Create suppliers table if it doesn't exist with regions array
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  regions TEXT[] NOT NULL DEFAULT ARRAY['Egypt'],
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default supplier with regions
INSERT INTO suppliers (id, name, contact_email, regions)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Supplier', 'supplier@example.com', ARRAY['Egypt'])
ON CONFLICT (id) DO NOTHING;

-- Suppliers table is already part of supabase_realtime publication
