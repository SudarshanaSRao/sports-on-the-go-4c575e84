-- Create saved_games table for users to bookmark games they're interested in
CREATE TABLE public.saved_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_games ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved games
CREATE POLICY "Users can view their own saved games"
ON public.saved_games
FOR SELECT
USING (auth.uid() = user_id);

-- Users can save games
CREATE POLICY "Users can save games"
ON public.saved_games
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unsave games
CREATE POLICY "Users can unsave games"
ON public.saved_games
FOR DELETE
USING (auth.uid() = user_id);