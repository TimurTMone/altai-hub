-- Fix: "infinite recursion detected in policy for relation profiles"
-- The admin policies were doing SELECT FROM profiles, which re-triggered RLS on profiles.
-- Use a SECURITY DEFINER function so the admin check bypasses RLS.

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

-- Drop the policies that caused recursion (they queried profiles inside profiles RLS)
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS submissions_select_admin ON submissions;
DROP POLICY IF EXISTS submissions_update_admin ON submissions;

-- Recreate using is_admin() so no recursive read of profiles
CREATE POLICY profiles_select_admin ON profiles FOR SELECT USING (public.is_admin());
CREATE POLICY profiles_update_admin ON profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY submissions_select_admin ON submissions FOR SELECT USING (public.is_admin());
CREATE POLICY submissions_update_admin ON submissions FOR UPDATE USING (public.is_admin());
