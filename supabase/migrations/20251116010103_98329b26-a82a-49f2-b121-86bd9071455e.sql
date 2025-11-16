-- Create table to track when users last viewed posts
CREATE TABLE public.post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Users can view their own post views
CREATE POLICY "Users can view their own post views"
  ON public.post_views
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own post views
CREATE POLICY "Users can insert their own post views"
  ON public.post_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own post views
CREATE POLICY "Users can update their own post views"
  ON public.post_views
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_post_views_user_post ON public.post_views(user_id, post_id);
CREATE INDEX idx_post_views_post ON public.post_views(post_id);