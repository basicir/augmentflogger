-- AugmentFlogger: Supabase Database Setup
-- Run this in the Supabase SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  fl_api_key TEXT,
  pinned_students JSONB DEFAULT '[]'::jsonb,
  recent_aerodromes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: users can only read/write their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Create flights table
CREATE TABLE IF NOT EXISTS public.flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  aircraft_registration TEXT,
  pilot_function TEXT,
  flight_rules TEXT,
  time_of_day TEXT,
  flight_type TEXT,
  departure_aerodrome TEXT,
  destination_aerodrome TEXT,
  desired_flight_time TEXT,
  selected_program TEXT,
  selected_task TEXT,
  programs_cache JSONB,
  task_exercises_cache JSONB,
  task_description_cache TEXT,
  grades JSONB,
  exercise_comments JSONB,
  general_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Prevent multiple ongoing flights per instructor
CREATE UNIQUE INDEX unique_ongoing_flight ON public.flights (instructor_id) WHERE end_time IS NULL;

-- 6. Enable RLS on flights
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for flights
CREATE POLICY "Users can read own flights"
  ON public.flights
  FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Users can insert own flights"
  ON public.flights
  FOR INSERT
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Users can update own flights"
  ON public.flights
  FOR UPDATE
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Users can delete own flights"
  ON public.flights
  FOR DELETE
  USING (auth.uid() = instructor_id);

-- 4. Optional: auto-create profile on user signup (alternative to client-side creation)
-- You can enable this trigger if you want a server-side fallback
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, username)
--   VALUES (NEW.id, SPLIT_PART(NEW.email, '@', 1))
--   ON CONFLICT (id) DO NOTHING;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Web Push Notifications Support
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions"
  ON public.push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. Add push_notified_at to flights
ALTER TABLE public.flights ADD COLUMN IF NOT EXISTS push_notified_at TIMESTAMPTZ;

-- 10. Enable pg_cron and pg_net (these require superuser)
-- IMPORTANT: Run these manually in the Supabase SQL Editor if they are not enabled yet.
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- 11. Schedule the cron job to call the edge function every minute
-- IMPORTANT: Run this manually in the Supabase SQL Editor, replacing YOUR_PROJECT_REF and SERVICE_ROLE_KEY.
-- SELECT cron.schedule(
--   'invoke-flight-push-worker',
--   '* * * * *',
--   $$
--   SELECT net.http_post(
--       url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/flight-push-worker',
--       headers:='{"Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
--       body:='{}'::jsonb
--   );
--   $$
-- );
