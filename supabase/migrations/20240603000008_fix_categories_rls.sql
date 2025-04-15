-- Disable RLS for categories table
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert access for all users" ON categories;
DROP POLICY IF EXISTS "Enable update access for all users" ON categories;
DROP POLICY IF EXISTS "Enable delete access for all users" ON categories;

-- Create policies for all operations
CREATE POLICY "Enable read access for all users"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON categories FOR UPDATE
USING (true);

CREATE POLICY "Enable delete access for all users"
ON categories FOR DELETE
USING (true);

-- Enable RLS but with permissive policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
