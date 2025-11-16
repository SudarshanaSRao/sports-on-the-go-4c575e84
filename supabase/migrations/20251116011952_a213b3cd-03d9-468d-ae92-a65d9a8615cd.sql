-- Ensure REPLICA IDENTITY FULL is set for real-time updates
ALTER TABLE public.notifications REPLICA IDENTITY FULL;