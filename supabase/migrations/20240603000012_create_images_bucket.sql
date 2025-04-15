-- Create a storage bucket for images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for the images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
