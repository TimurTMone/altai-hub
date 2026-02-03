-- =============================================================================
-- AltAI Hub – Full schema (PRODUCT_PLAN.md)
-- Run once in Supabase SQL Editor. Fresh project or run after dropping old objects.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Enum types
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE profile_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role profile_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INT NOT NULL DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  links JSONB NOT NULL DEFAULT '[]',
  text TEXT,
  file_urls JSONB NOT NULL DEFAULT '[]',
  status submission_status NOT NULL DEFAULT 'pending',
  score INT,
  feedback TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS public.progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  total_xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, journey_id)
);

-- -----------------------------------------------------------------------------
-- 3. SECURITY DEFINER: is_admin() (avoids RLS recursion)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 4. Trigger: create profile on signup
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. Level formula and trigger: on submission approved → update progress
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.compute_level(xp INT)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT GREATEST(1, FLOOR(SQRT(GREATEST(0, xp) / 100.0))::INT + 1);
$$;

CREATE OR REPLACE FUNCTION public.on_submission_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_journey_id UUID;
  v_xp INT;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT journey_id, xp_reward INTO v_journey_id, v_xp
    FROM public.challenges WHERE id = NEW.challenge_id;
    INSERT INTO public.progress (user_id, journey_id, total_xp, level, updated_at)
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
$$;

DROP TRIGGER IF EXISTS on_submission_status_approved ON public.submissions;
CREATE TRIGGER on_submission_status_approved
  AFTER UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.on_submission_approved();

-- -----------------------------------------------------------------------------
-- 6. RLS: enable on all tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 7. RLS policies
-- -----------------------------------------------------------------------------
-- Profiles: read own + public read (portfolio); update own; admin read/update any
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_select_public ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_admin ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_select_public ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_select_admin ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_update_admin ON public.profiles FOR UPDATE USING (public.is_admin());

-- Journeys: users can read (public read)
DROP POLICY IF EXISTS journeys_select ON public.journeys;
CREATE POLICY journeys_select ON public.journeys FOR SELECT USING (true);
DROP POLICY IF EXISTS journeys_update_admin ON public.journeys;
CREATE POLICY journeys_update_admin ON public.journeys FOR UPDATE USING (public.is_admin());

-- Challenges: users can read; admins can update
DROP POLICY IF EXISTS challenges_select ON public.challenges;
CREATE POLICY challenges_select ON public.challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS challenges_update_admin ON public.challenges;
CREATE POLICY challenges_update_admin ON public.challenges FOR UPDATE USING (public.is_admin());

-- Submissions: users insert/read/update own; admins read/update all
DROP POLICY IF EXISTS submissions_insert_own ON public.submissions;
DROP POLICY IF EXISTS submissions_select_own ON public.submissions;
DROP POLICY IF EXISTS submissions_select_admin ON public.submissions;
DROP POLICY IF EXISTS submissions_update_own ON public.submissions;
DROP POLICY IF EXISTS submissions_update_admin ON public.submissions;
CREATE POLICY submissions_insert_own ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY submissions_select_own ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY submissions_select_admin ON public.submissions FOR SELECT USING (public.is_admin());
CREATE POLICY submissions_update_own ON public.submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY submissions_update_admin ON public.submissions FOR UPDATE USING (public.is_admin());

-- Progress: users read own; public read (portfolio); insert/update only via trigger
DROP POLICY IF EXISTS progress_select_own ON public.progress;
DROP POLICY IF EXISTS progress_select_public ON public.progress;
CREATE POLICY progress_select_own ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY progress_select_public ON public.progress FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 8. Storage bucket 'submissions' and policies
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('submissions', 'submissions', false, 5242880)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit;

-- RLS on storage.objects is usually enabled by default; ensure policies for submissions bucket
DROP POLICY IF EXISTS "submissions_upload" ON storage.objects;
CREATE POLICY "submissions_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "submissions_read_own" ON storage.objects;
CREATE POLICY "submissions_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "submissions_read_admin" ON storage.objects;
CREATE POLICY "submissions_read_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND public.is_admin());

DROP POLICY IF EXISTS "submissions_delete_own" ON storage.objects;
CREATE POLICY "submissions_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text);
