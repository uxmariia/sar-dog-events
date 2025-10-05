-- Phase 1: Fix Critical PII Exposure - Update RLS Policies

-- Drop the overly permissive policy on profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create restricted policy for profiles - users can only see their own profile or admins can see all
CREATE POLICY "Users can view own profile, admins view all"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));

-- Drop the overly permissive policy on judges table
DROP POLICY IF EXISTS "Anyone can view judges" ON public.judges;

-- Create restricted policy for judges - authenticated users can view all judge info
CREATE POLICY "Authenticated users can view judges"
ON public.judges
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Phase 3: Fix Database Function Security
-- Recreate update_updated_at_column with proper security settings using OR REPLACE
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;