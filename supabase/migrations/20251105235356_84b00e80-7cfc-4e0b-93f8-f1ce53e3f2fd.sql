-- Add country field to games table and make state/zip_code nullable for international addresses
ALTER TABLE public.games 
ADD COLUMN country text NOT NULL DEFAULT 'United States';

-- Make state and zip_code nullable since not all countries use these
ALTER TABLE public.games 
ALTER COLUMN state DROP NOT NULL,
ALTER COLUMN zip_code DROP NOT NULL;