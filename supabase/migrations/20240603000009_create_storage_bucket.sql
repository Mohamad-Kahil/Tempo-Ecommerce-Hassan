-- Create images bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('images', 'images', true);
  END IF;
END
$$;

-- Set up storage policy for public access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated uploads
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
CREATE POLICY "Allow uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow authenticated updates
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
CREATE POLICY "Allow updates"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

-- Allow authenticated deletes
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;
CREATE POLICY "Allow deletes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');
