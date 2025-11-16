-- Ensure stable, server-authoritative vote counts and safe upserts
-- 1) Unique constraint/index for one-vote-per-user-per-post
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_votes_unique ON public.post_votes (post_id, user_id);

-- 2) Unique index for tracking last view per user per post (required for upsert)
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_views_unique ON public.post_views (post_id, user_id);

-- 3) Trigger to keep posts.upvotes/downvotes in sync with post_votes
DROP TRIGGER IF EXISTS trg_update_post_votes_insert ON public.post_votes;
DROP TRIGGER IF EXISTS trg_update_post_votes_update ON public.post_votes;
DROP TRIGGER IF EXISTS trg_update_post_votes_delete ON public.post_votes;

CREATE TRIGGER trg_update_post_votes_insert
AFTER INSERT ON public.post_votes
FOR EACH ROW EXECUTE FUNCTION public.update_post_votes();

CREATE TRIGGER trg_update_post_votes_update
AFTER UPDATE ON public.post_votes
FOR EACH ROW EXECUTE FUNCTION public.update_post_votes();

CREATE TRIGGER trg_update_post_votes_delete
AFTER DELETE ON public.post_votes
FOR EACH ROW EXECUTE FUNCTION public.update_post_votes();

-- 4) Helpful index for comment lookups/counts per post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments (post_id);
