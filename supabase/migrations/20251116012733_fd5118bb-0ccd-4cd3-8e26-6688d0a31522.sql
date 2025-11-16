-- Update notify_new_post function to include postId in action_url
CREATE OR REPLACE FUNCTION public.notify_new_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.community_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (
    user_id, type, title, message, related_post_id, related_community_id, related_user_id, action_url
  )
  SELECT cm.user_id,
         'new_post',
         'New post in community',
         'New post: ' || NEW.title,
         NEW.id,
         NEW.community_id,
         NEW.user_id,
         '/community?id=' || NEW.community_id::text || '&postId=' || NEW.id::text
  FROM public.community_members cm
  WHERE cm.community_id = NEW.community_id
    AND cm.user_id <> NEW.user_id
  ON CONFLICT (user_id, type, related_community_id) 
    WHERE is_read = false AND type = 'new_post'
  DO UPDATE SET
    notification_count = COALESCE(notifications.notification_count, 1) + 1,
    created_at = now(),
    message = 'New post: ' || NEW.title,
    related_post_id = NEW.id,
    action_url = '/community?id=' || NEW.community_id::text || '&postId=' || NEW.id::text;

  RETURN NEW;
END; $$;

-- Update notify_new_comment function to include postId in action_url
CREATE OR REPLACE FUNCTION public.notify_new_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author UUID;
  post_community UUID;
BEGIN
  SELECT user_id, community_id INTO post_author, post_community
  FROM public.posts
  WHERE id = NEW.post_id;

  -- Notify post author
  IF post_author IS NOT NULL AND post_author <> NEW.user_id THEN
    INSERT INTO public.notifications (
      user_id, type, title, message, related_post_id, related_community_id, related_user_id, action_url
    ) VALUES (
      post_author, 
      'new_comment', 
      'New comment', 
      'Someone replied to your post', 
      NEW.post_id, 
      post_community, 
      NEW.user_id, 
      '/community?id=' || COALESCE(post_community::text, '') || '&postId=' || NEW.post_id::text
    )
    ON CONFLICT (user_id, type, related_post_id)
      WHERE is_read = false AND type = 'new_comment'
    DO UPDATE SET
      notification_count = COALESCE(notifications.notification_count, 1) + 1,
      created_at = now(),
      action_url = '/community?id=' || COALESCE(post_community::text, '') || '&postId=' || NEW.post_id::text;
  END IF;

  -- Notify other commenters
  INSERT INTO public.notifications (
    user_id, type, title, message, related_post_id, related_community_id, related_user_id, action_url
  )
  SELECT DISTINCT c.user_id,
         'new_comment',
         'New comment',
         'New activity on a post you commented on',
         NEW.post_id,
         post_community,
         NEW.user_id,
         '/community?id=' || COALESCE(post_community::text, '') || '&postId=' || NEW.post_id::text
  FROM public.comments c
  WHERE c.post_id = NEW.post_id
    AND c.user_id NOT IN (NEW.user_id, COALESCE(post_author, NEW.user_id))
  ON CONFLICT (user_id, type, related_post_id)
    WHERE is_read = false AND type = 'new_comment'
  DO UPDATE SET
    notification_count = COALESCE(notifications.notification_count, 1) + 1,
    created_at = now(),
    action_url = '/community?id=' || COALESCE(post_community::text, '') || '&postId=' || NEW.post_id::text;

  RETURN NEW;
END; $$;