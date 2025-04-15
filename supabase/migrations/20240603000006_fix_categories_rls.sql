-- Disable RLS for categories table
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
DROP POLICY IF EXISTS "Allow all operations" ON categories;
CREATE POLICY "Allow all operations"
  ON categories
  FOR ALL
  USING (true);

-- Enable realtime for categories table
alter publication supabase_realtime add table categories;
