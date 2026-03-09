/*
  # Add Event Hub Tables and Enums

  1. Enums
    - user_role: student, organizer, admin
    - event_type: online, in_person
    - event_category: seminar, workshop, conference, party, sports, tech, gaming, academic

  2. New Tables
    - events: Campus events with all details
    - event_registrations: Track student registrations
    - event_comments: Discussion comments on events
    - favorite_events: Users' favorite events

  3. Security
    - RLS enabled on all new tables
    - Proper access control policies
*/

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_type AS ENUM ('online', 'in_person');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_category AS ENUM ('seminar', 'workshop', 'conference', 'party', 'sports', 'tech', 'gaming', 'academic');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'university_email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN university_email text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'university_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN university_verified boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'student';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category event_category NOT NULL,
  event_type event_type NOT NULL,
  location text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  banner_image_url text,
  price decimal(10, 2) DEFAULT 0,
  max_attendees integer,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tickets_quantity integer DEFAULT 1 NOT NULL,
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'confirmed',
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorite_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view registrations for their events"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM events WHERE events.id = event_id AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own registration"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own registration"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Everyone can view comments"
  ON event_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON event_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comment authors can update their comments"
  ON event_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comment authors can delete their comments"
  ON event_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their favorites"
  ON favorite_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON favorite_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove favorites"
  ON favorite_events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON event_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorite_events(user_id);
