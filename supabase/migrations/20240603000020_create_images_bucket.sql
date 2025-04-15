-- Create images bucket if it doesn't exist
BEGIN;
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;
COMMIT;
