-- Add custom_sport_name column to games table
ALTER TABLE public.games 
ADD COLUMN custom_sport_name text;

-- Add a comment to describe the column
COMMENT ON COLUMN public.games.custom_sport_name IS 'Custom sport name when sport type is OTHER';