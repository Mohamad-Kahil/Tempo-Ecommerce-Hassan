-- Disable RLS on suppliers table
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- Disable RLS on advertisements table for hero sections and banners
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
