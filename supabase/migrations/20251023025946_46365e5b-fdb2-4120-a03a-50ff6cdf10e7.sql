-- Drop the existing restrictive delete policy
DROP POLICY IF EXISTS "Community admins can delete their communities" ON public.communities;

-- Create a more robust delete policy that allows both creators and admins
CREATE POLICY "Creators and admins can delete communities" 
ON public.communities 
FOR DELETE 
USING (
  -- Allow if user is the creator
  (created_by = auth.uid()) 
  OR 
  -- OR if user is an admin member
  (EXISTS (
    SELECT 1
    FROM community_members
    WHERE community_members.community_id = communities.id 
      AND community_members.user_id = auth.uid() 
      AND community_members.role = 'admin'
  ))
);