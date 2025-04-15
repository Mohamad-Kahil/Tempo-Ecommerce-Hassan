-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default supplier
INSERT INTO suppliers (id, name, contact_email)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Supplier', 'supplier@example.com')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for suppliers
ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
