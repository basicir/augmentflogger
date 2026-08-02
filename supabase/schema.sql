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
