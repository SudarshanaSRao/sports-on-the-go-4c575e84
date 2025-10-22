-- Make first_name and last_name nullable in profiles table
-- since signup doesn't collect these fields yet
ALTER TABLE public.profiles 
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL;

-- Update the handle_new_user function to handle missing names gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    date_of_birth,
    city,
    zip_code,
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'zip_code', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL)
  );
  RETURN NEW;
END;
$function$;