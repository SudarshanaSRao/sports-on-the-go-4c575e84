-- Remove cost_per_person column from games table
ALTER TABLE public.games DROP COLUMN IF EXISTS cost_per_person;