-- Create friendship status enum
CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- Create friendships table
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Prevent duplicate friend requests
  CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id),
  -- Prevent self-friending
  CONSTRAINT no_self_friend CHECK (requester_id != addressee_id)
);

-- Indexes for performance
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id AND status = 'PENDING');

CREATE POLICY "Users can update their friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can delete their friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Function to get mutual friends count
CREATE OR REPLACE FUNCTION public.get_mutual_friends_count(user_id_1 UUID, user_id_2 UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT f1.addressee_id)::INTEGER
  FROM friendships f1
  INNER JOIN friendships f2 
    ON f1.addressee_id = f2.addressee_id
  WHERE f1.requester_id = user_id_1 
    AND f2.requester_id = user_id_2
    AND f1.status = 'ACCEPTED'
    AND f2.status = 'ACCEPTED';
$$ LANGUAGE SQL STABLE;

-- Function to check friendship status between two users
CREATE OR REPLACE FUNCTION public.get_friendship_status(user_id_1 UUID, user_id_2 UUID)
RETURNS friendship_status AS $$
  SELECT status
  FROM friendships
  WHERE (requester_id = user_id_1 AND addressee_id = user_id_2)
     OR (requester_id = user_id_2 AND addressee_id = user_id_1)
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Update games RLS policy for FRIENDS_ONLY visibility
DROP POLICY IF EXISTS "Public games are viewable by everyone" ON public.games;

CREATE POLICY "Games are viewable based on visibility"
  ON public.games FOR SELECT
  USING (
    visibility = 'PUBLIC'::game_visibility 
    OR host_id = auth.uid()
    OR (
      visibility = 'FRIENDS_ONLY'::game_visibility 
      AND EXISTS (
        SELECT 1 FROM friendships 
        WHERE status = 'ACCEPTED'
          AND ((requester_id = auth.uid() AND addressee_id = host_id)
               OR (requester_id = host_id AND addressee_id = auth.uid()))
      )
    )
  );

-- Update communities RLS policy for FRIENDS_ONLY visibility
DROP POLICY IF EXISTS "Public communities are viewable by everyone" ON public.communities;

CREATE POLICY "Communities are viewable based on visibility"
  ON public.communities FOR SELECT
  USING (
    visibility = 'PUBLIC'::community_visibility
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = communities.id AND user_id = auth.uid()
    )
    OR (
      visibility = 'FRIENDS_ONLY'::community_visibility
      AND EXISTS (
        SELECT 1 FROM friendships
        WHERE status = 'ACCEPTED'
          AND ((requester_id = auth.uid() AND addressee_id = created_by)
               OR (requester_id = created_by AND addressee_id = auth.uid()))
      )
    )
  );

-- Enable realtime for friendships
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;