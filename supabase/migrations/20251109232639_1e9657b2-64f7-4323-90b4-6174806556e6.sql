-- Add player_waiver_accepted column to profiles table to track liability waiver acceptance
ALTER TABLE public.profiles 
ADD COLUMN player_waiver_accepted boolean DEFAULT false,
ADD COLUMN player_waiver_accepted_at timestamp with time zone DEFAULT NULL;