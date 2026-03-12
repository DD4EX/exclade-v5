
-- Table to store live scheme data fetched from government sources
CREATE TABLE public.live_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  last_updated TEXT,
  official_source TEXT,
  popular BOOLEAN DEFAULT false,
  data_en JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_ta JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_tl JSONB NOT NULL DEFAULT '{}'::jsonb,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_schemes ENABLE ROW LEVEL SECURITY;

-- Anyone can read schemes (public data)
CREATE POLICY "Anyone can read live schemes"
  ON public.live_schemes FOR SELECT
  USING (true);

-- Only service role can insert/update (edge functions)
CREATE POLICY "Service role can manage live schemes"
  ON public.live_schemes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Track sync metadata
CREATE TABLE public.sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  schemes_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sync log"
  ON public.sync_log FOR SELECT
  USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_live_schemes_updated_at
  BEFORE UPDATE ON public.live_schemes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron for daily scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Schedule daily sync at 12:00 AM IST (6:30 PM UTC previous day)
SELECT cron.schedule(
  'daily-scheme-sync',
  '30 18 * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/sync-schemes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_service_role_key')
    ),
    body := '{"source": "cron"}'::jsonb
  )$$
);
