-- Create function to notify on friend request
CREATE OR REPLACE FUNCTION public.notify_friend_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_name TEXT;
BEGIN
  -- Only notify on new PENDING friend requests
  IF NEW.status != 'PENDING' THEN
    RETURN NEW;
  END IF;

  -- Get requester's name
  SELECT COALESCE(username, first_name || ' ' || last_name, 'Someone')
  INTO requester_name
  FROM public.profiles
  WHERE id = NEW.requester_id;

  -- Create notification for the addressee
  INSERT INTO public.notifications (
    user_id, 
    type, 
    title, 
    message, 
    related_user_id, 
    action_url
  ) VALUES (
    NEW.addressee_id,
    'friend_request',
    'New friend request',
    requester_name || ' sent you a friend request',
    NEW.requester_id,
    '/friends'
  );

  RETURN NEW;
END; $$;

-- Create trigger for friend requests
DROP TRIGGER IF EXISTS trigger_notify_friend_request ON public.friendships;
CREATE TRIGGER trigger_notify_friend_request
  AFTER INSERT ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_friend_request();

-- Also add a column to store friendship_id in notifications for easy reference
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS related_friendship_id UUID REFERENCES public.friendships(id) ON DELETE CASCADE;

-- Update the notify function to include friendship_id
CREATE OR REPLACE FUNCTION public.notify_friend_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_name TEXT;
BEGIN
  -- Only notify on new PENDING friend requests
  IF NEW.status != 'PENDING' THEN
    RETURN NEW;
  END IF;

  -- Get requester's name
  SELECT COALESCE(username, first_name || ' ' || last_name, 'Someone')
  INTO requester_name
  FROM public.profiles
  WHERE id = NEW.requester_id;

  -- Create notification for the addressee
  INSERT INTO public.notifications (
    user_id, 
    type, 
    title, 
    message, 
    related_user_id,
    related_friendship_id,
    action_url
  ) VALUES (
    NEW.addressee_id,
    'friend_request',
    'New friend request',
    requester_name || ' sent you a friend request',
    NEW.requester_id,
    NEW.id,
    '/friends'
  );

  RETURN NEW;
END; $$;