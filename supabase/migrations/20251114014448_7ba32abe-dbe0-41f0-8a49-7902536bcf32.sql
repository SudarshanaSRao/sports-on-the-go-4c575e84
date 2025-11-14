-- Add archived field to communities table
ALTER TABLE public.communities 
ADD COLUMN archived BOOLEAN DEFAULT false NOT NULL;

-- Add archived_at timestamp
ALTER TABLE public.communities 
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient querying of active communities
CREATE INDEX idx_communities_archived ON public.communities(archived);

-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;