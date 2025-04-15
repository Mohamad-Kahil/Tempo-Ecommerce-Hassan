-- Update auth.users to include role information if not already present
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name)
  VALUES (new.id, 
          COALESCE(new.raw_user_meta_data->>'full_name', ''),
          '');
  
  -- Set default role to 'viewer' if not specified
  IF new.raw_app_meta_data->>'role' IS NULL THEN
    new.raw_app_meta_data := 
      COALESCE(new.raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', 'viewer');
    new.app_metadata := new.raw_app_meta_data;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add role column to users table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'role') THEN
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'viewer';
  END IF;
END
$$;
