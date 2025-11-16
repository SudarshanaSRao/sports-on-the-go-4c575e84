-- Drop all existing triggers and function with CASCADE
DROP FUNCTION IF EXISTS public.update_post_votes() CASCADE;

-- Create new trigger function for independent vote counters
CREATE OR REPLACE FUNCTION public.update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment the appropriate counter based on vote_type
    IF NEW.vote_type = 'up' THEN
      UPDATE public.posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.vote_type = 'down' THEN
      UPDATE public.posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement the appropriate counter, but never go below 0
    IF OLD.vote_type = 'up' THEN
      UPDATE public.posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.post_id;
    ELSIF OLD.vote_type = 'down' THEN
      UPDATE public.posts SET downvotes = GREATEST(downvotes - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_post_votes_trigger
AFTER INSERT OR DELETE ON public.post_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_post_votes();

-- Reconcile existing data: fix all post vote counts based on actual post_votes records
UPDATE public.posts
SET 
  upvotes = COALESCE((
    SELECT COUNT(*) 
    FROM public.post_votes 
    WHERE post_votes.post_id = posts.id 
    AND post_votes.vote_type = 'up'
  ), 0),
  downvotes = COALESCE((
    SELECT COUNT(*) 
    FROM public.post_votes 
    WHERE post_votes.post_id = posts.id 
    AND post_votes.vote_type = 'down'
  ), 0);

-- Add check constraint to ensure vote_type is valid
ALTER TABLE public.post_votes DROP CONSTRAINT IF EXISTS check_vote_type;
ALTER TABLE public.post_votes 
ADD CONSTRAINT check_vote_type CHECK (vote_type IN ('up', 'down'));