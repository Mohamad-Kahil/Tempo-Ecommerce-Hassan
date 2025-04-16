-- Create a folder for brand logos in the images bucket
INSERT INTO storage.objects (bucket_id, name, owner, created_at, updated_at, metadata)
VALUES ('images', 'brand-logos/', auth.uid(), now(), now(), '{"mimetype": "application/x-directory"}')
ON CONFLICT (bucket_id, name) DO NOTHING;
