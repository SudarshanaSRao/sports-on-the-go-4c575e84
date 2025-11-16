
-- Drop the trigger if it exists to avoid errors
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON public.community_members;

-- Create trigger to automatically update member_count when members join or leave
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_community_member_count();

-- Recalculate all existing member counts to fix any incorrect data
UPDATE public.communities
SET member_count = (
  SELECT COUNT(*)
  FROM public.community_members
  WHERE community_members.community_id = communities.id
);
