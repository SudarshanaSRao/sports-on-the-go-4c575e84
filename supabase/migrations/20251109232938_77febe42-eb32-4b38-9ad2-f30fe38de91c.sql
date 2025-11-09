-- Add terms version tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN accepted_terms_version text DEFAULT '1.0',
ADD COLUMN terms_last_accepted_at timestamp with time zone DEFAULT NULL;

-- Update existing users to have version 1.0 already accepted
UPDATE public.profiles 
SET accepted_terms_version = '1.0',
    terms_last_accepted_at = COALESCE(terms_last_accepted_at, created_at)
WHERE accepted_terms_version IS NULL OR accepted_terms_version = '1.0';