-- Enum types
CREATE TYPE profile_role AS ENUM ('user', 'admin');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles (synced from auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role profile_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Journeys
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INT NOT NULL DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  links JSONB NOT NULL DEFAULT '[]',
  text TEXT,
  file_urls JSONB NOT NULL DEFAULT '[]',
  status submission_status NOT NULL DEFAULT 'pending',
  score INT,
  feedback TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

-- Progress (one row per user per journey)
CREATE TABLE progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  total_xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, journey_id)
);

-- Level formula: level = floor(sqrt(total_xp / 100)) + 1
CREATE OR REPLACE FUNCTION public.compute_level(xp INT)
RETURNS INT AS $$
  SELECT GREATEST(1, FLOOR(SQRT(xp / 100.0))::INT + 1);
$$ LANGUAGE sql IMMUTABLE;

-- Trigger: on submission approved, add XP and update progress
CREATE OR REPLACE FUNCTION public.on_submission_approved()
RETURNS TRIGGER AS $$
DECLARE
  v_journey_id UUID;
  v_xp INT;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT journey_id, xp_reward INTO v_journey_id, v_xp
    FROM challenges WHERE id = NEW.challenge_id;
    INSERT INTO progress (user_id, journey_id, total_xp, level, updated_at)
    VALUES (
      NEW.user_id,
      v_journey_id,
      v_xp,
      public.compute_level(v_xp),
      now()
    )
    ON CONFLICT (user_id, journey_id) DO UPDATE SET
      total_xp = progress.total_xp + v_xp,
      level = public.compute_level(progress.total_xp + v_xp),
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_status_approved
  AFTER UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION public.on_submission_approved();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Profiles: read/update own; admin can read/update any
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_select_admin ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_update_admin ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: allow public read for portfolio (by username)
CREATE POLICY profiles_select_public ON profiles FOR SELECT USING (true);

-- Journeys, challenges: public read
CREATE POLICY journeys_select ON journeys FOR SELECT USING (true);
CREATE POLICY challenges_select ON challenges FOR SELECT USING (true);

-- Submissions: user insert own, select own; admin select/update all
CREATE POLICY submissions_insert_own ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY submissions_select_own ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY submissions_select_admin ON submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY submissions_update_admin ON submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Progress: user read own; insert/update only via trigger (service role or definer)
CREATE POLICY progress_select_own ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY progress_select_public ON progress FOR SELECT USING (true);

-- Service role / trigger runs as definer so progress upsert is allowed from trigger.
-- No policy for INSERT/UPDATE from app; trigger does it.
