-- Add visibility enum and column to communities table
DO $$ BEGIN
  CREATE TYPE community_visibility AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'INVITE_ONLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add visibility column to communities table
ALTER TABLE public.communities 
ADD COLUMN IF NOT EXISTS visibility community_visibility DEFAULT 'PUBLIC'::community_visibility;

-- Update RLS policies for communities based on visibility
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;

CREATE POLICY "Public communities are viewable by everyone"
ON public.communities
FOR SELECT
USING (
  visibility = 'PUBLIC'::community_visibility
  OR created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.community_members
    WHERE community_members.community_id = communities.id
    AND community_members.user_id = auth.uid()
  )
);