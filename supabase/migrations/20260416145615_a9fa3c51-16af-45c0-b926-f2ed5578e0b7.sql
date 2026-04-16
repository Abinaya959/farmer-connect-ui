
-- Drop existing restrictive SELECT and INSERT policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.farmer_sessions;
DROP POLICY IF EXISTS "Anyone can create sessions" ON public.farmer_sessions;

-- Recreate SELECT policy to allow viewing own sessions OR sessions with null user_id (guest sessions)
CREATE POLICY "Users can view own or guest sessions"
ON public.farmer_sessions
FOR SELECT
USING (user_id IS NULL OR auth.uid() = user_id);

-- Recreate INSERT policy allowing anyone (including guests) to create sessions
CREATE POLICY "Anyone can create sessions"
ON public.farmer_sessions
FOR INSERT
WITH CHECK (true);
