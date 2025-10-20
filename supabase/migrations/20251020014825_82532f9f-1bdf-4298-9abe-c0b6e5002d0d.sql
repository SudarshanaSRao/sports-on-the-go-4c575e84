-- Add sport column to communities table
ALTER TABLE public.communities 
ADD COLUMN sport sport_type;

-- Update existing communities to have a default sport
UPDATE public.communities 
SET sport = 'BASKETBALL' 
WHERE sport IS NULL;