-- 1) Simplify counters: add score and comment_count to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0;

-- 2) Remove previous vote counter machinery
DROP TRIGGER IF EXISTS update_post_votes_trigger ON public.post_votes;
DROP FUNCTION IF EXISTS public.update_post_votes() CASCADE;

-- 3) RPC to adjust post score atomically (any authenticated user)
CREATE OR REPLACE FUNCTION public.adjust_post_score(p_post_id uuid, p_delta integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_score integer;
BEGIN
  -- Basic sanity: require an authenticated user
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.posts
  SET score = score + p_delta
  WHERE id = p_post_id
  RETURNING score INTO new_score;

  RETURN new_score;
END;
$$;

-- 4) Comment count trigger: keep it in sync on insert/delete
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_comments_insert ON public.comments;
DROP TRIGGER IF EXISTS trg_comments_delete ON public.comments;

CREATE TRIGGER trg_comments_insert
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_post_comment_count();

CREATE TRIGGER trg_comments_delete
AFTER DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_post_comment_count();

-- 5) Backfill current values from existing data
UPDATE public.posts p
SET score = COALESCE(p.upvotes, 0) - COALESCE(p.downvotes, 0);

UPDATE public.posts p
SET comment_count = COALESCE((SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id), 0);
