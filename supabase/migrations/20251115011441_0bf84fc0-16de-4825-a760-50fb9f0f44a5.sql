-- Remove the max_players constraint that limits to 50
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_max_players_check;

-- Add a new constraint that only enforces minimum of 2 players (no maximum)
ALTER TABLE public.games ADD CONSTRAINT games_max_players_check CHECK (max_players >= 2);