
-- Drop the overly permissive policy
DROP POLICY "Service role can manage live schemes" ON public.live_schemes;

-- Create specific policies: only edge functions (via service role) can write
-- No INSERT/UPDATE/DELETE policies for anon = no one can write from client
-- Edge functions using service role key bypass RLS automatically
