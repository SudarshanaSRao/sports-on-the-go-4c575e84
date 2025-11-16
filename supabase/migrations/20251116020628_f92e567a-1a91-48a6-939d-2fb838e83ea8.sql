-- Allow independent like/dislike votes per user per post
-- Drop the unique constraint that prevents a user from having both up and down votes
DROP INDEX IF EXISTS public.idx_post_votes_unique;

-- Create a new unique constraint on post_id, user_id, AND vote_type
-- This allows a user to have one "up" vote and one "down" vote on the same post
CREATE UNIQUE INDEX idx_post_votes_unique_type ON public.post_votes (post_id, user_id, vote_type);
