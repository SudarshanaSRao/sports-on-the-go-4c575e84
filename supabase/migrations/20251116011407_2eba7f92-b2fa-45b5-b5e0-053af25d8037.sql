-- Create/replace server-side notification functions and triggers (idempotent)

CREATE OR REPLACE FUNCTION public.notify_new_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
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
         '/community?id=' || NEW.community_id::text
  FROM public.community_members cm
  WHERE cm.community_id = NEW.community_id
    AND cm.user_id <> NEW.user_id;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_new_post ON public.posts;
CREATE TRIGGER trg_notify_new_post
AFTER INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_post();

CREATE OR REPLACE FUNCTION public.notify_new_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  post_author UUID;
  post_community UUID;
BEGIN
  SELECT user_id, community_id INTO post_author, post_community
  FROM public.posts
  WHERE id = NEW.post_id;

  IF post_author IS NOT NULL AND post_author <> NEW.user_id THEN
    INSERT INTO public.notifications (
      user_id, type, title, message, related_post_id, related_community_id, related_user_id, action_url
    ) VALUES (
      post_author, 'new_comment', 'New comment', 'Someone replied to your post', NEW.post_id, post_community, NEW.user_id, '/community?id=' || COALESCE(post_community::text, '')
    );
  END IF;

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
         '/community?id=' || COALESCE(post_community::text, '')
  FROM public.comments c
  WHERE c.post_id = NEW.post_id
    AND c.user_id NOT IN (NEW.user_id, COALESCE(post_author, NEW.user_id));

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_new_comment ON public.comments;
CREATE TRIGGER trg_notify_new_comment
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_comment();