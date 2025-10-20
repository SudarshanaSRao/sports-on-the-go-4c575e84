-- Fix member counts for existing communities by recalculating from actual members
UPDATE public.communities
SET member_count = (
  SELECT COUNT(*)
  FROM public.community_members
  WHERE community_members.community_id = communities.id
);