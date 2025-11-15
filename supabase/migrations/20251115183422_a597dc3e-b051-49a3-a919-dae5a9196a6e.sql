-- Add custom_emoji column to games table for custom sport emojis
ALTER TABLE public.games 
ADD COLUMN custom_emoji text;

COMMENT ON COLUMN public.games.custom_emoji IS 'Optional custom emoji for OTHER sport type';