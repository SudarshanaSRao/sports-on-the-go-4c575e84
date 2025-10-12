-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for account status
CREATE TYPE public.account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('USER', 'ADMIN');

-- Create profiles table (extended user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT UNIQUE,
  profile_photo TEXT,
  bio TEXT CHECK (char_length(bio) <= 300),
  date_of_birth DATE NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Verification
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT false,
  id_verified BOOLEAN DEFAULT false,
  
  -- Reputation
  overall_rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (overall_rating >= 0 AND overall_rating <= 5),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  games_hosted INTEGER DEFAULT 0 CHECK (games_hosted >= 0),
  games_attended INTEGER DEFAULT 0 CHECK (games_attended >= 0),
  no_show_count INTEGER DEFAULT 0 CHECK (no_show_count >= 0),
  
  -- Settings
  notification_prefs JSONB DEFAULT '{"email": true, "push": false, "sms": false}'::jsonb,
  account_status account_status DEFAULT 'ACTIVE',
  role user_role DEFAULT 'USER',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_login_at TIMESTAMPTZ
);

-- Create sports enum
CREATE TYPE public.sport_type AS ENUM (
  'BASKETBALL',
  'SOCCER', 
  'VOLLEYBALL',
  'TENNIS',
  'BASEBALL',
  'FOOTBALL',
  'ULTIMATE_FRISBEE',
  'CRICKET',
  'RUGBY',
  'HOCKEY',
  'OTHER'
);

-- Create skill level enum
CREATE TYPE public.skill_level AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
  'ALL_LEVELS'
);

-- Create game visibility enum
CREATE TYPE public.game_visibility AS ENUM (
  'PUBLIC',
  'FRIENDS_ONLY',
  'INVITE_ONLY'
);

-- Create game status enum
CREATE TYPE public.game_status AS ENUM (
  'UPCOMING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Sport details
  sport sport_type NOT NULL,
  skill_level skill_level NOT NULL,
  
  -- Location
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Schedule
  game_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  
  -- Game details
  max_players INTEGER NOT NULL CHECK (max_players >= 2 AND max_players <= 50),
  current_players INTEGER DEFAULT 1 CHECK (current_players >= 0),
  cost_per_person DECIMAL(6, 2) DEFAULT 0.00 CHECK (cost_per_person >= 0),
  equipment_requirements TEXT,
  description TEXT CHECK (char_length(description) <= 500),
  game_rules TEXT,
  
  -- Settings
  visibility game_visibility DEFAULT 'PUBLIC',
  status game_status DEFAULT 'UPCOMING',
  is_recurring BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_game_datetime CHECK (game_date >= CURRENT_DATE)
);

-- Create RSVP status enum
CREATE TYPE public.rsvp_status AS ENUM (
  'CONFIRMED',
  'WAITLISTED',
  'CANCELLED'
);

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  status rsvp_status DEFAULT 'CONFIRMED' NOT NULL,
  waitlist_position INTEGER,
  
  -- Attendance tracking
  attended BOOLEAN,
  marked_no_show BOOLEAN DEFAULT false,
  
  -- Timestamps
  rsvp_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  cancelled_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(game_id, user_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Ratings (1-5 stars each)
  showed_up_on_time DECIMAL(2, 1) CHECK (showed_up_on_time >= 1 AND showed_up_on_time <= 5),
  skill_accurate DECIMAL(2, 1) CHECK (skill_accurate >= 1 AND skill_accurate <= 5),
  good_sportsmanship DECIMAL(2, 1) CHECK (good_sportsmanship >= 1 AND good_sportsmanship <= 5),
  would_play_again DECIMAL(2, 1) CHECK (would_play_again >= 1 AND would_play_again <= 5),
  
  -- Overall calculated rating
  overall_rating DECIMAL(3, 2) GENERATED ALWAYS AS (
    (showed_up_on_time + skill_accurate + good_sportsmanship + would_play_again) / 4
  ) STORED,
  
  -- Optional comment
  comment TEXT CHECK (char_length(comment) <= 200),
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Constraints
  UNIQUE(game_id, reviewer_id, reviewee_id),
  CHECK (reviewer_id != reviewee_id)
);

-- Create user_sports junction table (many-to-many)
CREATE TABLE public.user_sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sport sport_type NOT NULL,
  skill_level skill_level NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  UNIQUE(user_id, sport)
);

-- Create indexes for performance
CREATE INDEX idx_games_host_id ON public.games(host_id);
CREATE INDEX idx_games_sport ON public.games(sport);
CREATE INDEX idx_games_game_date ON public.games(game_date);
CREATE INDEX idx_games_location ON public.games(latitude, longitude);
CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_rsvps_game_id ON public.rsvps(game_id);
CREATE INDEX idx_rsvps_user_id ON public.rsvps(user_id);
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_user_sports_user_id ON public.user_sports(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for games
CREATE POLICY "Public games are viewable by everyone"
  ON public.games FOR SELECT
  USING (visibility = 'PUBLIC' OR host_id = auth.uid());

CREATE POLICY "Authenticated users can create games"
  ON public.games FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own games"
  ON public.games FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own games"
  ON public.games FOR DELETE
  USING (auth.uid() = host_id);

-- RLS Policies for RSVPs
CREATE POLICY "Users can view RSVPs for games they're involved in"
  ON public.rsvps FOR SELECT
  USING (
    user_id = auth.uid() OR 
    game_id IN (SELECT id FROM public.games WHERE host_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create RSVPs"
  ON public.rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs"
  ON public.rsvps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON public.rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for games they attended"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.rsvps 
      WHERE game_id = reviews.game_id 
      AND user_id = auth.uid()
      AND attended = true
    )
  );

-- RLS Policies for user_sports
CREATE POLICY "User sports are viewable by everyone"
  ON public.user_sports FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own sports"
  ON public.user_sports FOR ALL
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    date_of_birth,
    city,
    zip_code
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'zip_code', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update game player count
CREATE OR REPLACE FUNCTION public.update_game_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'CONFIRMED' THEN
    UPDATE public.games 
    SET current_players = current_players + 1
    WHERE id = NEW.game_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'CONFIRMED' AND NEW.status != 'CONFIRMED' THEN
      UPDATE public.games 
      SET current_players = current_players - 1
      WHERE id = NEW.game_id;
    ELSIF OLD.status != 'CONFIRMED' AND NEW.status = 'CONFIRMED' THEN
      UPDATE public.games 
      SET current_players = current_players + 1
      WHERE id = NEW.game_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'CONFIRMED' THEN
    UPDATE public.games 
    SET current_players = current_players - 1
    WHERE id = OLD.game_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for player count
CREATE TRIGGER update_player_count
  AFTER INSERT OR UPDATE OR DELETE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_game_player_count();