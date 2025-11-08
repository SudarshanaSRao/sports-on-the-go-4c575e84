-- Add unique constraint to username field to prevent duplicate usernames
-- This ensures each username is unique across all users
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);