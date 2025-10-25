-- Make city and zip_code nullable in profiles table
ALTER TABLE public.profiles 
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN zip_code DROP NOT NULL;

-- Update the handle_new_user trigger to NOT populate city and zip_code
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
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL)
  );
  RETURN NEW;
END;
$function$;