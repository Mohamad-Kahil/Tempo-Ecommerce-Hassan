-- Disable RLS for categories table
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON categories;
CREATE POLICY "Allow all operations for authenticated users"
  ON categories
  FOR ALL
  USING (true);

-- Enable realtime for categories table
alter publication supabase_realtime add table categories;