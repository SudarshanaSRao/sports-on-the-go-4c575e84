-- Add RLS policy to prevent hosts from RSVPing to their own games
-- First, drop the existing policy that allows any authenticated user to create RSVPs
DROP POLICY IF EXISTS "Authenticated users can create RSVPs" ON public.rsvps;

-- Create a new policy that prevents hosts from creating RSVPs for their own games
CREATE POLICY "Users can create RSVPs but not for their own hosted games"
ON public.rsvps
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND NOT EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = rsvps.game_id 
    AND games.host_id = auth.uid()
  )
);